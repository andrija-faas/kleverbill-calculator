import type { Metadata } from 'next'
import { Lexend } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import { Footer } from '@/components/Footer'
import { Nav } from '@/components/Nav'
import '../globals.css'

const lexend = Lexend({
  subsets: ['latin'],
  variable: '--font-lexend',
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://calculator.kleverbill.de'

export function generateMetadata(): Metadata {
  return {
    metadataBase: new URL(siteUrl),
    robots: { index: true, follow: true },
  }
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  if (!(routing.locales as readonly string[]).includes(locale)) {
    notFound()
  }

  const messages = await getMessages()

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        name: 'Kleverbill',
        url: 'https://kleverbill.de',
        logo: `${siteUrl}/logo.svg`,
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'customer support',
          email: 'help@kleverbill.de',
        },
      },
      {
        '@type': 'SoftwareApplication',
        name:
          locale === 'de'
            ? 'Kleverbill Umsatz-Wiederherstellungsrechner'
            : 'Kleverbill Revenue Recovery Calculator',
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Web',
        url: `${siteUrl}/${locale}/calculator`,
        isAccessibleForFree: true,
        provider: { '@type': 'Organization', name: 'Kleverbill' },
        offers: [
          { '@type': 'Offer', name: 'Silver', price: '39', priceCurrency: 'EUR', description: 'Up to 25 invoices/month' },
          { '@type': 'Offer', name: 'Gold', price: '199', priceCurrency: 'EUR', description: 'Up to 250 invoices/month' },
          { '@type': 'Offer', name: 'Platinum', price: '449', priceCurrency: 'EUR', description: 'Up to 1,000 invoices/month' },
          { '@type': 'Offer', name: 'Enterprise', description: 'Custom pricing, unlimited invoices' },
        ],
      },
    ],
  }

  return (
    <div
      className={`${lexend.variable} min-h-screen bg-surface font-sans text-on-surface antialiased`}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <NextIntlClientProvider messages={messages}>
        <div className="sticky top-0 z-50 bg-surface">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-4">
            <Nav />
          </div>
        </div>
        {children}
        <Footer />
      </NextIntlClientProvider>
    </div>
  )
}
