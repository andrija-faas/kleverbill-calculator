'use client'

import { useTranslations } from 'next-intl'

export function FaqSection() {
  const t = useTranslations('faq')
  const items = t.raw('items') as { q: string; a: string }[]

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  }

  return (
    <section
      aria-label={t('heading')}
      className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 pb-16 sm:pb-24"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <h2 className="text-[11px] font-medium tracking-[0.10em] uppercase text-primary mb-6">
        {t('heading')}
      </h2>

      <dl className="divide-y divide-outline-variant">
        {items.map(({ q, a }, i) => (
          <details key={i} className="group py-4">
            <summary className="flex items-center justify-between gap-4 cursor-pointer list-none select-none">
              <dt className="text-[15px] font-medium text-on-surface leading-snug">{q}</dt>
              <span
                className="shrink-0 w-5 h-5 rounded-full border border-outline-variant flex items-center justify-center text-on-surface-variant transition-transform group-open:rotate-45"
                aria-hidden="true"
              >
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M5 1v8M1 5h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </span>
            </summary>
            <dd className="mt-3 text-[14px] text-on-surface-variant leading-[1.7] max-w-3xl pr-8">
              {a}
            </dd>
          </details>
        ))}
      </dl>
    </section>
  )
}
