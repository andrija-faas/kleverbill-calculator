'use client'

import { useCalculatorStore } from '@/lib/store'
import { Card } from '@/components/ui/Card'
import { InputField } from '@/components/ui/InputField'

export function StepOverrides() {
  const { formState, setFormState } = useCalculatorStore()

  return (
    <Card>
      <div className="flex items-baseline gap-3 mb-1">
        <span className="text-[11px] font-semibold tracking-[0.12em] text-primary/60 tabular-nums">03</span>
        <p className="text-[17px] font-medium text-on-surface">
          Fine-tune the defaults{' '}
          <span className="font-light text-[15px] text-on-surface-variant">
            — we&apos;ll use industry averages if left blank
          </span>
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-6">
        <InputField
          label="Hourly internal cost"
          prefix="€"
          placeholder="35"
          value={formState.hourlyInternalCost || ''}
          onChange={(e) =>
            setFormState({ hourlyInternalCost: Number(e.target.value) || 35 })
          }
        />
      </div>
    </Card>
  )
}
