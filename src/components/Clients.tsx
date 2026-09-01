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
  {
    name: 'Hop-Sport',
    href: 'https://hop-sport.com.ua',
    logo: '/clients/hop-sport.png',
    width: 450,
    height: 150,
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
    width: 2448,
    height: 845,
  },
  {
    name: 'Di Volio',
    href: 'https://divolio.com.ua',
    logo: '/clients/divolio.png',
    width: 450,
    height: 150,
  },
  {
    name: 'Trex Sport',
    href: 'https://trex-sport.com.ua',
    logo: '/clients/trex-sport.png',
    width: 450,
    height: 150,
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
