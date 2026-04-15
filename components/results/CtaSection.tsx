'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useCalculatorStore } from '@/lib/store'
import { ArrowRight, ArrowLeft } from 'lucide-react'
import { CalendlyModal } from '@/components/ui/CalendlyModal'

export function CtaSection() {
  const t = useTranslations('ctaSection')
  const reset = useCalculatorStore((s) => s.reset)
  const [calendlyOpen, setCalendlyOpen] = useState(false)

  return (
    <div
      className="rounded-xl p-12 text-center relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #466800 0%, #3d5b00 100%)' }}
    >
      {/* Decorative circle */}
      <div className="absolute -top-10 -right-10 w-52 h-52 rounded-full bg-white/[0.06]" />

      <p className="text-[11px] font-medium tracking-[0.12em] uppercase text-white/65 mb-3">
        {t('eyebrow')}
      </p>
      <h2 className="text-[clamp(1.4rem,3vw,2rem)] font-light text-white tracking-[-0.02em] leading-[1.2] mb-3">
        {t('headlinePre')} <strong className="font-semibold">{t('headlineStrong')}</strong>
      </h2>
      <p className="text-[14px] text-white/90 leading-relaxed max-w-md mx-auto mb-8">
        {t('body')}
      </p>

      <button
        type="button"
        onClick={() => setCalendlyOpen(true)}
        className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold bg-white text-[#466800] hover:bg-white/90 transition-colors mb-5"
      >
        {t('bookAudit')}
        <ArrowRight size={16} />
      </button>

      <div>
        <button
          type="button"
          onClick={() => {
            reset()
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }}
          className="inline-flex items-center gap-1.5 text-[13px] text-white/65 hover:text-white/90 transition-colors mt-4"
        >
          <ArrowLeft size={13} />
          {t('recalculate')}
        </button>
      </div>

      <CalendlyModal isOpen={calendlyOpen} onClose={() => setCalendlyOpen(false)} />
    </div>
  )
}
