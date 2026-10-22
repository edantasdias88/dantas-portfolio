import { useId, useRef, useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { site } from '@/data/site'
import { formatBrazilianPhone, isValidBrazilianPhone } from '@/lib/brazilianPhone'
import { Button } from '../Button'
import styles from './ContactForm.module.scss'

type Field = 'name' | 'email' | 'phone' | 'company' | 'message'
type Values = Record<Field, string>
type Errors = Partial<Record<Field, string>>
type Status = 'idle' | 'sending' | 'success' | 'error'

const EMPTY: Values = { name: '', email: '', phone: '', company: '', message: '' }
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

export function ContactForm({ autoFocus = false }: { autoFocus?: boolean }) {
  const { t } = useTranslation()
  const uid = useId()
  const [values, setValues] = useState<Values>(EMPTY)
  const [errors, setErrors] = useState<Errors>({})
  const [status, setStatus] = useState<Status>('idle')
  const [submitError, setSubmitError] = useState('')
  const formRef = useRef<HTMLFormElement>(null)
  const submitLock = useRef(false)
  const contactEndpoint = site.contactEndpoint.trim()
  const configured = contactEndpoint.length > 0
  const errorMessages: Record<string, string> = {
    nameRequired: t('contact.errors.nameRequired'),
    nameTooLong: t('contact.errors.nameTooLong'),
    emailRequired: t('contact.errors.emailRequired'),
    emailInvalid: t('contact.errors.emailInvalid'),
    phoneRequired: t('contact.errors.phoneRequired'),
    phoneInvalid: t('contact.errors.phoneInvalid'),
    companyTooLong: t('contact.errors.companyTooLong'),
    messageRequired: t('contact.errors.messageRequired'),
    messageTooLong: t('contact.errors.messageTooLong'),
    serverValidation: t('contact.errors.serverValidation'),
    rateLimited: t('contact.errors.rateLimited'),
    notConfigured: t('contact.errors.notConfigured'),
    server: t('contact.errors.server'),
    network: t('contact.errors.network'),
  }

  const validate = (v: Values): Errors => {
    const next: Errors = {}
    if (!v.name.trim()) next.name = 'nameRequired'
    if (!v.email.trim()) next.email = 'emailRequired'
    else if (!EMAIL_RE.test(v.email.trim())) next.email = 'emailInvalid'
    if (!v.phone.trim()) next.phone = 'phoneRequired'
    else if (!isValidBrazilianPhone(v.phone)) next.phone = 'phoneInvalid'
    if (!v.message.trim()) next.message = 'messageRequired'
    return next
  }

  const update = (field: Field, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
    if (submitError) {
      setSubmitError('')
      setStatus('idle')
    }
  }

  const updatePhone = (input: HTMLInputElement) => {
    const caret = input.selectionStart ?? input.value.length
    const digitsBeforeCaret = input.value.slice(0, caret).replace(/\D/g, '').length
    const formatted = formatBrazilianPhone(input.value)
    update('phone', formatted)
    window.requestAnimationFrame(() => {
      const digitCount = Math.min(digitsBeforeCaret, formatted.replace(/\D/g, '').length)
      let seen = 0
      let nextCaret = formatted.length
      for (let index = 0; index < formatted.length; index += 1) {
        if (/\d/.test(formatted[index])) seen += 1
        if (seen >= digitCount && digitCount > 0) {
          nextCaret = index + 1
          while (nextCaret < formatted.length && /[^\d]/.test(formatted[nextCaret])) nextCaret += 1
          break
        }
      }
      input.setSelectionRange(nextCaret, nextCaret)
    })
  }

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (submitLock.current) return

    const found = validate(values)
    setErrors(found)
    setSubmitError('')
    const firstInvalid = (Object.keys(found) as Field[])[0]
    if (firstInvalid) {
      formRef.current?.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus()
      return
    }

    if (!configured) {
      setStatus('error')
      setSubmitError('notConfigured')
      return
    }

    submitLock.current = true
    setStatus('sending')
    try {
      const response = await fetch(contactEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name: values.name.trim(),
          email: values.email.trim(),
          phone: values.phone.trim(),
          company: values.company.trim(),
          message: values.message.trim(),
        }),
      })

      let payload: unknown
      try {
        payload = await response.json()
      } catch {
        throw new Error('invalid-response')
      }

      if (response.ok && isRecord(payload) && payload.ok === true) {
        setStatus('success')
        setValues(EMPTY)
        setErrors({})
        return
      }

      if (response.status === 422 && isRecord(payload) && isRecord(payload.fields)) {
        const serverErrors: Errors = {}
        for (const field of ['name', 'email', 'phone', 'company', 'message'] as const) {
          const code = payload.fields[field]
          if (typeof code === 'string' && errorMessages[code]) serverErrors[field] = code
        }
        setErrors(serverErrors)
        throw new Error('validation')
      }

      if (response.status === 429) throw new Error('rate-limited')
      if (response.status >= 500 || !response.ok) throw new Error('server')
      throw new Error('invalid-response')
    } catch (error) {
      setStatus('error')
      const code = error instanceof Error ? error.message : 'network'
      setSubmitError(
        code === 'validation'
          ? 'serverValidation'
          : code === 'rate-limited'
            ? 'rateLimited'
            : code === 'server' || code === 'invalid-response'
              ? 'server'
              : 'network',
      )
    } finally {
      submitLock.current = false
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

      <fieldset className={styles.fieldset} disabled={status === 'sending'}>
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
              maxLength={120}
              placeholder={t('contact.form.namePlaceholder')}
              value={values.name}
              onChange={(e) => update('name', e.target.value)}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={describedBy('name')}
              required
              data-autofocus={autoFocus || undefined}
            />
            {errors.name && <p id={errorId('name')} className={styles.error}>{errorMessages[errors.name]}</p>}
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
              maxLength={254}
              placeholder={t('contact.form.emailPlaceholder')}
              value={values.email}
              onChange={(e) => update('email', e.target.value)}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={describedBy('email')}
              required
            />
            {errors.email && <p id={errorId('email')} className={styles.error}>{errorMessages[errors.email]}</p>}
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.field} data-invalid={Boolean(errors.phone)}>
            <label htmlFor={fieldId('phone')}>
              {t('contact.form.phone')} <span className={styles.req}>({t('contact.form.required')})</span>
            </label>
            <input
              id={fieldId('phone')}
              name="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              maxLength={19}
              placeholder={t('contact.form.phonePlaceholder')}
              value={values.phone}
              onChange={(e) => updatePhone(e.currentTarget)}
              aria-invalid={Boolean(errors.phone)}
              aria-describedby={describedBy('phone')}
              required
            />
            {errors.phone && <p id={errorId('phone')} className={styles.error}>{errorMessages[errors.phone]}</p>}
          </div>

          <div className={styles.field} data-invalid={Boolean(errors.company)}>
            <label htmlFor={fieldId('company')}>{t('contact.form.company')}</label>
            <input
              id={fieldId('company')}
              name="company"
              autoComplete="organization"
              maxLength={120}
              placeholder={t('contact.form.companyPlaceholder')}
              value={values.company}
              onChange={(e) => update('company', e.target.value)}
              aria-invalid={Boolean(errors.company)}
              aria-describedby={describedBy('company')}
            />
            {errors.company && <p id={errorId('company')} className={styles.error}>{errorMessages[errors.company]}</p>}
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
            maxLength={5000}
            placeholder={t('contact.form.messagePlaceholder')}
            value={values.message}
            onChange={(e) => update('message', e.target.value)}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={describedBy('message')}
            required
          />
          {errors.message && <p id={errorId('message')} className={styles.error}>{errorMessages[errors.message]}</p>}
        </div>
      </fieldset>

      <div aria-live="assertive" className={styles.live}>
        {hasErrors && <p className={styles.error}>{t('contact.errors.summary')}</p>}
        {status === 'error' && <p className={styles.error}>{errorMessages[submitError]}</p>}
      </div>

      <Button type="submit" size="lg" arrow disabled={status === 'sending'}>
        {status === 'sending' ? t('contact.form.sending') : t('contact.form.submit')}
      </Button>
    </form>
  )
}
