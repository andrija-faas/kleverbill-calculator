import { cn } from '@/lib/utils'
import { HTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated'
}

export function Card({ className, variant = 'default', ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl',
        variant === 'default' && 'bg-surface-lowest p-5 sm:p-8',
        variant === 'elevated' && 'bg-surface-lowest shadow-card p-6 sm:p-10',
        className,
      )}
      {...props}
    />
  )
}
