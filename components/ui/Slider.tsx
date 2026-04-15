import { cn } from '@/lib/utils'

interface SliderProps {
  label: string
  sublabel: string
  min: number
  max: number
  step: number
  value: number
  displayValue: string
  onChange: (value: number) => void
  className?: string
}

export function Slider({
  label,
  sublabel,
  min,
  max,
  step,
  value,
  displayValue,
  onChange,
  className,
}: SliderProps) {
  return (
    <div className={cn('space-y-2', className)}>
      {/* Label row — label left, value right */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[13px] font-medium text-on-surface">{label}</p>
          <p className="text-[11px] text-on-surface-variant">{sublabel}</p>
        </div>
        <p className="text-[15px] font-semibold text-primary shrink-0 pt-0.5">{displayValue}</p>
      </div>
      {/* Slider — full width */}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full"
      />
    </div>
  )
}
