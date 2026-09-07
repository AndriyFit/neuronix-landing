'use client'
import { useTranslations } from 'next-intl'
import './css/Hero.css'

export default function Hero() {
  const t = useTranslations('hero')
  const trust = t.raw('trust') as string[]

  const scrollToContact = () => {
    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="hero" id="hero">
      <div className="hero-content">
        <h1 className="hero-title hero-anim hero-anim-1">
          {t('titleStart')}
          <span className="hero-title-highlight">{t('titleHighlight')}</span>
          {t('titleEnd')}
        </h1>

        {/* Одна дія. Друга кнопка (Telegram) прибрана свідомо: у першому екрані було три
            виходи — ця кнопка, така сама в навбарі й у липкій панелі, — і людина, яка
            виходить в онлайн уперше, витрачала увагу на вибір каналу замість заявки.
            Telegram лишається в контактах і футері для тих, хто його шукає. */}
        <div className="hero-actions hero-anim hero-anim-2">
          <button className="hero-cta-primary" onClick={scrollToContact}>
            {t('ctaPrimary')}
          </button>
        </div>

        <p className="hero-subtitle hero-anim hero-anim-3">{t('subtitle')}</p>

        <ul className="hero-trust hero-anim hero-anim-4">
          {trust.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </div>

      {/* Підпис — не декор: людина, яка ще не має сайту, питає «а що я взагалі отримаю».
          Відповідь — справжній магазин, який ми зробили, з живими цінами й кнопкою
          «Купити», а не схема з підписами CRM і API. */}
      <div className="hero-visual">
        <div className="hero-phone">
          <div className="hero-phone-screen">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="hero-phone-shot"
              src="/hero/store.webp"
              alt={t('showcase.alt')}
              width={640}
              height={4155}
              fetchPriority="high"
              decoding="async"
            />
          </div>
        </div>
        <p className="hero-phone-caption">{t('showcase.caption')}</p>
      </div>
    </section>
  )
}
