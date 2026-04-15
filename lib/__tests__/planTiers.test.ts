import { describe, it, expect } from 'vitest'
import { recommendPlan } from '../planTiers'

describe('recommendPlan()', () => {
  it('recommends Silver for low MIV and low IN', () => {
    const plan = recommendPlan(10000, 10, 0.04)
    expect(plan.tier).toBe('Silver')
    expect(plan.price).toBe(39)
  })

  it('recommends Gold for MIV ≥ €20k', () => {
    const plan = recommendPlan(20000, 10, 0.04)
    expect(plan.tier).toBe('Gold')
    expect(plan.price).toBe(199)
  })

  it('recommends Gold for IN ≥ 25', () => {
    const plan = recommendPlan(10000, 25, 0.04)
    expect(plan.tier).toBe('Gold')
  })

  it('recommends Platinum for MIV ≥ €150k', () => {
    const plan = recommendPlan(150000, 10, 0.04)
    expect(plan.tier).toBe('Platinum')
    expect(plan.price).toBe(449)
  })

  it('recommends Platinum for IN ≥ 250', () => {
    const plan = recommendPlan(50000, 250, 0.04)
    expect(plan.tier).toBe('Platinum')
  })

  it('recommends Platinum when UR ≥ 8%', () => {
    const plan = recommendPlan(50000, 30, 0.08)
    expect(plan.tier).toBe('Platinum')
  })

  it('recommends Enterprise for MIV ≥ €500k', () => {
    const plan = recommendPlan(500000, 100, 0.04)
    expect(plan.tier).toBe('Enterprise')
    expect(plan.price).toBeNull()
  })

  it('recommends Enterprise for IN ≥ 1000', () => {
    const plan = recommendPlan(50000, 1000, 0.04)
    expect(plan.tier).toBe('Enterprise')
  })

  it('handles null IN gracefully', () => {
    const plan = recommendPlan(10000, null, 0.04)
    expect(plan.tier).toBe('Silver')
  })

  it('Gold takes precedence over Silver when MIV is exactly 20000', () => {
    const plan = recommendPlan(20000, null, 0.04)
    expect(plan.tier).toBe('Gold')
  })
})
