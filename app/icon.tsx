import { ImageResponse } from 'next/og'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: 32,
        height: 32,
        borderRadius: 7,
        background: '#1A2420',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <span
        style={{
          color: '#84C225',
          fontSize: 22,
          fontWeight: 700,
          lineHeight: 1,
          fontFamily: 'sans-serif',
        }}
      >
        K
      </span>
    </div>,
    { ...size }
  )
}
