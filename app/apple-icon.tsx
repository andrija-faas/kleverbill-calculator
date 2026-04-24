import { ImageResponse } from 'next/og'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: 180,
        height: 180,
        borderRadius: 40,
        background: '#1A2420',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <span
        style={{
          color: '#84C225',
          fontSize: 120,
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
