# Calendly → Email Integration Plan

When a user books a Calendly appointment after completing the calculator, the operator receives two emails:
1. Calendly's own booking notification (automatic, no work needed)
2. A custom email with the user's name, email, and decoded calculator form data

---

## Architecture

```
User opens Calendly modal (UTM params injected with form inputs)
  → Books appointment (Calendly collects name + email)
  → Calendly fires webhook → POST /api/calendly-webhook
  → API route verifies signature, decodes UTM params
  → Sends formatted email to operator via Resend
```

---

## Part 1 — UTM encoding (frontend)

When the Calendly modal opens, `CtaSection` reads `formState` and builds the URL fresh each time (so slider adjustments between opens are always reflected).

Each field is compared against `DEFAULT_FORM`. If the user left it untouched it is marked `Default[value]`; if they changed it the raw value is used.

**Param structure:**

| UTM param | Contents | Example |
|---|---|---|
| `utm_source` | Fixed: `"calculator"` | `calculator` |
| `utm_medium` | HSC mode | `hsc` or `hsci` |
| `utm_content` | Step 1 inputs | `IN:120\|AVGIV:1500\|LPR:Default[20%]\|UR:8%` |
| `utm_term` | Step 2 + Step 4 inputs | `HSC:Default[10h]\|HIC:Default[€35]\|TM:Default[1]\|KRR:Default[standard-60%]` |

**Encoding rules per field:**

| Field | Default | Untouched | Changed example |
|---|---|---|---|
| `invoiceCount` | none | — (always real) | `IN:120` |
| `avgInvoiceValue` | none | — (always real) | `AVGIV:1500` |
| `latePaymentRate` | 20% | `LPR:Default[20%]` | `LPR:30%` |
| `unpaidRate` | 5% | `UR:Default[5%]` | `UR:8%` |
| `chasingHours` (HSC mode) | 10h | `HSC:Default[10h]` | `HSC:15h` |
| `chasingHoursPerInvoice` (HSCI mode) | none | — (always real) | `HSCI:0.5h` |
| `hourlyInternalCost` | €35 | `HIC:Default[€35]` | `HIC:€50` |
| `teamMembers` | 1 | `TM:Default[1]` | `TM:3` |
| `krrScenario` | standard | `KRR:Default[standard-60%]` | `KRR:aggressive-75%` |

`invoiceCount` and `avgInvoiceValue` have no defaults — the form requires them before the user can reach the results page, so they will always carry real values.

---

## Part 2 — Next.js webhook API route

**File:** `app/api/calendly-webhook/route.ts`

### 1. Signature verification
Calendly sends `Calendly-Webhook-Signature: t=<timestamp>,v1=<hmac>` on every request.
Compute HMAC-SHA256 over `timestamp + "." + rawBody` using `CALENDLY_WEBHOOK_SECRET`.
Reject anything that doesn't match before parsing. Return `401`.

### 2. Payload parsing
Extract from the Calendly payload:

```
payload.invitee.name
payload.invitee.email
payload.scheduled_event.start_time
payload.tracking.utm_source
payload.tracking.utm_medium    → hscMode
payload.tracking.utm_content   → split on | → IN, AVGIV, LPR, UR
payload.tracking.utm_term      → split on | → HSC/HSCI, HIC, TM, KRR
```

### 3. Send email via Resend

```ts
await resend.emails.send({
  from: 'calculator@yourdomain.com',
  to: 'operator@kleverbill.de',
  subject: `New booking — ${invitee.name}`,
  html: formattedEmail,
})
```

### 4. Return 200 OK
Always return `200` regardless of Resend's response (log errors internally).
Calendly retries on anything else, which would send duplicate emails.

---

## Part 3 — Email format

The operator receives:

```
Name:       Jane Smith
Email:      jane@company.com
Booked for: 20 Apr 2026, 10:00

─── Form data ───────────────────────
Mode:       HSC-I
IN:         120
AVGIV:      €1,500
LPR:        Default [20%]
UR:         8%
HSCI:       0.5h
HIC:        Default [€35]
TM:         Default [1]
KRR:        Default [standard – 60%]
```

`Default[...]` markers come through as-is from the UTM strings — no extra logic needed in the formatter.

---

## Part 4 — Calendly setup

In the Calendly dashboard (paid plan required):

1. **Integrations → Webhooks → Create webhook**
2. URL: `https://your-domain.com/api/calendly-webhook`
3. Event: `invitee.created` only
4. Copy the signing key → store as `CALENDLY_WEBHOOK_SECRET`

---

## Part 5 — Environment variables

```
CALENDLY_WEBHOOK_SECRET     # Calendly dashboard → Integrations → Webhooks
RESEND_API_KEY              # Resend dashboard → API Keys
```

---

## Part 6 — Deployment

**Vercel** is the natural host (zero-config Next.js, serverless functions handle the API route).

For local testing before deployment, use **ngrok**:
- Run `ngrok http 3000` to get a public URL
- Point a test Calendly webhook at the ngrok URL
- Book a test appointment and inspect the raw payload before writing the parser

---

## Implementation order

| Step | Reason |
|---|---|
| 1. Deploy to Vercel | Need a real public URL before Calendly can reach the webhook |
| 2. Create the API route — verify signature, log payload, return 200 | Lets you inspect a real Calendly payload before writing the parser |
| 3. Register the webhook in Calendly, book a test appointment | Confirm the payload structure and that UTM params survive end-to-end |
| 4. Add UTM encoding to `CtaSection` / `CalendlyModal` | Build against a known real payload |
| 5. Add the Resend email call | Wire everything together once inputs and output format are confirmed |
| 6. Book a real end-to-end test | Verify the operator email arrives with correct data |
