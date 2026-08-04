'use client'
import { useTranslations } from 'next-intl'
import { useScrollReveal } from '@/lib/useScrollReveal'
import './css/Ecosystem.css'

export default function Ecosystem() {
  const t = useTranslations('ecosystem')
  const nodes = t.raw('nodes') as Array<{ icon: string; label: string }>
  const benefits = t.raw('benefits') as string[]
  const ref = useScrollReveal<HTMLElement>()

  return (
    <section id="ecosystem" className="ecosystem" ref={ref}>
      <div className="ecosystem-inner">
        <h2 className="ecosystem-title animate-in">{t('title')}</h2>
        <p className="ecosystem-subtitle animate-in">{t('subtitle')}</p>

        <div className="ecosystem-hub animate-in">
          <span className="ecosystem-hub-label">{t('hubLabel')}</span>
          <div className="ecosystem-nodes">
            {nodes.map((node, i) => (
              <div className="eco-node" key={i}>
                <span className="eco-node-icon" aria-hidden="true">
                  {node.icon}
                </span>
                <span className="eco-node-label">{node.label}</span>
              </div>
            ))}
          </div>
        </div>

        <ul className="ecosystem-benefits">
          {benefits.map((benefit, i) => (
            <li
              className="eco-benefit animate-in"
              key={i}
              style={{ transitionDelay: `${i * 0.06}s` }}
            >
              {benefit}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
