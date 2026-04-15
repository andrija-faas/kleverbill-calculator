'use client'

import { useTranslations } from 'next-intl'
import { useCalculatorStore } from '@/lib/store'
import { Card } from '@/components/ui/Card'
import { ScenarioCard } from '@/components/ui/ScenarioCard'
import type { KrrScenario } from '@/types/calculator.types'
import { KRR_VALUES } from '@/lib/calculations'

export function StepScenario() {
  const t = useTranslations('stepScenario')
  const { formState, setFormState } = useCalculatorStore()

  // Scenarios defined inside component so useTranslations is available
  const SCENARIOS: Array<{
    scenario: KrrScenario
    label: string
    rate: string
    description: string
  }> = [
    {
      scenario: 'standard',
      label: t('standard.label'),
      rate: '60%',
      description: t('standard.description'),
    },
    {
      scenario: 'conservative',
      label: t('conservative.label'),
      rate: '40%',
      description: t('conservative.description'),
    },
    {
      scenario: 'aggressive',
      label: t('aggressive.label'),
      rate: '75%',
      description: t('aggressive.description'),
    },
  ]

  function handleSelect(scenario: KrrScenario) {
    setFormState({ krrScenario: scenario, krr: KRR_VALUES[scenario] })
  }

  return (
    <Card>
      <div className="flex items-baseline gap-3 mb-5">
        <span className="text-[11px] font-semibold tracking-[0.12em] text-primary/60 tabular-nums">04</span>
        <p className="text-[17px] font-medium text-on-surface">{t('title')}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {SCENARIOS.map((s) => (
          <ScenarioCard
            key={s.scenario}
            {...s}
            selected={formState.krrScenario === s.scenario}
            onSelect={handleSelect}
          />
        ))}
      </div>
    </Card>
  )
}
