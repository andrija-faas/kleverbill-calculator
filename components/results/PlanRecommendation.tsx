'use client'

import { useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import type { Plan, PlanTier } from '@/types/calculator.types'
import { PlanBadge } from '@/components/ui/PlanBadge'
import { Button } from '@/components/ui/Button'
import { CalendlyModal } from '@/components/ui/CalendlyModal'
import { useCalculatorStore } from '@/lib/store'
import { buildCalendlyUrl } from '@/lib/buildCalendlyUrl'
import { calculate } from '@/lib/calculations'
import { ArrowRight, Check, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PlanRecommendationProps {
  plan: Plan
}

export function PlanRecommendation({ plan }: PlanRecommendationProps) {
  const t = useTranslations('planRecommendation')
  const tPlans = useTranslations('plans')
  const locale = useLocale()
  const formState = useCalculatorStore((s) => s.formState)
  const sliderState = useCalculatorStore((s) => s.sliderState)
  const results = calculate(formState, sliderState)
  const [open, setOpen] = useState(false)
  const [calendlyOpen, setCalendlyOpen] = useState(false)

  const tierKey = plan.tier as PlanTier
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const description = tPlans(`${tierKey}.description` as any)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const priceLabel = tPlans(`${tierKey}.priceLabel` as any)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const features = tPlans.raw(`${tierKey}.features` as any) as string[]

  const planDetailsUrl = locale === 'en'
    ? 'https://www.kleverbill.de/en/pricing'
    : 'https://www.kleverbill.de/preis'

  return (
    <div className="bg-surface-lowest rounded-2xl p-5 sm:p-8">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="min-w-0">
          <PlanBadge tier={plan.tier} className="mb-2" />
          <p className="text-[16px] font-medium text-on-surface mb-1">
            {t('recommended', { tier: plan.tier })}
          </p>
          <p className="text-[13px] text-on-surface-variant">{description}</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <Button
            variant="secondary"
            size="md"
            onClick={() => setOpen(v => !v)}
            className="justify-center"
          >
            {t('seeDetails')}
            <ChevronDown
              size={15}
              className={cn('transition-transform duration-200', open && 'rotate-180')}
            />
          </Button>
          <Button
            size="md"
            onClick={() => setCalendlyOpen(true)}
            className="justify-center"
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
            href={planDetailsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[13px] text-primary font-medium hover:underline"
          >
            {t('seeFullDetails')}
            <ArrowRight size={13} />
          </a>
        </div>
      )}

      <CalendlyModal
        isOpen={calendlyOpen}
        onClose={() => setCalendlyOpen(false)}
        url={buildCalendlyUrl(formState, results, plan)}
      />
    </div>
  )
}
