import type { Metadata } from 'next'
import Script from 'next/script'
import { getLocale } from 'next-intl/server'

export const metadata: Metadata = {
  icons: {
    icon: '/icon.svg',
    apple: '/icon.svg',
  },
}

// Minimal root layout — sets <html lang> dynamically.
// Fonts, metadata, and providers live in app/[locale]/layout.tsx.
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const locale = await getLocale()
  return (
    <html lang={locale}>
      <body>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-1KE7NZ75BV"
          strategy="afterInteractive"
        />
        <Script id="ga-init" strategy="afterInteractive">
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-1KE7NZ75BV');`}
        </Script>
        {children}
      </body>
    </html>
  )
}
