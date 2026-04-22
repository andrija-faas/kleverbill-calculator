'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Menu, X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { Logo } from './Logo'
import { CalendlyModal } from '@/components/ui/CalendlyModal'
import { LocaleSwitcher } from '@/components/LocaleSwitcher'
import { useCalculatorStore } from '@/lib/store'
import { buildCalendlyUrl } from '@/lib/buildCalendlyUrl'
import { calculate } from '@/lib/calculations'
import { recommendPlan } from '@/lib/planTiers'

export function Nav() {
  const t = useTranslations('nav')
  const formState = useCalculatorStore((s) => s.formState)
  const sliderState = useCalculatorStore((s) => s.sliderState)
  const results = calculate(formState, sliderState)
  const plan = recommendPlan(results.MIV, formState.invoiceCount, sliderState.ur)
  const [menuOpen, setMenuOpen] = useState(false)
  const [calendlyOpen, setCalendlyOpen] = useState(false)

  function openCalendly() {
    setMenuOpen(false)
    setCalendlyOpen(true)
  }

  return (
    <nav className="flex flex-wrap justify-between items-center mb-8 min-[815px]:mb-20 bg-white border border-[#E5E7EB] rounded-2xl px-4 py-3 min-[815px]:px-6 min-[815px]:py-4">

      {/* Brand — always visible, always left */}
      <div className="flex items-center">
        <span className="text-sm font-bold tracking-widest uppercase" style={{ color: '#1A2420' }}>
          <span style={{ color: '#84C225' }}>Kleverbill</span>
          {' '}{t('brand')}
        </span>
      </div>

      {/* ── Desktop (815px+): CTA centred ── */}
      <button
        type="button"
        onClick={openCalendly}
        className="hidden min-[815px]:inline-flex rounded-lg px-5 py-2.5 text-sm font-semibold text-white bg-[#84C225] hover:bg-[#72a81f] transition-colors"
      >
        {t('bookAudit')}
      </button>

      {/* ── Desktop (815px+): locale + logo right ── */}
      <div className="hidden min-[815px]:flex items-center gap-3">
        <LocaleSwitcher />
        <a
          href="https://kleverbill.de"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2"
        >
          <Logo className="h-7 w-auto" />
          <span className="text-sm font-semibold tracking-wide" style={{ color: '#1A2420' }}>
            Kleverbill
          </span>
        </a>
      </div>

      {/* ── Mobile (<815px): hamburger toggle ── */}
      <button
        type="button"
        onClick={() => setMenuOpen((v) => !v)}
        className="min-[815px]:hidden p-1.5 rounded-lg text-on-surface hover:bg-surface-low transition-colors"
        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
      >
        {menuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* ── Mobile dropdown ── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="min-[815px]:hidden w-full overflow-hidden"
          >
            <div className="flex flex-col gap-4 border-t border-[#E5E7EB] mt-4 pt-4 pb-1">
              {/* CTA full width */}
              <button
                type="button"
                onClick={openCalendly}
                className="w-full rounded-lg px-5 py-3 text-sm font-semibold text-white bg-[#84C225] hover:bg-[#72a81f] transition-colors"
              >
                {t('bookAudit')}
              </button>

              {/* Logo + locale on same row */}
              <div className="flex items-center justify-between">
                <a
                  href="https://kleverbill.de"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5"
                >
                  <Logo className="h-7 w-auto" />
                  <span className="text-sm font-semibold tracking-wide" style={{ color: '#1A2420' }}>
                    Kleverbill
                  </span>
                </a>
                <LocaleSwitcher />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <CalendlyModal
        isOpen={calendlyOpen}
        onClose={() => setCalendlyOpen(false)}
        url={buildCalendlyUrl(formState, results, plan)}
      />
    </nav>
  )
}
