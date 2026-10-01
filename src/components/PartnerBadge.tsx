import { useTranslations } from 'next-intl'
import './css/PartnerBadge.css'

// Офіційний партнерський логотип зі брендбуку Shop-Express (shop-express.ua/ukr/assets/).
// Правила брендбука: пропорції не міняти, ширина не менше 75px, вільне місце навколо,
// фон — білий, світло-сірий, чорний або жовтий. Тому файл не стилізуємо, лише масштабуємо.
export default function PartnerBadge({
  namespace = 'platforms.shop-express.partner',
}: {
  namespace?: string
}) {
  const t = useTranslations(namespace)
  return (
    <section className="partner-badge" aria-label={t('label')}>
      <a href={t('href')} target="_blank" rel="noopener" className="partner-badge-link">
        {/* eslint-disable-next-line @next/next/no-img-element -- статичний SVG, оптимізація не потрібна */}
        <img src="/partners/shop-express-partner.svg" alt={t('alt')} width={178} height={78} />
      </a>
      <p className="partner-badge-text">{t('label')}</p>
    </section>
  )
}
