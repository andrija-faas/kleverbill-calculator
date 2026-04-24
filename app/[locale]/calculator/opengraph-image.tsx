import { ImageResponse } from 'next/og'
import { getTranslations } from 'next-intl/server'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OgImage({
  params,
}: {
  params: { locale: string }
}) {
  const t = await getTranslations({ locale: params.locale, namespace: 'meta' })

  return new ImageResponse(
    <div
      style={{
        width: 1200,
        height: 630,
        background: '#1A2420',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '64px 72px',
        fontFamily: 'sans-serif',
      }}
    >
      {/* Top: brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 10,
            background: '#84C225',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span style={{ color: '#1A2420', fontSize: 30, fontWeight: 700, lineHeight: 1 }}>
            K
          </span>
        </div>
        <span
          style={{
            color: '#84C225',
            fontSize: 24,
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
          }}
        >
          Kleverbill
        </span>
      </div>

      {/* Middle: headline */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div
          style={{
            display: 'flex',
            background: '#84C225',
            borderRadius: 6,
            padding: '6px 16px',
            width: 'fit-content',
          }}
        >
          <span style={{ color: '#1A2420', fontSize: 18, fontWeight: 600 }}>
            {t('ogTitle')}
          </span>
        </div>
        <div
          style={{
            color: '#FFFFFF',
            fontSize: 64,
            fontWeight: 700,
            lineHeight: 1.1,
            maxWidth: 900,
          }}
        >
          {t('ogDescription')}
        </div>
      </div>

      {/* Bottom: URL + metric strip */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span style={{ color: '#586064', fontSize: 20 }}>kleverbill.de</span>
        <div style={{ display: 'flex', gap: 32 }}>
          {['2–3×', '70%', '€0'].map((stat, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <span style={{ color: '#84C225', fontSize: 28, fontWeight: 700 }}>
                {stat}
              </span>
              <span style={{ color: '#586064', fontSize: 14 }}>
                {['avg. underestimate', 'effort saved', 'anonymous'][i]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>,
    { ...size }
  )
}
