import { useId, useRef, useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { site } from '@/data/site'
import { Button } from '../Button'
import styles from './ContactForm.module.scss'

type Field = 'name' | 'email' | 'company' | 'type' | 'message'
type Values = Record<Field, string>
type Errors = Partial<Record<Field, string>>
type Status = 'idle' | 'sending' | 'success' | 'error'

const PROJECT_TYPES = ['product', 'website', 'brand', 'audit', 'designSystem', 'other'] as const
const EMPTY: Values = { name: '', email: '', company: '', type: 'product', message: '' }
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export function ContactForm({ autoFocus = false }: { autoFocus?: boolean }) {
  const { t } = useTranslation()
  const uid = useId()
  const [values, setValues] = useState<Values>(EMPTY)
  const [errors, setErrors] = useState<Errors>({})
  const [status, setStatus] = useState<Status>('idle')
  const [submitError, setSubmitError] = useState('')
  const formRef = useRef<HTMLFormElement>(null)
  const configured = Boolean(site.contactEndpoint)

  const validate = (v: Values): Errors => {
    const next: Errors = {}
    if (!v.name.trim()) next.name = t('contact.errors.nameRequired')
    if (!v.email.trim()) next.email = t('contact.errors.emailRequired')
    else if (!EMAIL_RE.test(v.email.trim())) next.email = t('contact.errors.emailInvalid')
    if (!v.message.trim()) next.message = t('contact.errors.messageRequired')
    else if (v.message.trim().length < 20) next.message = t('contact.errors.messageShort')
    return next
  }

  const update = (field: Field, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (!configured) return
    const found = validate(values)
    setErrors(found)
    setSubmitError('')
    const firstInvalid = (Object.keys(found) as Field[])[0]
    if (firstInvalid) {
      formRef.current?.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus()
      return
    }
    setStatus('sending')
    try {
      const response = await fetch(site.contactEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          ...values,
          type: t(`contact.form.types.${values.type as (typeof PROJECT_TYPES)[number]}`),
        }),
      })
      if (!response.ok) throw new Error('server')
      setStatus('success')
      setValues(EMPTY)
    } catch (error) {
      setStatus('error')
      setSubmitError(
        error instanceof Error && error.message === 'server' ? t('contact.errors.server') : t('contact.errors.network'),
      )
    }
  }

  if (status === 'success') {
    return (
      <div className={styles.success} role="status" aria-live="polite">
        <p className={styles.successTitle}>{t('contact.success.title')}</p>
        <p className={styles.successText}>{t('contact.success.description')}</p>
        <Button variant="secondary" onClick={() => setStatus('idle')}>
          {t('contact.success.again')}
        </Button>
      </div>
    )
  }

  const fieldId = (f: Field) => `${uid}-${f}`
  const errorId = (f: Field) => `${uid}-${f}-error`
  const describedBy = (f: Field) => (errors[f] ? errorId(f) : undefined)
  const hasErrors = Object.values(errors).some(Boolean)

  return (
    <form ref={formRef} className={styles.form} onSubmit={onSubmit} noValidate aria-busy={status === 'sending'}>
      {!configured && (
        <p className={styles.notice} role="note">
          {t('contact.notConfigured')}
        </p>
      )}

      <fieldset className={styles.fieldset} disabled={!configured || status === 'sending'}>
        <legend className="visually-hidden">{t('contact.title')}</legend>

        <div className={styles.row}>
          <div className={styles.field} data-invalid={Boolean(errors.name)}>
            <label htmlFor={fieldId('name')}>
              {t('contact.form.name')} <span className={styles.req}>({t('contact.form.required')})</span>
            </label>
            <input
              id={fieldId('name')}
              name="name"
              autoComplete="name"
              placeholder={t('contact.form.namePlaceholder')}
              value={values.name}
              onChange={(e) => update('name', e.target.value)}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={describedBy('name')}
              required
              data-autofocus={autoFocus || undefined}
            />
            {errors.name && <p id={errorId('name')} className={styles.error}>{errors.name}</p>}
          </div>

          <div className={styles.field} data-invalid={Boolean(errors.email)}>
            <label htmlFor={fieldId('email')}>
              {t('contact.form.email')} <span className={styles.req}>({t('contact.form.required')})</span>
            </label>
            <input
              id={fieldId('email')}
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder={t('contact.form.emailPlaceholder')}
              value={values.email}
              onChange={(e) => update('email', e.target.value)}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={describedBy('email')}
              required
            />
            {errors.email && <p id={errorId('email')} className={styles.error}>{errors.email}</p>}
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label htmlFor={fieldId('company')}>{t('contact.form.company')}</label>
            <input
              id={fieldId('company')}
              name="company"
              autoComplete="organization"
              placeholder={t('contact.form.companyPlaceholder')}
              value={values.company}
              onChange={(e) => update('company', e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label htmlFor={fieldId('type')}>{t('contact.form.type')}</label>
            <select id={fieldId('type')} name="type" value={values.type} onChange={(e) => update('type', e.target.value)}>
              {PROJECT_TYPES.map((type) => (
                <option key={type} value={type}>
                  {t(`contact.form.types.${type}`)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.field} data-invalid={Boolean(errors.message)}>
          <label htmlFor={fieldId('message')}>
            {t('contact.form.message')} <span className={styles.req}>({t('contact.form.required')})</span>
          </label>
          <textarea
            id={fieldId('message')}
            name="message"
            rows={5}
            placeholder={t('contact.form.messagePlaceholder')}
            value={values.message}
            onChange={(e) => update('message', e.target.value)}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={describedBy('message')}
            required
          />
          {errors.message && <p id={errorId('message')} className={styles.error}>{errors.message}</p>}
        </div>
      </fieldset>

      <div aria-live="assertive" className={styles.live}>
        {hasErrors && <p className={styles.error}>{t('contact.errors.summary')}</p>}
        {status === 'error' && <p className={styles.error}>{submitError}</p>}
      </div>

      <Button type="submit" size="lg" arrow disabled={!configured || status === 'sending'}>
        {status === 'sending' ? t('contact.form.sending') : t('contact.form.submit')}
      </Button>
    </form>
  )
}
