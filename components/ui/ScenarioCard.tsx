import { cn } from '@/lib/utils'
import type { KrrScenario } from '@/types/calculator.types'

interface ScenarioCardProps {
  scenario: KrrScenario
  rate: string
  label: string
  description: string
  selected: boolean
  onSelect: (scenario: KrrScenario) => void
}

export function ScenarioCard({
  scenario,
  rate,
  label,
  description,
  selected,
  onSelect,
}: ScenarioCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(scenario)}
      className={cn(
        'text-left p-4 rounded-xl border-2 transition-all duration-200',
        selected
          ? 'bg-surface-lowest border-primary shadow-card'
          : 'bg-surface-low border-transparent hover:bg-surface-high',
      )}
    >
      <p className="text-[13px] font-medium text-on-surface mb-0.5">{label}</p>
      <p className="text-[22px] font-semibold text-primary leading-none mb-1">{rate}</p>
      <p className="text-[11px] text-on-surface-variant">{description}</p>
    </button>
  )
}
