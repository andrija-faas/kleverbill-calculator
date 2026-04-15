import { cn } from '@/lib/utils'
import { ButtonHTMLAttributes, forwardRef } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'cta' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center gap-2 font-medium transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed',
          // variant
          (variant === 'primary' || variant === 'cta') && 'text-white hover:opacity-90 active:scale-[0.98]',
          variant === 'secondary' && 'bg-surface-high text-on-surface hover:bg-surface-dim active:scale-[0.98]',
          (variant === 'tertiary' || variant === 'ghost') && 'bg-transparent text-primary relative after:absolute after:bottom-0 after:left-0 after:h-[1.5px] after:w-0 after:bg-primary after:transition-all after:duration-200 hover:after:w-full',
          // size
          size === 'sm' && 'text-xs px-4 py-2 rounded-lg',
          size === 'md' && 'text-[14px] leading-6 px-6 py-3 rounded-lg',
          size === 'lg' && 'text-[14px] leading-6 px-9 py-4 rounded-full',
          className,
        )}
        style={
          variant === 'primary' || variant === 'cta'
            ? { background: 'linear-gradient(135deg, #466800, #3d5b00)', ...props.style }
            : props.style
        }
        {...props}
      >
        {loading ? (
          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : null}
        {children}
      </button>
    )
  },
)
Button.displayName = 'Button'
