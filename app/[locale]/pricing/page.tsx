import { getTranslations } from 'next-intl/server'
import { Check, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { PlanBadge } from '@/components/ui/PlanBadge'
import { PLANS } from '@/lib/planTiers'
import type { PlanTier } from '@/types/calculator.types'

const CALENDLY_BASE = 'https://calendly.com/kleverbill/kleverbill-analyse-rechner'
const TIERS: PlanTier[] = ['Silver', 'Gold', 'Platinum', 'Enterprise']

export default async function PricingPage({
  params: { locale },
}: {
  params: { locale: string }
}) {
  const t = await getTranslations({ locale, namespace: 'pricingPage' })
  const tPlans = await getTranslations({ locale, namespace: 'plans' })

  const kleverbillPricingUrl =
    locale === 'de'
      ? 'https://www.kleverbill.de/preis'
      : 'https://www.kleverbill.de/en/pricing'

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: locale === 'de' ? 'Kleverbill Preispläne' : 'Kleverbill Pricing Plans',
    itemListElement: TIERS.map((tier, i) => {
      const plan = PLANS[tier]
      return {
        '@type': 'ListItem',
        position: i + 1,
        item: {
          '@type': 'Offer',
          name: tier,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          description: tPlans(`${tier}.description` as any),
          ...(plan.price !== null
            ? { price: plan.price.toString(), priceCurrency: 'EUR' }
            : {}),
          offeredBy: { '@type': 'Organization', name: 'Kleverbill' },
        },
      }
    }),
  }

  return (
    <main className="min-h-screen bg-surface">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 pt-8 sm:pt-20 pb-12">
        <p className="text-[11px] font-medium tracking-[0.10em] uppercase text-primary mb-4">
          {t('eyebrow')}
        </p>
        <h1 className="text-[clamp(1.8rem,5vw,3.5rem)] font-light leading-[1.1] tracking-[-0.02em] text-on-surface mb-4">
          {t('headlinePre')}{' '}
          <strong className="font-semibold text-primary">{t('headlineStrong')}</strong>
        </h1>
        <p className="text-base text-on-surface-variant leading-[1.7] max-w-[520px]">
          {t('subline')}
        </p>
      </div>

      {/* Pricing grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 items-start">
          {TIERS.map((tier) => {
            const plan = PLANS[tier]
            const isGold = tier === 'Gold'
            const isEnterprise = tier === 'Enterprise'
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const description = tPlans(`${tier}.description` as any) as string
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const features = tPlans.raw(`${tier}.features` as any) as string[]

            const ctaHref = isEnterprise
              ? `${CALENDLY_BASE}?utm_source=pricing&utm_medium=enterprise`
              : kleverbillPricingUrl

            return (
              <div
                key={tier}
                className={`bg-white rounded-2xl p-6 sm:p-8 flex flex-col ${
                  isGold ? 'ring-2 ring-[#84C225]' : 'border border-[#E5E7EB]'
                }`}
              >
                {isGold && (
                  <span className="inline-block self-start mb-3 text-[11px] font-semibold tracking-[0.05em] uppercase bg-[#84C225] text-white rounded-full px-3 py-0.5">
                    {t('mostPopular')}
                  </span>
                )}

                <PlanBadge tier={tier} />

                <div className="mt-4 mb-1 flex items-baseline gap-1">
                  {plan.price !== null ? (
                    <>
                      <span className="text-[2.2rem] font-semibold tracking-[-0.03em] text-on-surface leading-none">
                        €{plan.price}
                      </span>
                      <span className="text-[13px] text-on-surface-variant">{t('perMonth')}</span>
                    </>
                  ) : (
                    <span className="text-[1.4rem] font-medium text-on-surface leading-none">
                      {t('customPricing')}
                    </span>
                  )}
                </div>

                <p className="mt-2 text-[13px] text-on-surface-variant leading-relaxed mb-6">
                  {description}
                </p>

                <div className="border-t border-[#E5E7EB] pt-6 flex-1">
                  <ul className="space-y-3">
                    {features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5 text-[13px] text-on-surface">
                        <Check size={14} className="text-primary flex-shrink-0 mt-0.5" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8">
                  <a
                    href={ctaHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center justify-center gap-2 w-full rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors ${
                      isGold
                        ? 'bg-[#84C225] text-white hover:bg-[#72a81f]'
                        : 'bg-surface text-on-surface hover:bg-surface-high border border-[#E5E7EB]'
                    }`}
                  >
                    {isEnterprise ? t('contactSales') : t('getStarted')}
                    <ArrowRight size={14} />
                  </a>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 pb-8">
        <div
          className="rounded-2xl p-8 sm:p-12 text-center relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #466800 0%, #3d5b00 100%)' }}
        >
          <div className="absolute -top-10 -right-10 w-52 h-52 rounded-full bg-white/[0.06]" />
          <p className="text-[11px] font-medium tracking-[0.12em] uppercase text-white/65 mb-3">
            {t('ctaEyebrow')}
          </p>
          <h2 className="text-[clamp(1.4rem,3vw,2rem)] font-light text-white tracking-[-0.02em] leading-[1.2] mb-3">
            {t('ctaHeadlinePre')}{' '}
            <strong className="font-semibold">{t('ctaHeadlineStrong')}</strong>
          </h2>
          <p className="text-[14px] text-white/90 leading-relaxed max-w-md mx-auto mb-8">
            {t('ctaBody')}
          </p>
          <Link
            href={`/${locale}/calculator`}
            className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold bg-white text-[#466800] hover:bg-white/90 transition-colors"
          >
            {t('ctaButton')}
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </main>
  )
}
