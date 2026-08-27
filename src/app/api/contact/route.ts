import { NextRequest, NextResponse } from 'next/server'
import { saveLead } from '@/lib/leads'
import { sendEmail, sendTelegram } from '@/lib/lead-notify'

export async function POST(req: NextRequest) {
  try {
    const { name, phone, message, url, source } = await req.json()
    const isAudit = source === 'audit'

    // Audit requests come from a 2-field form: site URL + a way to reach back.
    if (!phone || (isAudit ? !url : !name)) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const subject = isAudit
      ? '🔍 Запит на аудит з neuronics.work'
      : '🔔 Нова заявка з neuronics.work'

    const text = [
      subject,
      '',
      url ? `🌐 Сайт: ${url}` : null,
      name ? `👤 Ім'я: ${name}` : null,
      `📞 Контакт: ${phone}`,
      message ? `💬 Повідомлення: ${message}` : null,
    ]
      .filter(Boolean)
      .join('\n')

    // Storage runs alongside delivery but is excluded from `delivered` on purpose:
    // a lead that got stored while nobody was notified is still a failed lead.
    const [tgRes, mailRes] = await Promise.allSettled([
      sendTelegram(text),
      sendEmail(subject, text),
      saveLead({
        source: isAudit ? 'audit' : 'form',
        name,
        contact: phone,
        message,
        siteUrl: url,
      }),
    ])
    const delivered = [tgRes, mailRes].some((r) => r.status === 'fulfilled' && r.value)

    if (!delivered) {
      console.error('Lead delivery failed on every channel:', [tgRes, mailRes])
      return NextResponse.json({ error: 'Delivery failed' }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('Contact route error:', e)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
