import { getLocale } from 'next-intl/server'

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
      <body>{children}</body>
    </html>
  )
}
