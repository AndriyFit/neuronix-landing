/**
 * Тонка обгортка над posthog.capture.
 *
 * Навіщо взагалі: autocapture PostHog ловить кліки й перегляди сам, тому дублювати
 * його кастомними cta_clicked/section_scrolled немає сенсу — GA4 до того ж уже шле
 * scroll. Руками трекаємо ЛИШЕ те, чого автоматика не знає: бізнес-воронку форми
 * (почав заповнювати → відправив → впав на валідації) і воронку чат-віджета
 * (chat_opened, chat_message_sent, chat_error, chat_lead_submitted — ChatWidget.tsx).
 *
 * Виклик безпечний, поки PostHog не завантажився або людина відмовилась від куків:
 * window.posthog тоді undefined, опціональний виклик просто нічого не робить.
 *
 * try/catch тут не декоративний. track() стоїть у тому ж блоці, що й sendGTMEvent
 * з конверсією generate_lead: виняток усередині PostHog не має права завадити
 * конверсії дійти до Google Ads. Аналітика падає тихо, гроші — ні.
 */
export function track(event: string, props?: Record<string, unknown>) {
  try {
    window.posthog?.capture?.(event, props)
  } catch {
    // no-op: аналітика не критична, конверсія критична
  }
}
