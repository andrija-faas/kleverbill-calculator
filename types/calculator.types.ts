// ─── Input modes ────────────────────────────────────────────────────────────

export type HscMode = 'total' | 'per-invoice'
export type KrrScenario = 'conservative' | 'standard' | 'aggressive'

// ─── Plan tiers ──────────────────────────────────────────────────────────────

export type PlanTier = 'Silver' | 'Gold' | 'Platinum' | 'Enterprise'

export interface Plan {
  tier: PlanTier
  price: number | null   // null = Enterprise / custom
  badge: 'silver' | 'gold' | 'platinum' | 'enterprise'
}

// ─── Form state (inputs) ─────────────────────────────────────────────────────

export interface FormState {
  // Step 1 — Revenue
  invoiceCount: number | null          // IN
  avgInvoiceValue: number | null       // AVGIV

  // Step 2 — Chasing
  hscMode: HscMode
  chasingHours: number                 // HSC (total hours/month)
  chasingHoursPerInvoice: number | null // HSCI
  teamMembers: number                  // TM — multiplier on HIC

  // Step 3 — Optional overrides
  latePaymentRate: number              // LPR — decimal (0.20 = 20%)
  unpaidRate: number                   // UR  — decimal (0.05 = 5%)
  hourlyInternalCost: number           // HIC — €/hour

  // Step 4 — Recovery scenario
  krrScenario: KrrScenario
  krr: number                          // KRR — decimal (0.6 = 60%)
}

// ─── Calculation outputs ─────────────────────────────────────────────────────

export interface CalcResults {
  MIV: number    // Monthly invoiced value
  RD: number     // Revenue delayed
  RR: number     // Revenue at risk
  ICC: number    // Internal chasing cost
  DC: number     // Delay cost
  EMRL: number   // Estimated monthly receivables lost (primary output)
  ERUV: number   // Estimated recoverable unpaid value (at active KRR)
  ERUVLow: number  // ERUV at 40% KRR (range low)
  ERUVHigh: number // ERUV at 75% KRR (range high)
  ELS: number    // Estimated labour savings
  ACB: number    // Accelerated cash benefit
  MRV: number    // Monthly recoverable value
}

// ─── Slider state (results page overrides) ──────────────────────────────────

export interface SliderState {
  lpr: number    // decimal
  ur: number     // decimal
  hsc: number
  hic: number
  tm: number     // team members
  krr: number    // decimal
}

// ─── Store shape ─────────────────────────────────────────────────────────────

export interface CalculatorStore {
  view: 'form' | 'results'
  formState: FormState
  sliderState: SliderState
  setView: (view: 'form' | 'results') => void
  setFormState: (patch: Partial<FormState>) => void
  setSliderState: (patch: Partial<SliderState>) => void
  submitForm: () => void
  reset: () => void
}
