import { describe, it, expect } from 'vitest'
import { calculate, roundTo500, formatEur, formatRange } from '../calculations'
import type { FormState, SliderState } from '@/types/calculator.types'

// ─── Test fixture matching the verified reference run ─────────────────────────
//
//   IN = 40, AVGIV = 2000, MIV = 80000, LPR = 30%, UR = 6%
//   HSC = 10, HIC = 40, KRR = 60%
//
//   Expected:
//     MIV  = 80000
//     RD   = 24000   (80000 × 0.30)
//     RR   = 4800    (80000 × 0.06)
//     ICC  = 400     (10 × 40)
//     DC   = 1200    (24000 × 0.05)
//     EMRL = 6400    (4800 + 400 + 1200)
//     ERUV = 2880    (4800 × 0.60)
//     ELS  = 280     (400 × 0.70)
//     ACB  = 3600    (24000 × 0.15)
//     MRV  = 3160    (2880 + 280)
//     ROI  = 15.88x  (3160 / 199)
//
// ─────────────────────────────────────────────────────────────────────────────

const BASE_FORM: FormState = {
  invoiceCount: 40,
  avgInvoiceValue: 2000,
  hscMode: 'total',
  chasingHours: 10,
  chasingHoursPerInvoice: null,
  teamMembers: 1,
  latePaymentRate: 0.30,
  unpaidRate: 0.06,
  hourlyInternalCost: 40,
  krrScenario: 'standard',
  krr: 0.60,
}

const BASE_SLIDERS: SliderState = {
  lpr: 0.30,
  ur: 0.06,
  hsc: 10,
  hic: 40,
  tm: 1,
  krr: 0.60,
}

describe('calculate()', () => {
  it('derives correct MIV from IN × AVGIV', () => {
    const r = calculate(BASE_FORM, BASE_SLIDERS)
    expect(r.MIV).toBe(80000)
  })

  it('calculates RD correctly', () => {
    const r = calculate(BASE_FORM, BASE_SLIDERS)
    expect(r.RD).toBe(24000)
  })

  it('calculates RR correctly', () => {
    const r = calculate(BASE_FORM, BASE_SLIDERS)
    expect(r.RR).toBe(4800)
  })

  it('calculates ICC correctly (total hours mode)', () => {
    const r = calculate(BASE_FORM, BASE_SLIDERS)
    expect(r.ICC).toBe(400)
  })

  it('calculates DC correctly (5% of RD)', () => {
    const r = calculate(BASE_FORM, BASE_SLIDERS)
    expect(r.DC).toBe(1200)
  })

  it('calculates EMRL correctly', () => {
    const r = calculate(BASE_FORM, BASE_SLIDERS)
    expect(r.EMRL).toBe(6400)
  })

  it('calculates ERUV correctly at KRR 60%', () => {
    const r = calculate(BASE_FORM, BASE_SLIDERS)
    expect(r.ERUV).toBe(2880)
  })

  it('calculates ELS correctly (ICC × 70%)', () => {
    const r = calculate(BASE_FORM, BASE_SLIDERS)
    expect(r.ELS).toBeCloseTo(280)
  })

  it('calculates ACB correctly (RD × 15%)', () => {
    const r = calculate(BASE_FORM, BASE_SLIDERS)
    expect(r.ACB).toBe(3600)
  })

  it('calculates MRV correctly (ERUV + ELS)', () => {
    const r = calculate(BASE_FORM, BASE_SLIDERS)
    expect(r.MRV).toBeCloseTo(3160)
  })

  it('calculates ROI correctly at Gold price (€199)', () => {
    const r = calculate(BASE_FORM, BASE_SLIDERS)
    expect(r.MRV / 199).toBeCloseTo(15.88, 1)
    expect(Math.round(r.MRV / 199)).toBe(16)
  })

  it('calculates ICC correctly in per-invoice mode', () => {
    const form: FormState = {
      ...BASE_FORM,
      hscMode: 'per-invoice',
      chasingHours: 0,
      chasingHoursPerInvoice: 0.5,
      invoiceCount: 40,
    }
    // ICC = HSCI × (IN × LPR) × HIC = 0.5 × (40 × 0.30) × 40 = 0.5 × 12 × 40 = 240
    const r = calculate(form, BASE_SLIDERS)
    expect(r.ICC).toBeCloseTo(240)
  })

  it('produces correct ERUV range bounds', () => {
    const r = calculate(BASE_FORM, BASE_SLIDERS)
    expect(r.ERUVLow).toBeCloseTo(4800 * 0.40)   // 1920
    expect(r.ERUVHigh).toBeCloseTo(4800 * 0.75)  // 3600
  })

  it('sliders override form HIC value', () => {
    const sliders = { ...BASE_SLIDERS, hic: 50 }
    const r = calculate(BASE_FORM, sliders)
    // ICC = 10 × 50 × 1 = 500
    expect(r.ICC).toBe(500)
  })

  it('TM multiplies ICC', () => {
    const sliders = { ...BASE_SLIDERS, tm: 3 }
    const r = calculate(BASE_FORM, sliders)
    // ICC = 10 × 40 × 3 = 1200
    expect(r.ICC).toBe(1200)
  })
})

describe('roundTo500()', () => {
  it('rounds 1920 to 2000', () => expect(roundTo500(1920)).toBe(2000))
  it('rounds 2880 to 3000', () => expect(roundTo500(2880)).toBe(3000))
  it('rounds 250 to 500', () => expect(roundTo500(250)).toBe(500))
  it('rounds 749 to 500', () => expect(roundTo500(749)).toBe(500))
  it('rounds 750 to 1000', () => expect(roundTo500(750)).toBe(1000))
})

describe('formatEur()', () => {
  it('formats 6400 correctly', () => expect(formatEur(6400)).toContain('6'))
  it('rounds to nearest integer', () => expect(formatEur(6400.7)).toContain('6.401'))
})

describe('formatRange()', () => {
  it('returns a range string with –', () => {
    const result = formatRange(1920, 3600)
    expect(result).toContain('–')
  })
})
