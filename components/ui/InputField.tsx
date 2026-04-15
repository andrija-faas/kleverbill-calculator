import { cn } from '@/lib/utils'
import { InputHTMLAttributes, forwardRef, ReactNode } from 'react'

interface InputFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'prefix' | 'suffix'> {
  label: string
  prefix?: ReactNode
  suffix?: ReactNode
  error?: string
  hint?: string
}

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, prefix, suffix, error, hint, className, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-medium text-on-surface-variant tracking-[0.05em] uppercase">
          {label}
        </label>
        <div className="relative">
          {prefix && (
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[13px] text-outline-variant pointer-events-none select-none">
              {prefix}
            </span>
          )}
          <input
            ref={ref}
            type="number"
            className={cn(
              'w-full h-12 bg-transparent rounded-lg text-[15px] text-on-surface outline-none transition-all',
              'ring-1 ring-outline-variant/15',
              'placeholder:text-outline-variant',
              'focus:ring-2 focus:ring-primary',
              prefix ? 'pl-8 pr-3.5' : 'px-3.5',
              suffix ? 'pr-10' : '',
              error && 'ring-2 ring-red-400',
              className,
            )}
            {...props}
          />
          {suffix && (
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[13px] text-outline-variant pointer-events-none select-none">
              {suffix}
            </span>
          )}
        </div>
        {error && <p className="text-[11px] text-red-500">{error}</p>}
        {hint && !error && <p className="text-[11px] text-outline-variant">{hint}</p>}
      </div>
    )
  },
)
InputField.displayName = 'InputField'
