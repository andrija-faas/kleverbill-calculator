import type { Plan, PlanTier } from '@/types/calculator.types'

// ─── Plan definitions ─────────────────────────────────────────────────────────
// Text fields (description, priceLabel, features) live in messages/de.json and
// messages/en.json under the "plans" namespace. Only locale-independent data lives here.

export const PLANS: Record<PlanTier, Plan> = {
  Silver:     { tier: 'Silver',     price: 39,  badge: 'silver' },
  Gold:       { tier: 'Gold',       price: 199, badge: 'gold' },
  Platinum:   { tier: 'Platinum',   price: 449, badge: 'platinum' },
  Enterprise: { tier: 'Enterprise', price: null, badge: 'enterprise' },
}

// ─── Tier logic ───────────────────────────────────────────────────────────────
//
//   Enterprise : IN ≥ 1000  OR  MIV ≥ €500k
//   Platinum   : IN ≥ 250   OR  MIV ≥ €150k  OR  UR ≥ 8%
//   Gold       : IN ≥ 25    OR  MIV ≥ €20k
//   Silver     : everything else
//
// ─────────────────────────────────────────────────────────────────────────────

export function recommendPlan(
  MIV: number,
  IN: number | null,
  UR: number,          // decimal — 0.06 = 6%
): Plan {
  if ((IN !== null && IN >= 1000) || MIV >= 500_000) {
    return PLANS.Enterprise
  }
  if ((IN !== null && IN >= 250) || MIV >= 150_000 || UR >= 0.08) {
    return PLANS.Platinum
  }
  if ((IN !== null && IN >= 25) || MIV >= 20_000) {
    return PLANS.Gold
  }
  return PLANS.Silver
}
