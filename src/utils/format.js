export function num(value) {
  const amount = Number(value ?? 0)
  return Number.isFinite(amount) ? amount : 0
}

export function formatMoney(value, currency = 'TZS') {
  const amount = num(value)
  const hasCents = Math.round(amount * 100) % 100 !== 0
  const formatted = amount.toLocaleString('en-US', {
    minimumFractionDigits: hasCents ? 2 : 0,
    maximumFractionDigits: hasCents ? 2 : 0,
  })
  return `${currency} ${formatted}`
}

export function formatDate(value) {
  if (!value) return '—'
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split('-').map(Number)
    return new Date(year, month - 1, day).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function todayInput() {
  const date = new Date()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}

export function whatsappLink(phone, text) {
  const digits = String(phone || '').replace(/\D/g, '')
  if (!digits) return ''
  const query = text ? `?text=${encodeURIComponent(text)}` : ''
  return `https://wa.me/${digits}${query}`
}

export function errorText(error) {
  if (!error) return 'Something went wrong.'
  if (error.code === '23505') return 'That record already exists.'
  if (error.code === '23503') return 'This record is linked to other data and cannot be removed.'
  const message = error.message || 'Something went wrong.'
  if (message.includes('Not enough stock')) return 'There is not enough of that material in stock.'
  if (message.includes('Not allowed')) return 'You do not have permission to do that.'
  return message
}
