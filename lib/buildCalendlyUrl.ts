import type { FormState } from '@/types/calculator.types'

const CALENDLY_BASE = 'https://calendly.com/kleverbill/kleverbill-analyse-rechner'

// Defaults mirror store.ts DEFAULT_FORM — used to decide which values get a
// "Default[...]" marker vs a real value in the UTM params.
const DEFAULTS = {
  latePaymentRate: 0.20,
  unpaidRate: 0.05,
  chasingHours: 10,
  hourlyInternalCost: 35,
  teamMembers: 1,
  krrScenario: 'standard' as const,
  krr: 0.50,
}

function pct(n: number): string {
  return `${Math.round(n * 100)}%`
}

export function buildCalendlyUrl(formState: FormState): string {
  const {
    invoiceCount,
    avgInvoiceValue,
    hscMode,
    latePaymentRate,
    unpaidRate,
    chasingHours,
    chasingHoursPerInvoice,
    hourlyInternalCost,
    teamMembers,
    krrScenario,
    krr,
  } = formState

  // ── utm_content: Step 1 inputs + rates ──────────────────────────────────────
  const lprTag =
    latePaymentRate === DEFAULTS.latePaymentRate
      ? `LPR:Default[${pct(DEFAULTS.latePaymentRate)}]`
      : `LPR:${pct(latePaymentRate)}`

  const urTag =
    unpaidRate === DEFAULTS.unpaidRate
      ? `UR:Default[${pct(DEFAULTS.unpaidRate)}]`
      : `UR:${pct(unpaidRate)}`

  const utmContent = [`IN:${invoiceCount}`, `AVGIV:${avgInvoiceValue}`, lprTag, urTag].join('|')

  // ── utm_term: Step 2 + Step 4 ───────────────────────────────────────────────
  const hscTag =
    hscMode === 'total'
      ? chasingHours === DEFAULTS.chasingHours
        ? `HSC:Default[${DEFAULTS.chasingHours}h]`
        : `HSC:${chasingHours}h`
      : `HSCI:${chasingHoursPerInvoice}h`

  const hicTag =
    hourlyInternalCost === DEFAULTS.hourlyInternalCost
      ? `HIC:Default[€${DEFAULTS.hourlyInternalCost}]`
      : `HIC:€${hourlyInternalCost}`

  const tmTag =
    teamMembers === DEFAULTS.teamMembers
      ? `TM:Default[${DEFAULTS.teamMembers}]`
      : `TM:${teamMembers}`

  const krrDefault =
    krrScenario === DEFAULTS.krrScenario && krr === DEFAULTS.krr
  const krrTag = krrDefault
    ? `KRR:Default[${DEFAULTS.krrScenario}-${pct(DEFAULTS.krr)}]`
    : `KRR:${krrScenario}-${pct(krr)}`

  const utmTerm = [hscTag, hicTag, tmTag, krrTag].join('|')

  // ── Assemble URL ─────────────────────────────────────────────────────────────
  const url = new URL(CALENDLY_BASE)
  url.searchParams.set('utm_source', 'calculator')
  url.searchParams.set('utm_medium', hscMode === 'total' ? 'hsc' : 'hsci')
  url.searchParams.set('utm_content', utmContent)
  url.searchParams.set('utm_term', utmTerm)

  return url.toString()
}
