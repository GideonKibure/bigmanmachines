const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const FILE_TYPES = [...IMAGE_TYPES, 'application/pdf']
const MAX_BYTES = 5 * 1024 * 1024

export function validateImage(file) {
  if (!file) return ''
  if (!IMAGE_TYPES.includes(file.type)) return 'Tumia picha ya JPG, PNG, au WebP.'
  if (file.size > MAX_BYTES) return 'Faili isiwe zaidi ya MB 5.'
  return ''
}

export function validateReceipt(file) {
  if (!file) return ''
  if (!FILE_TYPES.includes(file.type)) return 'Tumia JPG, PNG, WebP, au PDF.'
  if (file.size > MAX_BYTES) return 'Faili isiwe zaidi ya MB 5.'
  return ''
}

export function validateQuote(values) {
  const errors = {}
  if (!values.customer_name.trim()) errors.customer_name = 'Andika jina lako.'
  const digits = values.phone.replace(/\D/g, '')
  if (!values.phone.trim()) errors.phone = 'Andika nambari ya simu.'
  else if (digits.length < 9) errors.phone = 'Andika nambari sahihi ya simu.'
  if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = 'Andika barua pepe sahihi, au uache wazi.'
  }
  if (!values.project_title.trim()) errors.project_title = 'Andika jina la kazi.'
  if (!values.fabrication_type) errors.fabrication_type = 'Chagua aina ya kazi.'
  if (!values.description.trim()) errors.description = 'Eleza kazi.'
  if (!values.quantity || Number(values.quantity) <= 0) errors.quantity = 'Andika idadi isiyopungua 1.'
  return errors
}

export function validateContact(values) {
  const errors = {}
  if (!values.name.trim()) errors.name = 'Andika jina lako.'
  if (values.phone.replace(/\D/g, '').length < 9) errors.phone = 'Andika nambari sahihi ya simu.'
  if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = 'Andika barua pepe sahihi, au uache wazi.'
  }
  if (!values.message.trim()) errors.message = 'Andika ujumbe.'
  return errors
}
