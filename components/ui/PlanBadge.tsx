import { cn } from '@/lib/utils'
import type { PlanTier } from '@/types/calculator.types'

interface PlanBadgeProps {
  tier: PlanTier
  className?: string
}

const styles: Record<PlanTier, string> = {
  Silver:     'bg-secondary-container text-on-secondary-container',
  Gold:       'bg-[#eef2db] text-[#466800]',
  Platinum:   'bg-[#e6eaf5] text-[#2d3a6b]',
  Enterprise: 'bg-[#f0e8f0] text-[#5a2d6b]',
}

export function PlanBadge({ tier, className }: PlanBadgeProps) {
  return (
    <span
      className={cn(
        'inline-block text-[11px] font-medium tracking-[0.05em] uppercase rounded-md px-3 py-0.5',
        styles[tier],
        className,
      )}
    >
      {tier}
    </span>
  )
}
