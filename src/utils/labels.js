export const QUOTE_STATUSES = [
  ['pending', 'Inasubiri'],
  ['under_review', 'Inakaguliwa'],
  ['quotation_sent', 'Makadirio yametumwa'],
  ['accepted', 'Imekubaliwa'],
  ['rejected', 'Imekataliwa'],
  ['expired', 'Imeisha muda'],
]

export const REQUEST_STATUSES = [
  ['new', 'Mpya'],
  ['in_review', 'Inakaguliwa'],
  ['converted', 'Imegeuzwa'],
  ['closed', 'Imefungwa'],
]

export const ORDER_STATUSES = [
  ['pending', 'Inasubiri'],
  ['confirmed', 'Imethibitishwa'],
  ['in_production', 'Inatengenezwa'],
  ['ready_for_delivery', 'Tayari kwa utoaji'],
  ['delivered', 'Imetolewa'],
  ['cancelled', 'Imefutwa'],
]

export const PROJECT_STATUSES = [
  ['active', 'Hai'],
  ['on_hold', 'Imesimamishwa'],
  ['completed', 'Imekamilika'],
  ['cancelled', 'Imefutwa'],
]

export const INCOME_CATEGORIES = [
  ['deposit', 'Amana ya mteja'],
  ['final_payment', 'Malipo ya mwisho'],
  ['product_sale', 'Mauzo ya bidhaa'],
  ['other_income', 'Mapato mengine'],
]

export const EXPENSE_CATEGORIES = [
  ['material_purchase', 'Ununuzi wa vifaa'],
  ['labour', 'Mishahara'],
  ['transportation', 'Usafiri'],
  ['electricity', 'Umeme'],
  ['maintenance', 'Matengenezo ya vifaa'],
  ['rent', 'Kodi ya karakana'],
  ['other_expense', 'Matumizi mengine'],
]

export const PAYMENT_METHODS = [
  ['cash', 'Taslimu'],
  ['mobile_money', 'Pesa ya simu'],
  ['bank', 'Benki'],
  ['other', 'Nyingine'],
]

export const STOCK_MOVEMENTS = [
  ['purchase', 'Ununuzi'],
  ['usage', 'Matumizi'],
  ['adjustment', 'Marekebisho'],
  ['allocation', 'Ugawaji'],
  ['return', 'Marejesho'],
]

export const AVAILABILITY = [
  ['in_stock', 'Ipo stoo'],
  ['made_to_order', 'Hutengenezwa kwa oda'],
  ['out_of_stock', 'Haipo stoo'],
]

export function labelOf(list, value) {
  if (!list) return value || '—'
  return list.find(([key]) => key === value)?.[1] || value || '—'
}

const TONE = {
  pending: 'amber',
  under_review: 'blue',
  in_review: 'blue',
  new: 'orange',
  quotation_sent: 'orange',
  accepted: 'green',
  confirmed: 'green',
  converted: 'green',
  completed: 'green',
  delivered: 'green',
  in_production: 'blue',
  ready_for_delivery: 'blue',
  active: 'orange',
  on_hold: 'amber',
  rejected: 'red',
  expired: 'muted',
  closed: 'muted',
  cancelled: 'red',
  in_stock: 'green',
  made_to_order: 'blue',
  out_of_stock: 'red',
  done: 'green',
  in_progress: 'orange',
}

export function statusTone(status) {
  return TONE[status] || 'muted'
}
