'use client'
import { useTranslations } from 'next-intl'
import { useScrollReveal } from '@/lib/useScrollReveal'
import { useVideoAutoplay } from '@/lib/useVideoAutoplay'
import './css/Team.css'

interface Member {
  /** Position — the card heading. This is what a client actually needs to know. */
  role: string
  /** First name only. Placeholder until real people are confirmed. */
  name?: string
  /** What this role closes for the client. */
  note?: string
  /** Слот-анімація для збірної картки: відео замість GIF, у ~70 разів легше. */
  video?: string
  /** Path under /public, e.g. "/team/andriy.webp". Omit and the slot stays empty. */
  photo?: string
  /** Collective card — the people we assemble per project, not one person. */
  collective?: boolean
}

export default function Team() {
  const t = useTranslations('team')
  const members = t.raw('members') as Member[]
  const ref = useScrollReveal<HTMLElement>()
  const videoRef = useVideoAutoplay()

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
                {member.video ? (
                  <video
                    ref={videoRef}
                    loop
                    muted
                    playsInline
                    preload="none"
                    poster="/team/slot-poster.webp"
                    aria-label={member.role}
                  >
                    <source src={`${member.video}.webm`} type="video/webm" />
                    <source src={`${member.video}.mp4`} type="video/mp4" />
                  </video>
                ) : member.photo ? (
                  <img
                    src={member.photo}
                    alt={member.name ?? member.role}
                    width={160}
                    height={160}
                    loading="lazy"
                  />
                ) : null}
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
