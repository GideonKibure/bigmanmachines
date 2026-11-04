const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const FILE_TYPES = [...IMAGE_TYPES, 'application/pdf']
const MAX_BYTES = 5 * 1024 * 1024

export function validateImage(file) {
  if (!file) return ''
  if (!IMAGE_TYPES.includes(file.type)) return 'Use a JPG, PNG, or WebP image.'
  if (file.size > MAX_BYTES) return 'The file must be 5 MB or smaller.'
  return ''
}

export function validateReceipt(file) {
  if (!file) return ''
  if (!FILE_TYPES.includes(file.type)) return 'Use a JPG, PNG, WebP, or PDF file.'
  if (file.size > MAX_BYTES) return 'The file must be 5 MB or smaller.'
  return ''
}

export function validateQuote(values) {
  const errors = {}
  if (!values.customer_name.trim()) errors.customer_name = 'Enter your name.'
  const digits = values.phone.replace(/\D/g, '')
  if (!values.phone.trim()) errors.phone = 'Enter a phone number.'
  else if (digits.length < 9) errors.phone = 'Enter a valid phone number.'
  if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = 'Enter a valid email, or leave it blank.'
  }
  if (!values.project_title.trim()) errors.project_title = 'Enter a project title.'
  if (!values.fabrication_type) errors.fabrication_type = 'Choose a type of work.'
  if (!values.description.trim()) errors.description = 'Describe the work.'
  if (!values.quantity || Number(values.quantity) <= 0) errors.quantity = 'Enter a quantity of at least 1.'
  return errors
}

export function validateContact(values) {
  const errors = {}
  if (!values.name.trim()) errors.name = 'Enter your name.'
  if (values.phone.replace(/\D/g, '').length < 9) errors.phone = 'Enter a valid phone number.'
  if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = 'Enter a valid email, or leave it blank.'
  }
  if (!values.message.trim()) errors.message = 'Enter a message.'
  return errors
}
