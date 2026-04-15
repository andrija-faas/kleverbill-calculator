'use client'

import { useState, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { useCalculatorStore } from '@/lib/store'
import { calculate, formatEur } from '@/lib/calculations'
import { Slider } from '@/components/ui/Slider'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

export function ScenarioExplorer() {
  const t = useTranslations('scenarioExplorer')
  const { formState, sliderState, setSliderState } = useCalculatorStore()
  const [showMore, setShowMore] = useState(false)

  const results = useMemo(
    () => calculate(formState, sliderState),
    [formState, sliderState],
  )

  const total = results.EMRL
  const rrPct  = total > 0 ? results.RR  / total : 0
  const iccPct = total > 0 ? results.ICC / total : 0
  const dcPct  = total > 0 ? results.DC  / total : 0

  const bars = [
    { label: t('revenueAtRisk'), pct: rrPct,  value: formatEur(results.RR),  color: '#466800' },
    { label: t('labourCost'),    pct: iccPct, value: formatEur(results.ICC), color: '#86bc25' },
    { label: t('delayCost'),     pct: dcPct,  value: formatEur(results.DC),  color: '#c3c9b2' },
  ]

  return (
    <div className="bg-surface-lowest rounded-2xl p-8">
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-[10px] font-medium tracking-[0.10em] uppercase text-primary mb-1">
            {t('eyebrow')}
          </p>
          <p className="text-[17px] font-medium text-on-surface">{t('title')}</p>
        </div>
        <p className="text-[13px] text-on-surface-variant">{t('liveUpdate')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Left — sliders */}
        <div>
          <div className="space-y-6">
            <Slider
              label={t('lprLabel')}
              sublabel={t('lprSublabel')}
              min={1} max={60} step={1}
              value={Math.round(sliderState.lpr * 100)}
              displayValue={`${Math.round(sliderState.lpr * 100)}%`}
              onChange={(v) => setSliderState({ lpr: v / 100 })}
            />
            <Slider
              label={t('urLabel')}
              sublabel={t('urSublabel')}
              min={1} max={30} step={1}
              value={Math.round(sliderState.ur * 100)}
              displayValue={`${Math.round(sliderState.ur * 100)}%`}
              onChange={(v) => setSliderState({ ur: v / 100 })}
            />
          </div>

          {/* Show more toggle */}
          <div className="flex justify-start mt-6">
            <button
              type="button"
              onClick={() => setShowMore((p) => !p)}
              className={cn(
                'inline-flex items-center gap-1.5 text-[12px] font-medium text-on-surface-variant',
                'border border-outline-variant/30 rounded-full px-4 py-1.5 transition-colors',
                'hover:border-primary hover:text-primary',
              )}
            >
              {showMore ? t('showLess') : t('showMore')}
              <ChevronDown
                size={14}
                className={cn('transition-transform duration-300', showMore && 'rotate-180')}
              />
            </button>
          </div>

          {/* Extra sliders */}
          <AnimatePresence>
            {showMore && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                style={{ overflow: 'hidden' }}
              >
                <div className="space-y-6 mt-6">
                  <Slider
                    label={t('hscLabel')}
                    sublabel={t('hscSublabel')}
                    min={0} max={80} step={1}
                    value={sliderState.hsc}
                    displayValue={`${sliderState.hsc}h`}
                    onChange={(v) => setSliderState({ hsc: v })}
                  />
                  <Slider
                    label={t('hicLabel')}
                    sublabel={t('hicSublabel')}
                    min={15} max={150} step={5}
                    value={sliderState.hic}
                    displayValue={`€${sliderState.hic}`}
                    onChange={(v) => setSliderState({ hic: v })}
                  />
                  <Slider
                    label={t('tmLabel')}
                    sublabel={t('tmSublabel')}
                    min={1} max={20} step={1}
                    value={sliderState.tm}
                    displayValue={`${sliderState.tm}`}
                    onChange={(v) => setSliderState({ tm: v })}
                  />
                  <Slider
                    label={t('krrLabel')}
                    sublabel={t('krrSublabel')}
                    min={40} max={75} step={5}
                    value={Math.round(sliderState.krr * 100)}
                    displayValue={`${Math.round(sliderState.krr * 100)}%`}
                    onChange={(v) => setSliderState({ krr: v / 100 })}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right — exposure breakdown chart */}
        <div className="p-6 rounded-xl bg-surface-low space-y-4 self-start">
          <p className="text-[11px] font-medium tracking-[0.06em] uppercase text-on-surface-variant">
            {t('exposureBreakdown')}
          </p>
          {bars.map((bar) => (
            <div key={bar.label} className="space-y-1.5">
              <div className="flex justify-between items-center">
                <p className="text-[11px] font-medium text-on-surface">{bar.label}</p>
                <p className="text-[12px] font-medium text-on-surface">{bar.value}</p>
              </div>
              <div className="h-2 rounded-full bg-outline-variant/20 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.round(bar.pct * 100)}%`, backgroundColor: bar.color }}
                />
              </div>
            </div>
          ))}
          <div className="pt-3 border-t border-outline-variant/20 flex justify-between items-center">
            <p className="text-[11px] text-on-surface-variant uppercase tracking-[0.06em] font-medium">{t('totalExposure')}</p>
            <p className="text-[14px] font-semibold text-on-surface">{formatEur(results.EMRL)}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
