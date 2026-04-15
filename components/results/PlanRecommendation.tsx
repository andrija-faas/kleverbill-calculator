'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import type { Plan, PlanTier } from '@/types/calculator.types'
import { PlanBadge } from '@/components/ui/PlanBadge'
import { Button } from '@/components/ui/Button'
import { CalendlyModal } from '@/components/ui/CalendlyModal'
import { ArrowRight, Check, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PlanRecommendationProps {
  plan: Plan
}

export function PlanRecommendation({ plan }: PlanRecommendationProps) {
  const t = useTranslations('planRecommendation')
  const tPlans = useTranslations('plans')
  const [open, setOpen] = useState(false)
  const [calendlyOpen, setCalendlyOpen] = useState(false)

  const tierKey = plan.tier as PlanTier
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const description = tPlans(`${tierKey}.description` as any)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const priceLabel = tPlans(`${tierKey}.priceLabel` as any)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const features = tPlans.raw(`${tierKey}.features` as any) as string[]

  return (
    <div className="bg-surface-lowest rounded-2xl p-8">
      <div className="flex items-center justify-between gap-6 flex-wrap">
        <div>
          <PlanBadge tier={plan.tier} className="mb-2" />
          <p className="text-[16px] font-medium text-on-surface mb-1">
            {t('recommended', { tier: plan.tier })}
          </p>
          <p className="text-[13px] text-on-surface-variant">{description}</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <Button
            variant="secondary"
            size="md"
            onClick={() => setOpen(v => !v)}
            style={{ whiteSpace: 'nowrap' }}
          >
            {t('seeDetails')}
            <ChevronDown
              size={15}
              className={cn('transition-transform duration-200', open && 'rotate-180')}
            />
          </Button>
          <Button
            size="md"
            style={{ whiteSpace: 'nowrap' }}
            onClick={() => setCalendlyOpen(true)}
          >
            {plan.price === null ? t('contactSales') : t('getStarted')}
            <ArrowRight size={15} />
          </Button>
        </div>
      </div>

      {open && (
        <div className="mt-6 pt-6 border-t border-surface-dim">
          <div className="flex items-baseline gap-3 mb-4">
            <span className="text-[28px] font-semibold text-on-surface tracking-tight leading-none">
              {priceLabel}
            </span>
          </div>
          <ul className="space-y-2 mb-4">
            {features.map(feature => (
              <li key={feature} className="flex items-center gap-2 text-[13px] text-on-surface-variant">
                <Check size={14} className="text-primary flex-shrink-0" />
                {feature}
              </li>
            ))}
          </ul>
          <a
            href="https://www.kleverbill.de/preis"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[13px] text-primary font-medium hover:underline"
          >
            {t('seeFullDetails')}
            <ArrowRight size={13} />
          </a>
        </div>
      )}

      <CalendlyModal isOpen={calendlyOpen} onClose={() => setCalendlyOpen(false)} />
    </div>
  )
}
