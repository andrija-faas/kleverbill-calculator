import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://calculator.kleverbill.de'

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'pricingPage' })
  const canonicalUrl = `${siteUrl}/${locale}/pricing`

  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    keywords: t('metaKeywords'),
    alternates: {
      canonical: canonicalUrl,
      languages: {
        de: `${siteUrl}/de/pricing`,
        en: `${siteUrl}/en/pricing`,
        'x-default': `${siteUrl}/de/pricing`,
      },
    },
    openGraph: {
      title: t('metaTitle'),
      description: t('metaDescription'),
      type: 'website',
      url: canonicalUrl,
      siteName: 'Kleverbill',
      locale: locale === 'de' ? 'de_DE' : 'en_GB',
    },
    twitter: {
      card: 'summary_large_image',
      title: t('metaTitle'),
      description: t('metaDescription'),
      site: '@kleverbill',
    },
  }
}

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return children
}
