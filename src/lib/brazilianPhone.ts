export function formatBrazilianPhone(value: string) {
  let digits = value.replace(/\D/g, '')
  if (digits.length > 11 && digits.startsWith('55')) digits = digits.slice(2)
  digits = digits.slice(0, 11)
  if (!digits) return ''

  const ddd = digits.slice(0, 2)
  if (digits.length <= 2) return `(${ddd}`

  const local = digits.slice(2)
  const splitAt = digits.length > 10 ? 5 : 4
  const first = local.slice(0, splitAt)
  const rest = local.slice(splitAt)
  return `(${ddd}) ${first}${rest ? `-${rest}` : ''}`
}

export function isValidBrazilianPhone(value: string) {
  let digits = value.replace(/\D/g, '')
  if ((digits.length === 12 || digits.length === 13) && digits.startsWith('55')) digits = digits.slice(2)
  return /^(?:[1-9][1-9])(?:[2-5]\d{7}|9\d{8})$/.test(digits)
}
