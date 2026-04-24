'use client'

import { useTranslations } from 'next-intl'
import { useCalculatorStore } from '@/lib/store'
import { StepRevenue } from './StepRevenue'
import { StepChasing } from './StepChasing'
import { LivePreviewCard } from './LivePreviewCard'
import { ProgressiveStep } from '@/components/ui/ProgressiveStep'
import { ArrowRight } from 'lucide-react'
import { useState } from 'react'
import { FaqSection } from './FaqSection'
import { MethodologySection } from './MethodologySection'

export function CalculatorForm() {
  const t = useTranslations('calculatorForm')
  const { formState, submitForm } = useCalculatorStore()
  const [error, setError] = useState<string | null>(null)

  const step1Complete =
    (formState.invoiceCount ?? 0) > 0 && (formState.avgInvoiceValue ?? 0) > 0

  const step2Complete = (() => {
    if (formState.hscMode === 'total') {
      return formState.chasingHours >= 0
    }
    if ((formState.chasingHoursPerInvoice ?? 0) <= 0) return false
    return (formState.invoiceCount ?? 0) > 0
  })()

  const stepsComplete = step1Complete && step2Complete

  function handleSubmit() {
    setError(null)
    if (!step1Complete) {
      setError(t('errorStep1'))
      return
    }
    if (!step2Complete) {
      setError(t('errorStep2'))
      return
    }
    submitForm()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <main className="min-h-screen bg-surface">
      {/* Hero */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 pt-8 sm:pt-20 pb-8 sm:pb-12">
        <p className="text-[11px] font-medium tracking-[0.10em] uppercase text-primary mb-4 sm:mb-5">
          {t('eyebrow')}
        </p>
        <h1 className="text-[clamp(1.8rem,5vw,3.5rem)] font-light leading-[1.1] tracking-[-0.02em] text-on-surface mb-4 sm:mb-5">
          {t('headlinePre')}{' '}
          <strong className="font-semibold text-primary">{t('headlineStrong')}</strong>
        </h1>
        <p className="text-base text-on-surface-variant leading-[1.7] max-w-[520px]">
          {t('subline1')}
          <br />
          {t('subline2')}
        </p>
      </div>

      {/* Two-column layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 pb-16 sm:pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_420px] gap-8 lg:gap-12 items-start">

          {/* Left — form steps */}
          <div className="space-y-4">
            <StepRevenue />

            <ProgressiveStep visible={step1Complete}>
              <StepChasing />
            </ProgressiveStep>

            <ProgressiveStep visible={stepsComplete}>
              <div className="pt-2">
                {error && (
                  <p className="text-[13px] text-red-500 mb-4">{error}</p>
                )}
                <button
                  onClick={handleSubmit}
                  className="rounded-lg px-5 py-2.5 text-sm font-semibold text-white bg-[#84C225] hover:bg-[#72a81f] transition-colors inline-flex items-center gap-2"
                >
                  {t('calculateNow')}
                  <ArrowRight size={16} />
                </button>
                <p className="text-[12px] text-on-surface-variant/60 leading-[1.6] mt-3">
                  {t('disclaimer')}
                </p>
              </div>
            </ProgressiveStep>
          </div>

          {/* Right — live preview (desktop only) */}
          <div className="hidden lg:block">
            <LivePreviewCard />
          </div>
        </div>
      </div>

      <MethodologySection />
      <FaqSection />
    </main>
  )
}
