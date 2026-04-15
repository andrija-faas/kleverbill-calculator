import type { FormState, CalcResults, SliderState } from '@/types/calculator.types'

// ─── Constants ───────────────────────────────────────────────────────────────

export const KARR = 0.70   // Kleverbill automation reduction rate
export const KDIF = 0.15   // Kleverbill delay improvement factor
export const DC_RATE = 0.05 // Delay cost flat rate

export const KRR_VALUES = {
  conservative: 0.40,
  standard: 0.60,
  aggressive: 0.75,
} as const

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function roundTo500(n: number): number {
  return Math.round(n / 500) * 500
}

export function formatEur(n: number): string {
  return '€\u202f' + Math.round(n).toLocaleString('de-DE')
}

export function formatRange(low: number, high: number): string {
  return `${formatEur(roundTo500(low))} – ${formatEur(roundTo500(high))}`
}

export function formatRoi(roi: number): string {
  return `${Math.round(roi)}x`
}

// ─── MIV derivation ──────────────────────────────────────────────────────────

export function deriveMIV(form: FormState): number {
  return (form.invoiceCount ?? 0) * (form.avgInvoiceValue ?? 0)
}

// ─── ICC derivation ──────────────────────────────────────────────────────────

export function deriveICC(form: FormState, LPR: number, IN: number | null, TM: number): number {
  if (form.hscMode === 'total') {
    return form.chasingHours * form.hourlyInternalCost * TM
  }
  const hsci = form.chasingHoursPerInvoice ?? 0
  const invoices = IN ?? 0
  return hsci * (invoices * LPR) * form.hourlyInternalCost * TM
}

// ─── Core calculation ─────────────────────────────────────────────────────────
//
//   MIV  = MR  (or IN × AVGIV)
//   RD   = MIV × LPR
//   RR   = MIV × UR
//   ICC  = HSC × HIC  (or HSCI × (IN × LPR) × HIC)
//   DC   = RD × 0.05
//   EMRL = RR + ICC + DC
//   ERUV = RR × KRR
//   ELS  = ICC × 0.70
//   ACB  = RD × 0.15
//   MRV  = ERUV + ELS
//
// ─────────────────────────────────────────────────────────────────────────────

export function calculate(
  form: FormState,
  sliders: SliderState,
): CalcResults {
  const MIV = deriveMIV(form)
  const IN  = form.invoiceCount

  const LPR = sliders.lpr
  const UR  = sliders.ur
  const HIC = sliders.hic
  const TM  = sliders.tm
  const KRR = sliders.krr

  const formWithSliders: FormState = {
    ...form,
    hourlyInternalCost: HIC,
    chasingHours: sliders.hsc,
    krr: KRR,
  }

  const RD  = MIV * LPR
  const RR  = MIV * UR
  const DC  = RD * DC_RATE
  const ICC = deriveICC(formWithSliders, LPR, IN, TM)

  const EMRL    = RR + ICC + DC
  const ERUV    = RR * KRR
  const ERUVLow  = RR * KRR_VALUES.conservative
  const ERUVHigh = RR * KRR_VALUES.aggressive
  const ELS     = ICC * KARR
  const ACB     = RD * KDIF
  const MRV     = ERUV + ELS

  return {
    MIV,
    RD,
    RR,
    ICC,
    DC,
    EMRL,
    ERUV,
    ERUVLow,
    ERUVHigh,
    ELS,
    ACB,
    MRV,
  }
}
