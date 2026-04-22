import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

// ─── Signature verification ───────────────────────────────────────────────────

async function verifySignature(
  signature: string | null,
  rawBody: string,
): Promise<boolean> {
  const secret = process.env.CALENDLY_WEBHOOK_SECRET
  // If no secret is configured, skip verification (no signing key from Calendly)
  if (!secret) return true
  if (!signature) return false

  // Header format: "t=<timestamp>,v1=<hmac>"
  const parts = Object.fromEntries(
    signature.split(',').map((p) => p.split('=')),
  )
  const timestamp = parts['t']
  const receivedHmac = parts['v1']
  if (!timestamp || !receivedHmac) return false

  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const data = new TextEncoder().encode(`${timestamp}.${rawBody}`)
  const signatureBuffer = await crypto.subtle.sign('HMAC', key, data)
  const computedHmac = Buffer.from(signatureBuffer).toString('hex')

  return computedHmac === receivedHmac
}

// ─── UTM decoder ─────────────────────────────────────────────────────────────

function decodeUtm(utm: string): Record<string, string> {
  return Object.fromEntries(
    utm.split('|').map((part) => {
      const idx = part.indexOf(':')
      return [part.slice(0, idx), part.slice(idx + 1)]
    }),
  )
}

// ─── Email formatter ─────────────────────────────────────────────────────────

function formatEmail(payload: CalendlyPayload): string {
  const { name, email, startTime, hscMode, content, term } = payload

  const bookedFor = new Date(startTime).toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/Berlin',
  })

  const row = (label: string, value: string) =>
    `<tr><td style="padding:2px 16px 2px 0;color:#6b7280;white-space:nowrap">${label}</td><td style="padding:2px 0">${value}</td></tr>`

  const formRows = [
    row('Mode', hscMode === 'hsci' ? 'HSC-I (per invoice)' : 'HSC (total hours)'),
    row('IN', content['IN'] ?? '—'),
    row('AVGIV', content['AVGIV'] ? `€${content['AVGIV']}` : '—'),
    row('LPR', content['LPR'] ?? '—'),
    row('UR', content['UR'] ?? '—'),
    hscMode === 'hsci'
      ? row('HSCI', term['HSCI'] ?? '—')
      : row('HSC', term['HSC'] ?? '—'),
    row('HIC', term['HIC'] ?? '—'),
    row('TM', term['TM'] ?? '—'),
    row('KRR', term['KRR'] ?? '—'),
  ]

  return `
<div style="font-family:sans-serif;font-size:14px;color:#111;max-width:480px">
  <table style="border-collapse:collapse;margin-bottom:24px">
    ${row('Name', name)}
    ${row('Email', `<a href="mailto:${email}">${email}</a>`)}
    ${row('Booked for', bookedFor)}
  </table>
  <hr style="border:none;border-top:1px solid #e5e7eb;margin-bottom:24px"/>
  <p style="margin:0 0 12px;font-weight:600;color:#374151">Form data</p>
  <table style="border-collapse:collapse">
    ${formRows.join('\n')}
  </table>
</div>
`
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface CalendlyPayload {
  name: string
  email: string
  startTime: string
  hscMode: string
  content: Record<string, string>
  term: Record<string, string>
}

// ─── Handler ──────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const rawBody = await req.text()
  const signature = req.headers.get('Calendly-Webhook-Signature')

  const valid = await verifySignature(signature, rawBody)
  if (!valid) {
    console.error('[calendly-webhook] invalid signature')
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: Record<string, unknown>
  try {
    body = JSON.parse(rawBody)
  } catch {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 })
  }

  // Only handle invitee.created events
  const event = body['event'] as string | undefined
  if (event !== 'invitee.created') {
    return NextResponse.json({ ok: true })
  }

  console.log('[calendly-webhook] raw payload', rawBody.slice(0, 1000))

  const p = body['payload'] as Record<string, unknown>
  const invitee = (p['invitee'] ?? {}) as Record<string, unknown>
  const scheduledEvent = (p['scheduled_event'] ?? {}) as Record<string, unknown>
  const tracking = p['tracking'] as Record<string, string> | undefined

  const name = (invitee['name'] as string) ?? 'Unknown'
  const email = (invitee['email'] as string) ?? ''
  const startTime = (scheduledEvent['start_time'] as string) ?? ''
  const hscMode = tracking?.['utm_medium'] ?? 'hsc'
  const content = tracking?.['utm_content'] ? decodeUtm(tracking['utm_content']) : {}
  const term = tracking?.['utm_term'] ? decodeUtm(tracking['utm_term']) : {}

  const payload: CalendlyPayload = { name, email, startTime, hscMode, content, term }

  const { data, error } = await resend.emails.send({
    from: 'info@faasflow.com',
    to: 'andrija.varga@faasflow.com',
    subject: `New booking — ${name}`,
    html: formatEmail(payload),
  })
  if (error) {
    console.error('[calendly-webhook] resend error', JSON.stringify(error))
  } else {
    console.log('[calendly-webhook] email sent', data?.id)
  }

  return NextResponse.json({ ok: true })
}
