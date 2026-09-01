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
    width: 268,
    height: 50,
  },
  {
    name: 'Cornix',
    href: 'https://cornix.ua',
    logo: '/clients/cornix.png',
    width: 200,
    height: 100,
  },
  {
    name: 'AbTime',
    href: 'https://abtime.com.ua',
    logo: '/clients/abtime.png',
    width: 500,
    height: 500,
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
    width: 200,
    height: 67,
  },
]

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
              style={{ transitionDelay: `${index * 0.08}s` }}
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
