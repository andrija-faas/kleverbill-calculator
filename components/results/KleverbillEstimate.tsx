'use client'

import { useTranslations } from 'next-intl'

interface KleverbillEstimateProps {
  eruv: string
  els: string
  acb: string
}

export function KleverbillEstimate({ eruv, els, acb }: KleverbillEstimateProps) {
  const t = useTranslations('kleverbillEstimate')

  const tiles = [
    { verb: t('tile0verb'), value: eruv, desc: t('tile0desc') },
    { verb: t('tile1verb'), value: els,  desc: t('tile1desc') },
    { verb: t('tile2verb'), value: acb,  desc: t('tile2desc') },
  ]

  return (
    <div className="bg-surface-lowest rounded-2xl p-5 sm:p-8">
      <p className="text-[10px] font-medium tracking-[0.10em] uppercase text-primary mb-1">
        {t('eyebrow')}
      </p>
      <h2 className="text-[17px] font-medium text-on-surface mb-5 sm:mb-6">
        {t('title')}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {tiles.map((tile) => (
          <div key={tile.verb} className="bg-surface-low rounded-xl p-4 sm:p-6">
            <p className="text-[10px] font-medium tracking-[0.05em] uppercase text-on-surface-variant mb-1">{tile.verb}</p>
            <p className="text-[clamp(1.4rem,2.5vw,2rem)] font-semibold text-primary tracking-[-0.03em] leading-none mb-2">
              {tile.value}
            </p>
            <p className="text-[12px] text-on-surface-variant">{tile.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
