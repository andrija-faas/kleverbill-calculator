interface SupportingTilesProps {
  rd: string
  rr: string
  icc: string
}

export function SupportingTiles({ rd, rr, icc }: SupportingTilesProps) {
  const tiles = [
    { label: 'Delayed every month', value: rd },
    { label: 'At risk of non-payment', value: rr },
    { label: 'Spent on manual chasing', value: icc },
  ]

  return (
    <div className="max-w-4xl mx-auto px-8 -mt-8 relative z-10">
      <div className="bg-surface-lowest rounded-xl shadow-card p-8 flex items-center justify-between gap-8 flex-wrap">
        {tiles.map((tile) => (
          <div key={tile.label}>
            <p className="text-[10px] font-medium tracking-[0.05em] uppercase text-on-surface-variant mb-0.5">
              {tile.label}
            </p>
            <p className="text-[22px] font-medium text-on-surface tracking-[-0.02em]">
              {tile.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
