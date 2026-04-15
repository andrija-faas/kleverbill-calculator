'use client'

import { useTranslations } from 'next-intl'
import { StickyNote } from 'lucide-react'

export function LivePreviewCard() {
  const t = useTranslations('livePreview')

  return (
    <div className="group w-fit hover:w-full rounded-2xl bg-transparent hover:bg-surface-lowest shadow-none hover:shadow-card overflow-hidden sticky top-24 transition-[width,background-color,box-shadow,grid-template-rows] duration-300">
      <div className="px-7 py-5 flex items-center gap-2">
        <StickyNote size={13} className="text-on-surface-variant shrink-0" />
        <p className="text-[9px] font-semibold tracking-[0.15em] uppercase text-on-surface-variant whitespace-nowrap">
          {t('header')}
        </p>
      </div>

      <div className="px-7 grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-300">
        <div className="overflow-hidden">
          <p className="text-[13px] text-on-surface-variant leading-[1.7] pb-6">
            {t('p2')}
          </p>
        </div>
      </div>
    </div>
  )
}
