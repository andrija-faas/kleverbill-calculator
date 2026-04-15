'use client'

import { useTranslations } from 'next-intl'
import type { Plan, PlanTier } from '@/types/calculator.types'

interface PricingAnchorProps {
  roi: string
  plan: Plan
}

export function PricingAnchor({ roi, plan }: PricingAnchorProps) {
  const t = useTranslations('pricingAnchor')
  const tPlans = useTranslations('plans')
  const priceLabel = tPlans(`${plan.tier as PlanTier}.priceLabel` as Parameters<typeof tPlans>[0])

  return (
    <div className="bg-surface-lowest rounded-2xl p-8">
      <p className="text-[10px] font-medium tracking-[0.05em] uppercase text-on-surface-variant mb-1">
        {t('label', { tier: plan.tier, priceLabel })}
      </p>
      <p className="text-[3rem] font-semibold text-primary tracking-[-0.04em] leading-none mt-1">
        {roi}
      </p>
      <p className="text-[13px] text-on-surface-variant mt-1 mb-4">{t('roi')}</p>
      <p className="text-[13px] text-on-surface-variant leading-relaxed">
        {t('description')}
      </p>
    </div>
  )
}
