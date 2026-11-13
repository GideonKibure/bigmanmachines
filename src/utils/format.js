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
    return new Date(year, month - 1, day).toLocaleDateString('sw-TZ', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleDateString('sw-TZ', {
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
  if (!error) return 'Kuna hitilafu.'
  if (error.code === '23505') return 'Rekodi hiyo ipo tayari.'
  if (error.code === '23503') return 'Rekodi hii imeunganishwa na data nyingine na haiwezi kufutwa.'
  const message = error.message || 'Kuna hitilafu.'
  if (message.includes('Not enough stock')) return 'Vifaa hivyo havitoshi stoo.'
  if (message.includes('Not allowed')) return 'Huna ruhusa ya kufanya hivyo.'
  if (message.includes('Quotation not found')) return 'Makadirio hayakupatikana.'
  if (message.includes('Accept the quotation')) return 'Kubali makadirio kabla ya kutengeneza oda.'
  if (message.includes('already has an order')) return 'Makadirio haya tayari yana oda.'
  if (message.includes('Invalid login credentials')) return 'Barua pepe au nenosiri si sahihi.'
  if (message.includes('Email not confirmed')) return 'Barua pepe haijathibitishwa.'
  if (message.includes("Could not find the 'english' column")) {
    return 'Endesha faili ya SQL 004_bilingual.sql kwenye Supabase, kisha hifadhi tena.'
  }
  if (message.includes('tiktok') || message.includes('social_visible')) {
    return 'Endesha faili ya SQL 005_socials.sql kwenye Supabase, kisha hifadhi tena.'
  }
  if (message.includes('Connect Supabase before uploading')) return 'Unganisha Supabase kabla ya kupakia picha.'
  return message
}
