'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { useScrollReveal } from '@/lib/useScrollReveal'
import './css/Clients.css'

const clients: Array<{
  name: string
  href: string
  logo: string
  width: number
  height: number
  dark?: boolean
}> = [
  {
    name: 'Besport',
    href: 'https://besport.ua',
    logo: '/clients/besport.webp',
    width: 127,
    height: 50,
  },
  {
    name: 'Cornix',
    href: 'https://cornix.ua',
    logo: '/clients/cornix.png',
    width: 200,
    height: 33,
  },
  {
    name: 'AbTime',
    href: 'https://abtime.com.ua',
    logo: '/clients/abtime.png',
    width: 464,
    height: 76,
  },
  {
    name: 'Trembita Group',
    href: 'https://trembita.group',
    logo: '/clients/trembita.svg',
    width: 242,
    height: 125,
    dark: true,
  },
  {
    name: 'Watermax',
    href: 'https://watermax.ua',
    logo: '/clients/watermax.png',
    width: 147,
    height: 51,
  },
  {
    name: 'Hop-Sport',
    href: 'https://hop-sport.com.ua',
    logo: '/clients/hop-sport.png',
    width: 450,
    height: 86,
  },
  {
    name: 'Sportvida',
    href: 'https://sportvida.com.ua',
    logo: '/clients/sportvida.png',
    width: 640,
    height: 65,
  },
  {
    name: '4FIZJO',
    href: 'https://4fizjo.com.ua',
    logo: '/clients/4fizjo.svg',
    width: 2223,
    height: 591,
  },
  {
    name: 'Di Volio',
    href: 'https://divolio.com.ua',
    logo: '/clients/divolio.png',
    width: 450,
    height: 97,
  },
  {
    name: 'Trex Sport',
    href: 'https://trex-sport.com.ua',
    logo: '/clients/trex-sport.png',
    width: 295,
    height: 83,
  },
]

// Пропорції логотипів різняться від 1,9:1 (Трембіта) до 9,8:1 (SportVida).
// Одна спільна висота робить широкі логотипи вдвічі «більшими» за площею,
// одна спільна ширина — навпаки. Тому вирівнюємо за ПЛОЩЕЮ: h = sqrt(area / ratio).
// LOGO_AREA підібрана так, щоб при ній жоден логотип, крім найширшого,
// не впирався в ширину картки (~164px на десктопі).
const LOGO_AREA = 3600
const LOGO_MAX_HEIGHT = 46
const LOGO_MIN_HEIGHT = 18

function logoHeight({ width, height }: { width: number; height: number }) {
  const ratio = width / height
  const optical = Math.sqrt(LOGO_AREA / ratio)
  return Math.round(Math.min(LOGO_MAX_HEIGHT, Math.max(LOGO_MIN_HEIGHT, optical)))
}

export default function Clients() {
  const t = useTranslations('clients')
  const ref = useScrollReveal<HTMLElement>()

  return (
    <section className="clients" ref={ref} aria-labelledby="clients-title">
      <div className="clients-inner">
        <div className="clients-heading animate-in">
          <p className="clients-eyebrow">{t('eyebrow')}</p>
          <h2 id="clients-title">{t('title')}</h2>
          <p>{t('subtitle')}</p>
        </div>

        <div className="clients-grid">
          {clients.map((client, index) => (
            <a
              className={`client-logo animate-in${client.dark ? ' client-logo--dark' : ''}`}
              href={client.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${client.name} — ${t('visit')}`}
              key={client.name}
              style={
                {
                  transitionDelay: `${index * 0.08}s`,
                  '--logo-h': `${logoHeight(client)}px`,
                } as React.CSSProperties
              }
            >
              <Image
                src={client.logo}
                alt={client.name}
                width={client.width}
                height={client.height}
                sizes="(max-width: 600px) 42vw, 180px"
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
