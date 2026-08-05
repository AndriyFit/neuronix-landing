'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslations } from 'next-intl'
import { sendGTMEvent } from '@next/third-parties/google'
import { useScrollReveal } from '@/lib/useScrollReveal'
import './css/AuditForm.css'

interface AuditData {
  url: string
  phone: string
}

export default function AuditForm() {
  const t = useTranslations('audit')
  const ref = useScrollReveal<HTMLElement>()
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AuditData>()

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
      setSubmitted(true)
      reset()
      setTimeout(() => setSubmitted(false), 6000)
    } catch {
      setSubmitError(t('error'))
    }
  }

  return (
    <section id="audit" className="audit" ref={ref}>
      <div className="audit-inner animate-in">
        <h2 className="audit-title">{t('title')}</h2>
        <p className="audit-subtitle">{t('subtitle')}</p>

        {submitted ? (
          <p className="audit-success">{t('success')}</p>
        ) : (
          <form className="audit-form" onSubmit={handleSubmit(onSubmit)} noValidate>
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
          </form>
        )}

        {submitError && <p className="audit-error audit-error-form">{submitError}</p>}
        <p className="audit-note">{t('note')}</p>
      </div>
    </section>
  )
}
