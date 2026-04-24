'use client'

import { useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { ArrowUpRight } from 'lucide-react'
import { Logo } from './Logo'
import { CalendlyModal } from '@/components/ui/CalendlyModal'
import { useCalculatorStore } from '@/lib/store'
import { buildCalendlyUrl } from '@/lib/buildCalendlyUrl'
import { calculate } from '@/lib/calculations'
import { recommendPlan } from '@/lib/planTiers'

export function Footer() {
  const t = useTranslations('footer')
  const locale = useLocale()
  const de = locale === 'de'
  const [calendlyOpen, setCalendlyOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const formState = useCalculatorStore((s) => s.formState)
  const sliderState = useCalculatorStore((s) => s.sliderState)
  const results = calculate(formState, sliderState)
  const plan = recommendPlan(results.MIV, formState.invoiceCount, sliderState.ur)

  const softwareHref = de
    ? 'https://www.kleverbill.de/mahnwesensoftware'
    : 'https://www.kleverbill.de/en/dunning-software'

  const bottomLinks = [
    { label: t('privacy'), href: de ? 'https://www.kleverbill.de/datenschutz'  : 'https://kleverbill.de/en/privacy-policy' },
    { label: t('terms'),   href: de ? 'https://www.kleverbill.de/agb'           : 'https://kleverbill.de/en/terms-and-conditions' },
    { label: t('imprint'), href: de ? 'https://www.kleverbill.de/impressum'     : 'https://kleverbill.de/legal-notice' },
  ]

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setNewsletterStatus('loading')
    try {
      // TODO: integrate Lemlist API
      // await fetch('/api/newsletter', { method: 'POST', body: JSON.stringify({ email }) })
      await new Promise((r) => setTimeout(r, 600)) // placeholder
      setNewsletterStatus('success')
      setEmail('')
    } catch {
      setNewsletterStatus('error')
    }
  }

  return (
    <footer className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 pb-6 sm:pb-8">
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-12">

        {/* Main row */}
        <div className="flex flex-wrap items-start justify-between gap-6">

          {/* Left — stacked favicon logo */}
          <a href={`/${locale}/calculator`}>
            <img src="/footer-logo.svg" alt="Kleverbill Rechner" style={{ height: 75 }} className="w-auto" />
          </a>

          {/* Centre — Kleverbill column */}
          <nav aria-label="Footer navigation" className="hidden min-[815px]:flex flex-col">
            <span className="text-[20px] leading-[28px] font-bold text-on-surface">{t('kleverbillHeading')}</span>
            <div className="flex flex-col gap-2 mt-5">
              <a href={`/${locale}/pricing`} className="text-[14px] leading-[24px] py-1 text-on-surface-variant hover:text-on-surface transition-colors">
                {t('pricing')}
              </a>
              <a
                href={softwareHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[14px] leading-[24px] py-1 text-on-surface-variant hover:text-on-surface transition-colors"
              >
                {t('software')}
                <ArrowUpRight size={13} />
              </a>
            </div>
          </nav>

          {/* Right — CTA */}
          <button
            type="button"
            onClick={() => setCalendlyOpen(true)}
            className="rounded-lg px-5 py-2.5 text-sm font-semibold text-white bg-[#84C225] hover:bg-[#72a81f] transition-colors"
          >
            {t('bookAudit')}
          </button>
        </div>

        {/* Newsletter */}
        <div className="mt-12 pt-12 border-t border-[#E5E7EB]">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="max-w-sm">
              <p className="text-[16px] font-bold leading-[24px] text-on-surface">{t('newsletterHeading')}</p>
              <p className="mt-1 text-[14px] leading-[22px] text-on-surface-variant">{t('newsletterDescription')}</p>
            </div>
            <form onSubmit={handleSubscribe} className="flex flex-col gap-2 w-full sm:w-auto">
              <div className="flex gap-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('newsletterPlaceholder')}
                  disabled={newsletterStatus === 'loading' || newsletterStatus === 'success'}
                  className="flex-1 min-w-[220px] rounded-lg border border-[#E5E7EB] px-4 py-2.5 text-sm text-on-surface placeholder-on-surface-variant focus:outline-none focus:ring-2 focus:ring-[#84C225] disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={newsletterStatus === 'loading' || newsletterStatus === 'success'}
                  className="rounded-lg px-5 py-2.5 text-sm font-semibold text-white bg-[#84C225] hover:bg-[#72a81f] transition-colors disabled:opacity-60 whitespace-nowrap"
                >
                  {t('newsletterSubscribe')}
                </button>
              </div>
              {newsletterStatus === 'success' && (
                <p className="text-[12px] text-[#84C225]">{t('newsletterSuccess')}</p>
              )}
              {newsletterStatus === 'error' && (
                <p className="text-[12px] text-red-500">{t('newsletterError')}</p>
              )}
              {newsletterStatus === 'idle' && (
                <p className="text-[12px] text-on-surface-variant">{t('newsletterPrivacy')}</p>
              )}
            </form>
          </div>
        </div>

        {/* Bottom row */}
        <div className="mt-12 pt-12 border-t border-[#E5E7EB] flex flex-wrap items-center justify-between gap-2">
          <span className="text-[12px] text-on-surface-variant">{t('copyright')}</span>

          {/* Legal links — desktop + mobile */}
          <nav aria-label="Legal links" className="flex items-center gap-4">
            {bottomLinks.map(({ label, href }) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[12px] text-on-surface-variant hover:text-on-surface transition-colors"
              >
                {label}
              </a>
            ))}
          </nav>

          {/* Kleverbill brand link — desktop */}
          <div className="hidden min-[815px]:flex flex-col items-end gap-1">
            <a
              href="https://kleverbill.de"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <Logo className="h-[38px] w-auto" />
              <span className="text-sm font-semibold tracking-wide" style={{ color: '#1A2420' }}>
                Kleverbill
              </span>
            </a>
            <span className="text-[12px] text-on-surface-variant">{t('tagline')}</span>
          </div>
        </div>
      </div>

      <CalendlyModal
        isOpen={calendlyOpen}
        onClose={() => setCalendlyOpen(false)}
        url={buildCalendlyUrl(formState, results, plan)}
      />
    </footer>
  )
}
