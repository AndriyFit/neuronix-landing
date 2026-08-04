'use client'
import { useTranslations } from 'next-intl'
import { useScrollReveal } from '@/lib/useScrollReveal'
import './css/CaseStudy.css'

export default function CaseStudy() {
  const t = useTranslations('caseStudy')
  const chain = t.raw('chain') as string[]
  const metrics = t.raw('metrics') as Array<{ metric: string; label: string }>
  const ref = useScrollReveal<HTMLElement>()

  return (
    <section id="results" className="case" ref={ref}>
      <div className="case-inner">
        <h2 className="case-title animate-in">{t('title')}</h2>
        <p className="case-client animate-in">{t('client')}</p>

        <div className="case-flow animate-in">
          <div className="case-before">
            <span className="case-label">{t('beforeLabel')}</span>
            <p>{t('before')}</p>
          </div>

          <div className="case-after">
            <span className="case-label">{t('afterLabel')}</span>
            <div className="case-chain">
              {chain.map((node, i) => (
                <span className="case-node" key={i}>
                  {node}
                </span>
              ))}
            </div>
            <p className="case-chain-note">{t('chainNote')}</p>
          </div>
        </div>

        <div className="case-metrics">
          {metrics.map((m, i) => (
            <div
              className="case-metric animate-in"
              key={i}
              style={{ transitionDelay: `${i * 0.08}s` }}
            >
              <span className="case-metric-value">{m.metric}</span>
              <span className="case-metric-label">{m.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
