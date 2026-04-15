import { cn } from '@/lib/utils'

interface Option {
  value: string
  label: string
}

interface ToggleGroupProps {
  options: Option[]
  value: string
  onChange: (value: string) => void
  className?: string
}

export function ToggleGroup({ options, value, onChange, className }: ToggleGroupProps) {
  return (
    <div
      className={cn(
        'flex bg-surface-low rounded-full p-1 w-full sm:w-fit mb-6',
        className,
      )}
    >
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={cn(
            'flex-1 sm:flex-none px-[18px] py-1.5 rounded-full text-[13px] transition-all duration-200 whitespace-nowrap',
            value === option.value
              ? 'bg-surface-lowest text-primary font-medium shadow-sm'
              : 'text-on-surface-variant font-normal hover:text-on-surface',
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
