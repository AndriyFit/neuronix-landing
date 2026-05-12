import { setRequestLocale } from 'next-intl/server'
import type { Metadata } from 'next'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return {
    title:
      locale === 'uk'
        ? 'Політика конфіденційності — Neuronix'
        : 'Privacy Policy — Neuronix',
    robots: { index: false },
  }
}

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const isUk = locale === 'uk'

  return (
    <main
      style={{
        maxWidth: 800,
        margin: '120px auto 80px',
        padding: '0 24px',
        fontFamily: 'var(--font-body)',
        color: 'var(--text)',
      }}
    >
      {isUk ? <PrivacyUk /> : <PrivacyEn />}
    </main>
  )
}

function PrivacyUk() {
  return (
    <article>
      <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
        Політика конфіденційності
      </h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
        Дата набрання чинності: 11 травня 2026 року
      </p>

      <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginTop: '2rem', marginBottom: '0.75rem' }}>
        1. Контролер персональних даних
      </h2>
      <p>
        Ця Політика конфіденційності поширюється на обробку персональних даних,
        яку здійснює:
      </p>
      <ul style={{ paddingLeft: '1.5rem', lineHeight: 1.8 }}>
        <li>
          <strong>Найменування:</strong> ФОП Удич Євген
        </li>
        <li>
          <strong>ЄДРПОУ (ІПН):</strong> 3214711093
        </li>
        <li>
          <strong>Адреса:</strong> с.Ременів, вул.С.Куземського 1, Львівська обл., Україна
        </li>
        <li>
          <strong>Веб-сайт:</strong> neuronix.work
        </li>
        <li>
          <strong>Контакт DPO:</strong>{' '}
          <a href="https://t.me/angordien" style={{ color: 'var(--primary)' }}>
            @angordien у Telegram
          </a>
        </li>
      </ul>

      <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginTop: '2rem', marginBottom: '0.75rem' }}>
        2. Які дані ми збираємо
      </h2>
      <p>
        Ми збираємо лише ті персональні дані, які ви добровільно надаєте через
        форму зворотного зв'язку на сайті:
      </p>
      <ul style={{ paddingLeft: '1.5rem', lineHeight: 1.8 }}>
        <li>Ім'я (ім'я або псевдонім)</li>
        <li>Номер телефону або адреса електронної пошти</li>
        <li>Зміст повідомлення (опис вашого запиту)</li>
      </ul>
      <p style={{ marginTop: '0.75rem' }}>
        Ми <strong>не збираємо</strong> автоматично жодних персональних даних
        (IP-адреси, унікальних ідентифікаторів тощо) без вашої явної згоди.
      </p>

      <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginTop: '2rem', marginBottom: '0.75rem' }}>
        3. Мета обробки персональних даних
      </h2>
      <p>Зібрані дані використовуються виключно для:</p>
      <ul style={{ paddingLeft: '1.5rem', lineHeight: 1.8 }}>
        <li>відповіді на ваш запит або питання;</li>
        <li>встановлення зворотного зв'язку з вами як потенційним клієнтом;</li>
        <li>узгодження умов надання послуг.</li>
      </ul>
      <p style={{ marginTop: '0.75rem' }}>
        Правова підстава обробки — згода суб'єкта даних (стаття 6 Закону України
        «Про захист персональних даних») та виконання договору або заходів,
        вжитих на запит суб'єкта до укладення договору.
      </p>

      <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginTop: '2rem', marginBottom: '0.75rem' }}>
        4. Передача даних третім особам
      </h2>
      <p>
        Ми <strong>не передаємо, не продаємо і не надаємо в оренду</strong> ваші
        персональні дані третім особам, за винятком:
      </p>
      <ul style={{ paddingLeft: '1.5rem', lineHeight: 1.8 }}>
        <li>
          <strong>Telegram API</strong> — для технічної доставки вашого
          повідомлення оператору через захищений канал Telegram. Передача
          здійснюється виключно в межах, необхідних для доставки повідомлення.
          Зберігання здійснюється відповідно до{' '}
          <a
            href="https://telegram.org/privacy"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--primary)' }}
          >
            Політики конфіденційності Telegram
          </a>
          .
        </li>
      </ul>
      <p style={{ marginTop: '0.75rem' }}>
        Будь-яка інша передача даних здійснюється лише за вашою явною згодою або
        у випадках, прямо передбачених законодавством України.
      </p>

      <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginTop: '2rem', marginBottom: '0.75rem' }}>
        5. Файли cookie
      </h2>
      <p>Сайт neuronix.work використовує два типи файлів cookie:</p>
      <ul style={{ paddingLeft: '1.5rem', lineHeight: 1.8 }}>
        <li>
          <strong>Технічні (сесійні) cookie</strong> — необхідні для коректної
          роботи сайту (наприклад, збереження мовних налаштувань). Встановлюються
          автоматично без вашої згоди, оскільки є технічно обов'язковими.
        </li>
        <li>
          <strong>Аналітичні cookie</strong> — збираються лише за вашою явною
          згодою (через банер Cookie Consent). Призначені для розуміння того, як
          відвідувачі використовують сайт.
        </li>
      </ul>
      <p style={{ marginTop: '0.75rem' }}>
        Ви можете будь-коли відкликати свою згоду на аналітичні cookie,
        очистивши localStorage у вашому браузері або через налаштування браузера.
      </p>

      <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginTop: '2rem', marginBottom: '0.75rem' }}>
        6. Термін зберігання даних
      </h2>
      <p>
        Персональні дані, надані через форму зворотного зв'язку, зберігаються не
        довше <strong>1 (одного) року</strong> з дати їх отримання, або до
        отримання вашого запиту на видалення — залежно від того, що настане
        раніше.
      </p>

      <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginTop: '2rem', marginBottom: '0.75rem' }}>
        7. Права суб'єкта персональних даних
      </h2>
      <p>
        Відповідно до Закону України «Про захист персональних даних», ви маєте
        право:
      </p>
      <ul style={{ paddingLeft: '1.5rem', lineHeight: 1.8 }}>
        <li>
          <strong>Доступу</strong> — отримати інформацію про те, які ваші дані ми
          обробляємо.
        </li>
        <li>
          <strong>Виправлення</strong> — вимагати коригування неточних або
          застарілих даних.
        </li>
        <li>
          <strong>Видалення («право на забуття»)</strong> — вимагати видалення
          ваших персональних даних.
        </li>
        <li>
          <strong>Заперечення</strong> — заперечити проти обробки ваших даних.
        </li>
        <li>
          <strong>Відкликання згоди</strong> — відкликати раніше надану згоду без
          впливу на законність обробки до відкликання.
        </li>
      </ul>
      <p style={{ marginTop: '0.75rem' }}>
        Для реалізації будь-якого із зазначених прав зверніться до нас через
        Telegram:{' '}
        <a href="https://t.me/angordien" style={{ color: 'var(--primary)' }}>
          @angordien
        </a>
        . Ми розглянемо ваш запит і відповімо протягом 30 календарних днів.
      </p>

      <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginTop: '2rem', marginBottom: '0.75rem' }}>
        8. Захист персональних даних
      </h2>
      <p>
        Ми вживаємо розумних технічних і організаційних заходів для захисту ваших
        персональних даних від несанкціонованого доступу, розкриття, зміни або
        знищення. Передача даних здійснюється виключно через захищені з'єднання
        (HTTPS).
      </p>

      <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginTop: '2rem', marginBottom: '0.75rem' }}>
        9. Відповідальний за захист персональних даних (DPO)
      </h2>
      <p>
        З питань захисту персональних даних звертайтеся безпосередньо до:{' '}
        <a href="https://t.me/angordien" style={{ color: 'var(--primary)' }}>
          @angordien (Telegram)
        </a>
      </p>

      <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginTop: '2rem', marginBottom: '0.75rem' }}>
        10. Зміни до цієї Політики
      </h2>
      <p>
        Ми залишаємо за собою право вносити зміни до цієї Політики
        конфіденційності. Нова редакція набирає чинності з моменту її публікації
        на сайті. Рекомендуємо переглядати цю сторінку час від часу.
      </p>

      <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginTop: '2rem', marginBottom: '0.75rem' }}>
        11. Правова основа
      </h2>
      <p>
        Ця Політика розроблена відповідно до вимог Закону України «Про захист
        персональних даних» від 01.06.2010 № 2297-VI.
      </p>

      <p style={{ marginTop: '3rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
        ФОП Гордієн Андрій · neuronix.work · Дата: 11.05.2026
      </p>
    </article>
  )
}

function PrivacyEn() {
  return (
    <article>
      <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
        Privacy Policy
      </h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
        Effective date: May 11, 2026
      </p>

      <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginTop: '2rem', marginBottom: '0.75rem' }}>
        1. Data Controller
      </h2>
      <p>This Privacy Policy applies to personal data processed by:</p>
      <ul style={{ paddingLeft: '1.5rem', lineHeight: 1.8 }}>
        <li>
          <strong>Name:</strong> FOP Udych Yevhen (sole proprietor)
        </li>
        <li>
          <strong>USREOU (ЄДРПОУ):</strong> 3214711093
        </li>
        <li>
          <strong>Address:</strong> Remeniv village, Kuzemskoho St. 1, Lviv region, Ukraine
        </li>
        <li>
          <strong>Website:</strong> neuronix.work
        </li>
        <li>
          <strong>DPO contact:</strong>{' '}
          <a href="https://t.me/angordien" style={{ color: 'var(--primary)' }}>
            @angordien on Telegram
          </a>
        </li>
      </ul>

      <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginTop: '2rem', marginBottom: '0.75rem' }}>
        2. What Data We Collect
      </h2>
      <p>
        We only collect personal data that you voluntarily provide through the
        contact form on our website:
      </p>
      <ul style={{ paddingLeft: '1.5rem', lineHeight: 1.8 }}>
        <li>Your name (first name or alias)</li>
        <li>Phone number or email address</li>
        <li>Message content (description of your request)</li>
      </ul>
      <p style={{ marginTop: '0.75rem' }}>
        We do <strong>not</strong> automatically collect any personal data (IP
        addresses, unique identifiers, etc.) without your explicit consent.
      </p>

      <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginTop: '2rem', marginBottom: '0.75rem' }}>
        3. Purpose of Processing
      </h2>
      <p>The collected data is used solely for:</p>
      <ul style={{ paddingLeft: '1.5rem', lineHeight: 1.8 }}>
        <li>responding to your inquiry or question;</li>
        <li>establishing contact with you as a prospective client;</li>
        <li>discussing the terms of service provision.</li>
      </ul>
      <p style={{ marginTop: '0.75rem' }}>
        The legal basis for processing is your consent (pursuant to Ukrainian Law
        on Personal Data Protection) and the performance of a contract or
        pre-contractual measures taken at your request.
      </p>

      <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginTop: '2rem', marginBottom: '0.75rem' }}>
        4. Data Sharing with Third Parties
      </h2>
      <p>
        We do <strong>not sell, trade, or rent</strong> your personal data to
        third parties, except:
      </p>
      <ul style={{ paddingLeft: '1.5rem', lineHeight: 1.8 }}>
        <li>
          <strong>Telegram API</strong> — used solely to deliver your message to
          our operator via Telegram's secure channel. Data is shared only to the
          extent necessary for message delivery and is governed by{' '}
          <a
            href="https://telegram.org/privacy"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--primary)' }}
          >
            Telegram's Privacy Policy
          </a>
          .
        </li>
      </ul>
      <p style={{ marginTop: '0.75rem' }}>
        Any other data transfer occurs only with your explicit consent or as
        required by applicable Ukrainian law.
      </p>

      <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginTop: '2rem', marginBottom: '0.75rem' }}>
        5. Cookies
      </h2>
      <p>The neuronix.work website uses two types of cookies:</p>
      <ul style={{ paddingLeft: '1.5rem', lineHeight: 1.8 }}>
        <li>
          <strong>Technical (session) cookies</strong> — necessary for the proper
          functioning of the website (e.g., storing language preferences). These
          are set automatically without your consent, as they are technically
          required.
        </li>
        <li>
          <strong>Analytics cookies</strong> — collected only with your explicit
          consent (via the Cookie Consent banner), intended to help us understand
          how visitors use the site.
        </li>
      </ul>
      <p style={{ marginTop: '0.75rem' }}>
        You may withdraw your consent to analytics cookies at any time by clearing
        your browser's localStorage or through your browser settings.
      </p>

      <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginTop: '2rem', marginBottom: '0.75rem' }}>
        6. Data Retention
      </h2>
      <p>
        Personal data submitted through the contact form is stored for no longer
        than <strong>1 (one) year</strong> from the date of receipt, or until we
        receive your deletion request — whichever comes first.
      </p>

      <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginTop: '2rem', marginBottom: '0.75rem' }}>
        7. Your Rights
      </h2>
      <p>
        Under the Ukrainian Law on Personal Data Protection, you have the right
        to:
      </p>
      <ul style={{ paddingLeft: '1.5rem', lineHeight: 1.8 }}>
        <li>
          <strong>Access</strong> — obtain information about what personal data we
          process about you.
        </li>
        <li>
          <strong>Rectification</strong> — request correction of inaccurate or
          outdated data.
        </li>
        <li>
          <strong>Erasure ("right to be forgotten")</strong> — request deletion of
          your personal data.
        </li>
        <li>
          <strong>Objection</strong> — object to the processing of your data.
        </li>
        <li>
          <strong>Withdrawal of consent</strong> — revoke previously given consent
          without affecting the lawfulness of processing prior to withdrawal.
        </li>
      </ul>
      <p style={{ marginTop: '0.75rem' }}>
        To exercise any of these rights, please contact us via Telegram:{' '}
        <a href="https://t.me/angordien" style={{ color: 'var(--primary)' }}>
          @angordien
        </a>
        . We will respond to your request within 30 calendar days.
      </p>

      <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginTop: '2rem', marginBottom: '0.75rem' }}>
        8. Data Security
      </h2>
      <p>
        We implement reasonable technical and organizational measures to protect
        your personal data against unauthorized access, disclosure, alteration, or
        destruction. All data transmissions are secured via HTTPS.
      </p>

      <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginTop: '2rem', marginBottom: '0.75rem' }}>
        9. Data Protection Officer (DPO)
      </h2>
      <p>
        For data protection inquiries, please contact:{' '}
        <a href="https://t.me/angordien" style={{ color: 'var(--primary)' }}>
          @angordien (Telegram)
        </a>
      </p>

      <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginTop: '2rem', marginBottom: '0.75rem' }}>
        10. Changes to This Policy
      </h2>
      <p>
        We reserve the right to update this Privacy Policy. The new version
        becomes effective upon publication on the website. We recommend checking
        this page periodically.
      </p>

      <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginTop: '2rem', marginBottom: '0.75rem' }}>
        11. Legal Basis
      </h2>
      <p>
        This Policy is drafted in accordance with the Ukrainian Law on Personal
        Data Protection dated June 1, 2010, No. 2297-VI.
      </p>

      <p style={{ marginTop: '3rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
        FOP Udych Yevhen · neuronix.work · Date: 11.05.2026
      </p>
    </article>
  )
}
