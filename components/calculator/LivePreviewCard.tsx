'use client'

import { useTranslations } from 'next-intl'

export function LivePreviewCard() {
  const t = useTranslations('livePreview')

  return (
    <div className="rounded-2xl bg-surface-lowest shadow-card overflow-hidden sticky top-24">
      {/* Header */}
      <div className="px-7 py-5 border-b border-outline-variant/20">
        <p className="text-[9px] font-semibold tracking-[0.15em] uppercase text-on-surface-variant">
          {t('header')}
        </p>
      </div>

      <div className="px-7 py-6">
        <p className="text-[13px] text-on-surface-variant leading-[1.7]">
          {t('p1')}
        </p>
        <p className="text-[13px] text-on-surface-variant leading-[1.7] mt-4">
          {t('p2')}
        </p>
        <p className="text-[13px] text-on-surface-variant leading-[1.7] mt-4">
          {t('p3')}
        </p>
      </div>
    </div>
  )
}
