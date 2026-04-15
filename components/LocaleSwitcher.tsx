'use client'

import { useLocale } from 'next-intl'
import { useRouter, usePathname } from '@/i18n/navigation'

export function LocaleSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  function switchLocale(next: string) {
    router.replace(pathname, { locale: next })
  }

  return (
    <button
      type="button"
      onClick={() => switchLocale(locale === 'de' ? 'en' : 'de')}
      className="rounded-md px-2.5 py-1 text-[11px] font-semibold tracking-widest uppercase border border-outline-variant/40 text-on-surface-variant hover:border-primary hover:text-primary transition-colors"
    >
      {locale === 'de' ? 'EN' : 'DE'}
    </button>
  )
}
