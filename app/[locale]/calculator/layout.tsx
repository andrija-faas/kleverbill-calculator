import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://calculator.kleverbill.de'

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'meta' })
  const canonicalUrl = `${siteUrl}/${locale}/calculator`

  return {
    title: t('title'),
    description: t('description'),
    keywords: t('keywords'),
    alternates: {
      canonical: canonicalUrl,
      languages: {
        de: `${siteUrl}/de/calculator`,
        en: `${siteUrl}/en/calculator`,
        'x-default': `${siteUrl}/de/calculator`,
      },
    },
    openGraph: {
      title: t('ogTitle'),
      description: t('ogDescription'),
      type: 'website',
      url: canonicalUrl,
      siteName: 'Kleverbill',
      locale: locale === 'de' ? 'de_DE' : 'en_GB',
    },
    twitter: {
      card: 'summary_large_image',
      title: t('ogTitle'),
      description: t('ogDescription'),
      site: '@kleverbill',
    },
  }
}

export default function CalculatorLayout({ children }: { children: React.ReactNode }) {
  return children
}
