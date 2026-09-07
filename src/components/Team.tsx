'use client'
import { useTranslations } from 'next-intl'
import { useScrollReveal } from '@/lib/useScrollReveal'
import './css/Team.css'

interface Member {
  /** Position — the card heading. This is what a client actually needs to know. */
  role: string
  /** First name only. Placeholder until real people are confirmed. */
  name?: string
  /** What this role closes for the client. */
  note?: string
  /** Path under /public, e.g. "/team/andriy.webp". */
  photo: string
}

export default function Team() {
  const t = useTranslations('team')
  const members = t.raw('members') as Member[]
  const ref = useScrollReveal<HTMLElement>()

  return (
    <section id="team" className="team" ref={ref}>
      <div className="team-inner">
        <h2 className="team-title animate-in">{t('title')}</h2>
        <p className="team-subtitle animate-in">{t('subtitle')}</p>

        <div className="team-grid">
          {members.map((member, i) => (
            <div
              className="team-card animate-in"
              key={i}
              style={{ transitionDelay: `${i * 0.08}s` }}
            >
              {/* Збірної картки з роликом більше немає: у слот-анімацію був ВШИТИЙ
                  фіолетовий обідок і білі поля (це видно в кожному кадрі, не лише
                  в постері), тож CSS клипав коло в колі, а праворуч лізло чуже
                  волосся. Перекодування цього не лікувало — зіпсоване джерело.
                  Що робила та картка, тепер сказано в підзаголовку секції. */}
              <div className="team-avatar">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={member.photo}
                  alt={member.name ?? member.role}
                  width={160}
                  height={160}
                  loading="lazy"
                />
              </div>
              <h3 className="team-position">{member.role}</h3>
              {member.name && <p className="team-person">{member.name}</p>}
              {member.note && <p className="team-note">{member.note}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
