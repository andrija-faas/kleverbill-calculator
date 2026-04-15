'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useCalculatorStore } from '@/lib/store'
import { Card } from '@/components/ui/Card'
import { InputField } from '@/components/ui/InputField'

export function StepRevenue() {
  const t = useTranslations('stepRevenue')
  const { formState, setFormState } = useCalculatorStore()

  const [lprDisplay, setLprDisplay] = useState(() =>
    formState.latePaymentRate ? String(formState.latePaymentRate * 100) : ''
  )
  const [urDisplay, setUrDisplay] = useState(() =>
    formState.unpaidRate ? String(formState.unpaidRate * 100) : ''
  )

  return (
    <Card>
      <div className="flex items-baseline gap-3 mb-5">
        <span className="text-[11px] font-semibold tracking-[0.12em] text-primary/60 tabular-nums">01</span>
        <p className="text-[17px] font-medium text-on-surface">{t('title')}</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <InputField
          label={t('invoicesPerMonth')}
          placeholder="50"
          value={formState.invoiceCount ?? ''}
          onChange={(e) =>
            setFormState({ invoiceCount: e.target.value ? Number(e.target.value) : null })
          }
        />
        <InputField
          label={t('avgInvoiceValue')}
          prefix="€"
          placeholder="2 000"
          value={formState.avgInvoiceValue ?? ''}
          onChange={(e) =>
            setFormState({ avgInvoiceValue: e.target.value ? Number(e.target.value) : null })
          }
        />
        <InputField
          label={t('latePaymentRate')}
          suffix="%"
          placeholder="20"
          hint={t('latePaymentRateHint')}
          value={lprDisplay}
          onChange={(e) => setLprDisplay(e.target.value)}
          onBlur={() => {
            const num = parseFloat(lprDisplay)
            if (!isNaN(num)) {
              setFormState({ latePaymentRate: num / 100 })
            }
          }}
        />
        <InputField
          label={t('unpaidRate')}
          suffix="%"
          placeholder="5"
          hint={t('unpaidRateHint')}
          value={urDisplay}
          onChange={(e) => setUrDisplay(e.target.value)}
          onBlur={() => {
            const num = parseFloat(urDisplay)
            if (!isNaN(num)) {
              setFormState({ unpaidRate: num / 100 })
            }
          }}
        />
      </div>
    </Card>
  )
}
