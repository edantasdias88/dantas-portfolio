import { useId, useRef, useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { formatBrazilianPhone, isValidBrazilianPhone } from '@/lib/brazilianPhone'
import { Button } from '../Button'
import { FieldOutline } from './FieldOutline'
import { submitContact, type ContactValues } from './submitContact'
import styles from './ContactForm.module.scss'

type Field = 'name' | 'email' | 'phone' | 'message'
type Values = ContactValues
type Errors = Partial<Record<Field, string>>
type Status = 'idle' | 'sending' | 'success' | 'error'

const EMPTY: Values = { name: '', email: '', phone: '', message: '' }
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export function ContactForm({ autoFocus = false, floatingLabels = false }: { autoFocus?: boolean; floatingLabels?: boolean }) {
  const { t } = useTranslation()
  const uid = useId()
  const [values, setValues] = useState<Values>(EMPTY)
  const [errors, setErrors] = useState<Errors>({})
  const [status, setStatus] = useState<Status>('idle')
  const formRef = useRef<HTMLFormElement>(null)
  const submitLock = useRef(false)
  const errorMessages: Record<string, string> = {
    nameRequired: t('contact.errors.nameRequired'),
    nameTooLong: t('contact.errors.nameTooLong'),
    emailRequired: t('contact.errors.emailRequired'),
    emailInvalid: t('contact.errors.emailInvalid'),
    phoneRequired: t('contact.errors.phoneRequired'),
    phoneInvalid: t('contact.errors.phoneInvalid'),
    messageRequired: t('contact.errors.messageRequired'),
    messageTooLong: t('contact.errors.messageTooLong'),

  }

  const validate = (v: Values): Errors => {
    const next: Errors = {}
    if (!v.name.trim()) next.name = 'nameRequired'
    else if (v.name.trim().length > 120) next.name = 'nameTooLong'
    if (!v.email.trim()) next.email = 'emailRequired'
    else if (!EMAIL_RE.test(v.email.trim())) next.email = 'emailInvalid'
    if (!v.phone.trim()) next.phone = 'phoneRequired'
    else if (!isValidBrazilianPhone(v.phone)) next.phone = 'phoneInvalid'
    if (!v.message.trim()) next.message = 'messageRequired'
    else if (v.message.trim().length > 5000) next.message = 'messageTooLong'
    return next
  }

  const update = (field: Field, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
    if (status === 'error' || status === 'success') setStatus('idle')
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
    const firstInvalid = (Object.keys(found) as Field[])[0]
    if (firstInvalid) {
      formRef.current?.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus()
      return
    }

    submitLock.current = true
    setStatus('sending')
    try {
      await submitContact(values)
      setValues(EMPTY)
      setErrors({})
      setStatus('success')
    } catch {
      setStatus('error')
    } finally {
      submitLock.current = false
    }
  }

  const fieldId = (f: Field) => `${uid}-${f}`
  const errorId = (f: Field) => `${uid}-${f}-error`
  const describedBy = (f: Field) => (errors[f] ? errorId(f) : undefined)

  return (
    <form ref={formRef} className={floatingLabels ? `${styles.form} ${styles.floating}` : styles.form} onSubmit={onSubmit} noValidate aria-busy={status === 'sending'}>
      <fieldset className={styles.fieldset} disabled={status === 'sending'}>
        <legend className="visually-hidden">{t('contact.title')}</legend>

        <div className={styles.field} data-invalid={Boolean(errors.name)}>
          <div className={styles.control} data-filled={Boolean(values.name)}>
            {floatingLabels && <FieldOutline />}
            <label htmlFor={fieldId('name')}>
              {t('contact.form.name')}
            </label>
            <input
              id={fieldId('name')}
              name="name"
              autoComplete="name"
              maxLength={120}
              placeholder={floatingLabels ? ' ' : t('contact.form.namePlaceholder')}
              value={values.name}
              onChange={(e) => update('name', e.target.value)}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={describedBy('name')}
              required
              data-autofocus={autoFocus || undefined}
            />
          </div>
          {errors.name && <p id={errorId('name')} className={styles.error}>{errorMessages[errors.name]}</p>}
        </div>

        <div className={styles.row}>
          <div className={styles.field} data-invalid={Boolean(errors.email)}>
            <div className={styles.control} data-filled={Boolean(values.email)}>
              {floatingLabels && <FieldOutline />}
              <label htmlFor={fieldId('email')}>
                {t('contact.form.email')}
              </label>
              <input
                id={fieldId('email')}
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                maxLength={254}
                placeholder={floatingLabels ? ' ' : t('contact.form.emailPlaceholder')}
                value={values.email}
                onChange={(e) => update('email', e.target.value)}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={describedBy('email')}
                required
              />
            </div>
            {errors.email && <p id={errorId('email')} className={styles.error}>{errorMessages[errors.email]}</p>}
          </div>

          <div className={styles.field} data-invalid={Boolean(errors.phone)}>
            <div className={styles.control} data-filled={Boolean(values.phone)}>
              {floatingLabels && <FieldOutline />}
              <label htmlFor={fieldId('phone')}>
                {t('contact.form.phone')}
              </label>
              <input
                id={fieldId('phone')}
                name="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                maxLength={19}
                placeholder={floatingLabels ? ' ' : t('contact.form.phonePlaceholder')}
                value={values.phone}
                onChange={(e) => updatePhone(e.currentTarget)}
                aria-invalid={Boolean(errors.phone)}
                aria-describedby={describedBy('phone')}
                required
              />
            </div>
            {errors.phone && <p id={errorId('phone')} className={styles.error}>{errorMessages[errors.phone]}</p>}
          </div>
        </div>

        <div className={styles.field} data-invalid={Boolean(errors.message)}>
            <div className={styles.control} data-filled={Boolean(values.message)}>
              {floatingLabels && <FieldOutline />}
            <label htmlFor={fieldId('message')}>
              {t('contact.form.message')}
            </label>
            <textarea
              id={fieldId('message')}
              name="message"
              rows={5}
              maxLength={5000}
              placeholder={floatingLabels ? ' ' : t('contact.form.messagePlaceholder')}
              value={values.message}
              onChange={(e) => update('message', e.target.value)}
              aria-invalid={Boolean(errors.message)}
              aria-describedby={describedBy('message')}
              required
            />
            </div>
            {errors.message && <p id={errorId('message')} className={styles.error}>{errorMessages[errors.message]}</p>}
        </div>
      </fieldset>

      <div aria-live="assertive" className={styles.live}>
        {status === 'error' && <p className={styles.error}>{t('contact.errors.sendFailed')}</p>}
      </div>

      <div role="status" aria-live="polite" className={styles.live}>
        {status === 'sending' && <span className="visually-hidden">{t('contact.form.sending')}</span>}
        {status === 'success' && <p>{t('contact.success.message')}</p>}
      </div>

      <Button type="submit" size="lg" arrow disabled={status === 'sending'}>
        <span className={styles.submitLabel}>
          {status === 'sending' && <span className={styles.spinner} aria-hidden="true" />}
          {status === 'sending' ? t('contact.form.sending') : t('contact.form.submit')}
        </span>
      </Button>
    </form>
  )
}
