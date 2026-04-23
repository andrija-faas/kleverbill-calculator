import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

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
  const { name, email, startTime, content, term } = payload

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

  const eur = (key: string) => {
    const val = content[key]
    return val ? `€ ${Number(val).toLocaleString('de-DE')}` : '—'
  }

  const outputRows = [
    row('Monthly Invoiced Value', eur('MIV')),
    row('Estimated Monthly Receivables Lost', eur('EMRL')),
    row('Revenue Delayed', eur('RD')),
    row('Revenue at Risk', eur('RR')),
    row('Spent on Manual Chasing', eur('ICC')),
    row('Delay Cost', eur('DC')),
    row('Estimated Recoverable Unpaid Value', eur('ERUV')),
    row('Estimated Labour Savings', eur('ELS')),
    row('Accelerated Cash Benefit', eur('ACB')),
    row('Monthly Recoverable Value', eur('MRV')),
    row('Recommended Plan', term['Plan'] ?? '—'),
    row('Return on Investment', term['ROI'] ?? '—'),
  ]

  return `
<div style="font-family:sans-serif;font-size:14px;color:#111;max-width:520px">
  <table style="border-collapse:collapse;margin-bottom:24px">
    ${row('Name', name)}
    ${row('Email', `<a href="mailto:${email}">${email}</a>`)}
    ${row('Booked for', bookedFor)}
  </table>
  <hr style="border:none;border-top:1px solid #e5e7eb;margin-bottom:24px"/>
  <p style="margin:0 0 12px;font-weight:600;color:#374151">Calculator results</p>
  <table style="border-collapse:collapse">
    ${outputRows.join('\n')}
  </table>
</div>
`
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface CalendlyPayload {
  name: string
  email: string
  startTime: string
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

  const p = body['payload'] as Record<string, unknown>
const scheduledEvent = (p['scheduled_event'] ?? {}) as Record<string, unknown>
  const tracking = p['tracking'] as Record<string, string> | undefined

  const name = (p['name'] as string) ?? 'Unknown'
  const email = (p['email'] as string) ?? ''
  const startTime = (scheduledEvent['start_time'] as string) ?? ''
  const content = tracking?.['utm_content'] ? decodeUtm(tracking['utm_content']) : {}
  const term = tracking?.['utm_term'] ? decodeUtm(tracking['utm_term']) : {}

  const payload: CalendlyPayload = { name, email, startTime, content, term }

  const resend = new Resend(process.env.RESEND_API_KEY)
  const { data, error } = await resend.emails.send({
    from: 'info@faasflow.com',
    to: ['andrija.varga@faasflow.com', 'info@kleverbill.de'],
    subject: `New booking — ${name}`,
    html: formatEmail(payload),
  })
  if (error) {
    console.error('[calendly-webhook] resend error', JSON.stringify(error))
  }

  return NextResponse.json({ ok: true })
}
