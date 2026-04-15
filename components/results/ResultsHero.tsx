'use client'

import { useTranslations } from 'next-intl'

interface ResultsHeroProps {
  emrl: string
  mrv: string
  els: string
  rd: string
  rr: string
  icc: string
  // raw numbers for the bar chart inside the ELS card
  elsFraction: number // ELS / (ERUV + ELS) — 0..1
}

export function ResultsHero({ emrl, mrv, els, rd, rr, icc, elsFraction }: ResultsHeroProps) {
  const t = useTranslations('resultsHero')
  const eruFraction = 1 - elsFraction

  return (
    <div className="bg-surface pt-28 pb-0">
      <div className="max-w-7xl mx-auto px-8 lg:px-12">
        {/* Two-column hero */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] xl:grid-cols-[1fr_400px] gap-8 lg:gap-12 items-start">

          {/* Left — headline + MRV + supporting tiles */}
          <div>
            <p className="text-[11px] font-medium tracking-[0.10em] uppercase text-primary mb-5">
              {t('eyebrow')}
            </p>
            <h1 className="text-[clamp(1.8rem,4vw,2.8rem)] font-light leading-[1.15] tracking-[-0.02em] text-on-surface mb-2">
              {t('headlinePre')}{' '}
              <strong className="font-semibold">{emrl}</strong>{' '}
              {t('headlinePost')}
            </h1>
            <p className="text-[14px] text-on-surface-variant mb-10">
              {t('subtitle')}
            </p>

            {/* Recovered revenue — main hero metric */}
            <div className="mb-8">
              <p className="text-[10px] font-medium tracking-[0.08em] uppercase text-on-surface-variant mb-1">
                {t('recoveredRevenue')}
              </p>
              <p className="text-[3.2rem] font-semibold text-primary leading-none tracking-[-0.03em]">
                {mrv}
              </p>
              <p className="text-[12px] text-on-surface-variant mt-1.5">
                {t('recoveredRevenueDesc')}
              </p>
            </div>

            {/* Supporting mini-tiles */}
            <div className="grid grid-cols-3 gap-4 py-6 border-t border-outline-variant/20">
              <div>
                <p className="text-[10px] font-medium tracking-[0.05em] uppercase text-on-surface-variant mb-0.5">
                  {t('delayedLabel')}
                </p>
                <p className="text-[18px] font-medium text-on-surface tracking-[-0.02em]">{rd}</p>
                <p className="text-[11px] text-on-surface-variant mt-0.5">{t('delayedDesc')}</p>
              </div>
              <div>
                <p className="text-[10px] font-medium tracking-[0.05em] uppercase text-on-surface-variant mb-0.5">
                  {t('atRiskLabel')}
                </p>
                <p className="text-[18px] font-medium text-on-surface tracking-[-0.02em]">{rr}</p>
                <p className="text-[11px] text-on-surface-variant mt-0.5">{t('atRiskDesc')}</p>
              </div>
              <div>
                <p className="text-[10px] font-medium tracking-[0.05em] uppercase text-on-surface-variant mb-0.5">
                  {t('chasingLabel')}
                </p>
                <p className="text-[18px] font-medium text-on-surface tracking-[-0.02em]">{icc}</p>
                <p className="text-[11px] text-on-surface-variant mt-0.5">{t('chasingDesc')}</p>
              </div>
            </div>
          </div>

          {/* Right — stacked metric cards */}
          <div className="space-y-4">
            {/* EMRL exposure card */}
            <div className="rounded-2xl bg-surface-lowest shadow-card p-7">
              <p className="text-[10px] font-medium tracking-[0.08em] uppercase text-on-surface-variant mb-1">
                {t('monthlyExposure')}
              </p>
              <p className="text-[2.8rem] font-light leading-none tracking-[-0.03em] text-on-surface mb-1">
                {emrl}
              </p>
              <p className="text-[12px] text-on-surface-variant">
                {t('monthlyExposureDesc')}
              </p>
            </div>

            {/* ELS dark card with mini bar chart */}
            <div
              className="rounded-2xl p-7 relative overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #466800 0%, #3d5b00 100%)' }}
            >
              {/* Decorative circle */}
              <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/[0.06]" />

              <p className="text-[10px] font-medium tracking-[0.08em] uppercase text-white/60 mb-1 relative z-10">
                {t('labourSavingsLabel')}
              </p>
              <p className="text-[2.2rem] font-semibold leading-none tracking-[-0.03em] text-white mb-4 relative z-10">
                {els}
              </p>

              {/* Mini breakdown bar */}
              <div className="relative z-10 mb-2">
                <div className="flex rounded-full overflow-hidden h-2">
                  <div
                    className="bg-primary-container transition-all duration-300"
                    style={{ width: `${Math.round(eruFraction * 100)}%` }}
                  />
                  <div
                    className="bg-white/40 transition-all duration-300"
                    style={{ width: `${Math.round(elsFraction * 100)}%` }}
                  />
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-[10px] text-white/55">{t('recovery')}</span>
                  <span className="text-[10px] text-white/55">{t('labourSavings')}</span>
                </div>
              </div>

              <p className="text-[11px] text-white/55 relative z-10">
                {t('chasingEffortDesc')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
