import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

// Одна картинка на всі маршрути: Next автоматично підставляє її в og:image і
// twitter:image. Раніше твітер-картка була оголошена як summary_large_image,
// але картинки не існувало — кожен шер у Telegram чи FB йшов без прев'ю.
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = 'Neuronix — розробка сайтів та автоматизація для бізнесу'

export default async function OpengraphImage() {
  // Офіційний логотип із брендбуку на білій плашці (на фіолетовому тлі темний текст
  // логотипа не читається, а інверсна версія втрачає фіолетовий знак).
  const logo = await readFile(join(process.cwd(), 'public/brand/logo.png'))
  const logoSrc = `data:image/png;base64,${logo.toString('base64')}`

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
          background: 'linear-gradient(135deg, #6E36F4 0%, #4F46E5 100%)',
          color: '#ffffff',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignSelf: 'flex-start',
            background: '#ffffff',
            borderRadius: 28,
            padding: '30px 44px',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- next/og рендерить звичайний img */}
          <img src={logoSrc} width={460} height={98} alt="Neuronix" />
        </div>
        <div style={{ fontSize: 44, lineHeight: 1.25, marginTop: 48, opacity: 0.95 }}>
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
