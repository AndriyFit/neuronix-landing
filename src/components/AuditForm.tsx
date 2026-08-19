'use client'
import { useRef, useState } from 'react'
import { track } from '@/lib/analytics'
import { useForm } from 'react-hook-form'
import { useLocale, useTranslations } from 'next-intl'
import Link from 'next/link'
import { sendGTMEvent } from '@next/third-parties/google'
import { useScrollReveal } from '@/lib/useScrollReveal'
import './css/AuditForm.css'

interface AuditData {
  url: string
  phone: string
}

export default function AuditForm() {
  const t = useTranslations('audit')
  const locale = useLocale()
  const ref = useScrollReveal<HTMLElement>()
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AuditData>()

  // Перше торкання форми — сигнал наміру; autocapture цього не розрізняє.
  const startedRef = useRef(false)

  const onSubmit = async (data: AuditData) => {
    setSubmitError(null)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, source: 'audit' }),
      })
      if (!res.ok) throw new Error('Server error')
      sendGTMEvent({ event: 'generate_lead', form_type: 'audit' })
      track('form_submitted', { form_id: 'audit', lead_type: 'audit' })
      setSubmitted(true)
      reset()
      setTimeout(() => setSubmitted(false), 6000)
    } catch {
      track('form_error', { form_id: 'audit', error_type: 'server' })
      setSubmitError(t('error'))
    }
  }

  return (
    <section id="audit" className="audit" ref={ref}>
      <div className="audit-inner animate-in fx-beam">
        <h2 className="audit-title">{t('title')}</h2>
        <p className="audit-subtitle">{t('subtitle')}</p>

        {submitted ? (
          <p className="audit-success">{t('success')}</p>
        ) : (
          <form
          className="audit-form"
          onSubmit={handleSubmit(onSubmit, (errs) =>
            track('form_error', {
              form_id: 'audit',
              error_type: 'validation',
              error_field: Object.keys(errs)[0] ?? null,
            })
          )}
          onFocusCapture={() => {
            if (startedRef.current) return
            startedRef.current = true
            track('form_started', { form_id: 'audit' })
          }}
          noValidate
        >
            <div className="audit-field">
              <input
                type="url"
                inputMode="url"
                placeholder={t('urlPlaceholder')}
                aria-label={t('urlPlaceholder')}
                {...register('url', { required: t('errorUrl') })}
              />
              {errors.url && <span className="audit-error">{errors.url.message}</span>}
            </div>

            <div className="audit-field">
              <input
                type="text"
                placeholder={t('contactPlaceholder')}
                aria-label={t('contactPlaceholder')}
                {...register('phone', { required: t('errorContact') })}
              />
              {errors.phone && <span className="audit-error">{errors.phone.message}</span>}
            </div>

            <button type="submit" className="audit-submit" disabled={isSubmitting}>
              {isSubmitting ? t('submitting') : t('submit')}
            </button>

            <p className="form-consent">
              {t('consent')}{' '}
              <Link href={`/${locale}/privacy-policy`}>{t('consentLink')}</Link>
            </p>
          </form>
        )}

        {submitError && <p className="audit-error audit-error-form">{submitError}</p>}
        <p className="audit-note">{t('note')}</p>
      </div>
    </section>
  )
}
