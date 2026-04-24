'use client'

import { useTranslations } from 'next-intl'

export function MethodologySection() {
  const t = useTranslations('methodology')
  const steps = t.raw('steps') as { title: string; text: string }[]
  const metrics = t.raw('metrics') as { label: string; abbr: string; text: string }[]

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: t('howToName'),
    description: t('howToDescription'),
    step: steps.map((s, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: s.title,
      text: s.text,
    })),
  }

  return (
    <section
      aria-label={t('eyebrow')}
      className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 pb-16 sm:pb-24"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Section header */}
      <p className="text-[11px] font-medium tracking-[0.10em] uppercase text-primary mb-4">
        {t('eyebrow')}
      </p>
      <div className="flex flex-wrap items-end justify-between gap-4 mb-10 sm:mb-12">
        <h2 className="text-[clamp(1.4rem,3vw,2rem)] font-light tracking-[-0.02em] text-on-surface leading-[1.15]">
          {t('headlinePre')}{' '}
          <strong className="font-semibold text-primary">{t('headlineStrong')}</strong>
        </h2>
        <p className="text-[14px] text-on-surface-variant leading-relaxed max-w-sm">
          {t('subline')}
        </p>
      </div>

      {/* Steps */}
      <p className="text-[11px] font-medium tracking-[0.10em] uppercase text-on-surface-variant mb-5">
        {t('stepsEyebrow')}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-12 sm:mb-16">
        {steps.map((step, i) => (
          <div key={i} className="bg-white rounded-2xl border border-[#E5E7EB] p-5">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-primary text-white text-[11px] font-semibold mb-4 shrink-0">
              {i + 1}
            </span>
            <p className="text-[14px] font-semibold text-on-surface mb-2 leading-snug">
              {step.title}
            </p>
            <p className="text-[13px] text-on-surface-variant leading-relaxed">
              {step.text}
            </p>
          </div>
        ))}
      </div>

      {/* Metrics */}
      <p className="text-[11px] font-medium tracking-[0.10em] uppercase text-on-surface-variant mb-5">
        {t('metricsEyebrow')}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {metrics.map((metric) => (
          <div key={metric.abbr} className="bg-white rounded-2xl border border-[#E5E7EB] p-6">
            <div className="flex items-baseline gap-2.5 mb-3">
              <span className="text-[15px] font-semibold text-on-surface leading-none">
                {metric.label}
              </span>
              <span className="text-[10px] font-semibold tracking-[0.08em] uppercase text-primary bg-primary/10 rounded px-1.5 py-0.5">
                {metric.abbr}
              </span>
            </div>
            <p className="text-[13px] text-on-surface-variant leading-[1.7]">
              {metric.text}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
