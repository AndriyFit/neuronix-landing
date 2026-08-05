'use client'
import { useTranslations } from 'next-intl'
import { useScrollReveal } from '@/lib/useScrollReveal'
import './css/Team.css'

interface Member {
  name: string
  role: string
  note?: string
  /** Initials shown until a real photo exists. */
  initials?: string
  /** Path under /public, e.g. "/team/andriy.jpg". Omit and initials are used. */
  photo?: string
  /** Collective card — the people we assemble per project, not one person. */
  collective?: boolean
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
              className={`team-card animate-in${member.collective ? ' team-card-collective' : ''}`}
              key={i}
              style={{ transitionDelay: `${i * 0.08}s` }}
            >
              <div className="team-avatar">
                {member.photo ? (
                  <img src={member.photo} alt={member.name} width={160} height={160} loading="lazy" />
                ) : (
                  <span className="team-initials" aria-hidden="true">
                    {member.initials ?? member.name.slice(0, 1)}
                  </span>
                )}
              </div>
              <h3 className="team-name">{member.name}</h3>
              <p className="team-role">{member.role}</p>
              {member.note && <p className="team-note">{member.note}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
