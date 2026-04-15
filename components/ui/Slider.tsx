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
    <div className={cn('grid items-center gap-5', className)}
      style={{ gridTemplateColumns: '180px 1fr 72px' }}>
      <div>
        <p className="text-[13px] font-medium text-on-surface">{label}</p>
        <p className="text-[11px] text-on-surface-variant">{sublabel}</p>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <p className="text-[15px] font-semibold text-primary text-right">{displayValue}</p>
    </div>
  )
}
