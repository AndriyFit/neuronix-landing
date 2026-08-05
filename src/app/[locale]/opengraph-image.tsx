import { ImageResponse } from 'next/og'

// Одна картинка на всі маршрути: Next автоматично підставляє її в og:image і
// twitter:image. Раніше твітер-картка була оголошена як summary_large_image,
// але картинки не існувало — кожен шер у Telegram чи FB йшов без прев'ю.
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = 'Neuronix — розробка сайтів та автоматизація для бізнесу'

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '0 90px',
          background: 'linear-gradient(135deg, #7C3AED 0%, #4F46E5 100%)',
          color: '#ffffff',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ fontSize: 92, fontWeight: 800, letterSpacing: -2 }}>NEURONIX</div>
        <div style={{ fontSize: 44, lineHeight: 1.25, marginTop: 24, opacity: 0.95 }}>
          Розробка сайтів, інтернет-магазинів
        </div>
        <div style={{ fontSize: 44, lineHeight: 1.25, opacity: 0.95 }}>
          та автоматизація для бізнесу
        </div>
        <div style={{ display: 'flex', alignItems: 'center', marginTop: 48, fontSize: 30, opacity: 0.8 }}>
          neuronics.work
        </div>
      </div>
    ),
    size,
  )
}
