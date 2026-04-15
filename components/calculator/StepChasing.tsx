'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useCalculatorStore } from '@/lib/store'
import { Card } from '@/components/ui/Card'
import { ToggleGroup } from '@/components/ui/ToggleGroup'
import { InputField } from '@/components/ui/InputField'

export function StepChasing() {
  const t = useTranslations('stepChasing')
  const { formState, setFormState } = useCalculatorStore()

  // HSC_OPTIONS inside the component so useTranslations is available
  const HSC_OPTIONS = [
    { value: 'total', label: t('modeTotal') },
    { value: 'per-invoice', label: t('modePerInvoice') },
  ]

  const [hicDisplay, setHicDisplay] = useState(() =>
    formState.hourlyInternalCost ? String(formState.hourlyInternalCost) : ''
  )

  return (
    <Card>
      <div className="flex items-baseline gap-3 mb-5">
        <span className="text-[11px] font-semibold tracking-[0.12em] text-primary/60 tabular-nums">02</span>
        <p className="text-[17px] font-medium text-on-surface">{t('title')}</p>
      </div>

      <ToggleGroup
        options={HSC_OPTIONS}
        value={formState.hscMode}
        onChange={(v) => setFormState({ hscMode: v as 'total' | 'per-invoice' })}
      />

      {formState.hscMode === 'total' ? (
        <InputField
          label={t('labelTotalHours')}
          suffix="h"
          placeholder="10"
          hint={t('hintTotalHours')}
          value={formState.chasingHours || ''}
          onChange={(e) =>
            setFormState({ chasingHours: Number(e.target.value) || 0 })
          }
        />
      ) : (
        <InputField
          label={t('labelPerInvoiceHours')}
          suffix="h"
          placeholder="0.5"
          step={0.1}
          hint={t('hintPerInvoiceHours')}
          value={formState.chasingHoursPerInvoice ?? ''}
          onChange={(e) =>
            setFormState({
              chasingHoursPerInvoice: e.target.value ? Number(e.target.value) : null,
            })
          }
        />
      )}

      <div className="mt-4 grid grid-cols-2 gap-4">
        <InputField
          label={t('labelHic')}
          prefix="€"
          placeholder="35"
          hint={t('hintHic')}
          value={hicDisplay}
          onChange={(e) => setHicDisplay(e.target.value)}
          onBlur={() => {
            const num = parseFloat(hicDisplay)
            if (!isNaN(num)) {
              setFormState({ hourlyInternalCost: num })
            }
          }}
        />
        <InputField
          label={t('labelTeamMembers')}
          placeholder="1"
          min={1}
          hint={t('hintTeamMembers')}
          value={formState.teamMembers || ''}
          onChange={(e) =>
            setFormState({ teamMembers: Math.max(1, Number(e.target.value) || 1) })
          }
        />
      </div>
    </Card>
  )
}
