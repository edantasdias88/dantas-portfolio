export interface ContactValues {
  name: string
  email: string
  phone: string
  message: string
}

// Public form identifier, not a private credential. Works without a server on GitHub Pages.
export const CONTACT_ENDPOINT = 'https://formspree.io/f/xzerrokj'

export async function submitContact(values: ContactValues): Promise<void> {
  const response = await fetch(CONTACT_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      name: values.name.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
      message: values.message.trim(),
    }),
  })

  // Formspree confirms acceptance with a successful HTTP status.
  // Network errors reject fetch; HTTP errors must also reject without clearing the form.
  if (!response.ok) throw new Error('contact-submission-failed')
}
