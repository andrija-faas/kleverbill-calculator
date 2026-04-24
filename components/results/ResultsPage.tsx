'use client'

import { useTranslations } from 'next-intl'
import { useCalculatorStore } from '@/lib/store'
import { calculate, formatEur, formatRange, formatRoi } from '@/lib/calculations'
import { recommendPlan } from '@/lib/planTiers'
import { ResultsHero } from './ResultsHero'
import { KleverbillEstimate } from './KleverbillEstimate'
import { ScenarioExplorer } from './ScenarioExplorer'
import { PricingAnchor } from './PricingAnchor'
import { PlanRecommendation } from './PlanRecommendation'
import { CtaSection } from './CtaSection'
import { useMemo } from 'react'

export function ResultsPage() {
  const t = useTranslations()
  const { formState, sliderState } = useCalculatorStore()

  const results = useMemo(
    () => calculate(formState, sliderState),
    [formState, sliderState],
  )

  const plan = useMemo(
    () => recommendPlan(results.MIV, formState.invoiceCount, sliderState.ur),
    [results.MIV, formState.invoiceCount, sliderState.ur],
  )

  const roi = plan.price ? results.MRV / plan.price : null

  const elsFraction = results.MRV > 0 ? results.ELS / results.MRV : 0.3

  return (
    <main className="min-h-screen bg-surface">
      <section aria-label={t('resultsHero.eyebrow')}>
        <ResultsHero
          emrl={formatEur(results.EMRL)}
          mrv={formatEur(results.MRV)}
          els={formatEur(results.ELS)}
          rd={formatEur(results.RD)}
          rr={formatEur(results.RR)}
          icc={formatEur(results.ICC)}
          elsFraction={elsFraction}
        />
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-8 sm:py-12 space-y-4">
        <section aria-label={t('kleverbillEstimate.eyebrow')}>
          <KleverbillEstimate
            eruv={formatRange(results.ERUVLow, results.ERUVHigh)}
            els={formatEur(results.ELS)}
            acb={formatEur(results.ACB)}
          />
        </section>

        <section aria-label={t('scenarioExplorer.eyebrow')}>
          <ScenarioExplorer />
        </section>

        <section aria-label={t('planRecommendation.recommended', { tier: plan.tier })}>
          <div className={roi !== null ? 'grid grid-cols-1 lg:grid-cols-2 gap-4' : undefined}>
            {roi !== null && (
              <PricingAnchor
                roi={formatRoi(roi)}
                plan={plan}
              />
            )}
            <PlanRecommendation plan={plan} />
          </div>
        </section>

        <section aria-label={t('ctaSection.eyebrow')}>
          <CtaSection />
        </section>

        <p className="text-[12px] text-on-surface-variant text-center leading-relaxed opacity-70 pt-4 pb-8">
          {t('resultsDisclaimer')}
        </p>
      </div>
    </main>
  )
}
