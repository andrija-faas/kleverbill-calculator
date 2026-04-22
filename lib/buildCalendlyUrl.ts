import type { FormState, CalcResults, Plan } from '@/types/calculator.types'

const CALENDLY_BASE = 'https://calendly.com/kleverbill/kleverbill-analyse-rechner'

export function buildCalendlyUrl(formState: FormState, results: CalcResults, plan: Plan): string {
  const { hscMode } = formState

  const eur = (n: number) => Math.round(n).toString()

  // ── utm_content: monetary outputs ────────────────────────────────────────────
  const utmContent = [
    `MIV:${eur(results.MIV)}`,
    `EMRL:${eur(results.EMRL)}`,
    `RD:${eur(results.RD)}`,
    `RR:${eur(results.RR)}`,
    `ICC:${eur(results.ICC)}`,
    `DC:${eur(results.DC)}`,
    `ERUV:${eur(results.ERUV)}`,
    `ELS:${eur(results.ELS)}`,
    `ACB:${eur(results.ACB)}`,
    `MRV:${eur(results.MRV)}`,
  ].join('|')

  // ── utm_term: plan + ROI ─────────────────────────────────────────────────────
  const roi = plan.price ? Math.round(results.MRV / plan.price) : null
  const utmTerm = [
    `Plan:${plan.tier}`,
    roi !== null ? `ROI:${roi}x` : 'ROI:n/a',
  ].join('|')

  // ── Assemble URL ─────────────────────────────────────────────────────────────
  const url = new URL(CALENDLY_BASE)
  url.searchParams.set('utm_source', 'calculator')
  url.searchParams.set('utm_medium', hscMode === 'total' ? 'hsc' : 'hsci')
  url.searchParams.set('utm_content', utmContent)
  url.searchParams.set('utm_term', utmTerm)

  return url.toString()
}
