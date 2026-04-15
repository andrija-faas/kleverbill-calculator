'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Logo } from './Logo'
import { CalendlyModal } from '@/components/ui/CalendlyModal'
import { LocaleSwitcher } from '@/components/LocaleSwitcher'

export function Nav() {
  const t = useTranslations('nav')
  const [calendlyOpen, setCalendlyOpen] = useState(false)

  return (
    <nav
      className="flex w-full items-center justify-between mb-20"
      style={{
        background: '#ffffff',
        border: '1px solid #E5E7EB',
        borderRadius: '16px',
        padding: '16px 24px',
      }}
    >
      {/* Left — wordmark */}
      <div className="flex items-center">
        <span className="text-sm font-bold tracking-widest uppercase" style={{ color: '#1A2420' }}>
          <span style={{ color: '#84C225' }}>Kleverbill</span>
          {' '}{t('brand')}
        </span>
      </div>

      {/* Centre — CTA */}
      <button
        type="button"
        onClick={() => setCalendlyOpen(true)}
        className="rounded-lg px-5 py-2.5 text-sm font-semibold text-white bg-[#84C225] hover:bg-[#72a81f] transition-colors"
      >
        {t('bookAudit')}
      </button>

      {/* Right — locale switcher + Kleverbill logo */}
      <div className="flex items-center gap-3">
        <LocaleSwitcher />
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
      </div>

      <CalendlyModal isOpen={calendlyOpen} onClose={() => setCalendlyOpen(false)} />
    </nav>
  )
}
