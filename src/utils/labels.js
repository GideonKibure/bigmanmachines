export const QUOTE_STATUSES = [
  ['pending', 'Pending'],
  ['under_review', 'Under review'],
  ['quotation_sent', 'Quotation sent'],
  ['accepted', 'Accepted'],
  ['rejected', 'Rejected'],
  ['expired', 'Expired'],
]

export const REQUEST_STATUSES = [
  ['new', 'New'],
  ['in_review', 'In review'],
  ['converted', 'Converted'],
  ['closed', 'Closed'],
]

export const ORDER_STATUSES = [
  ['pending', 'Pending'],
  ['confirmed', 'Confirmed'],
  ['in_production', 'In production'],
  ['ready_for_delivery', 'Ready for delivery'],
  ['delivered', 'Delivered'],
  ['cancelled', 'Cancelled'],
]

export const PROJECT_STATUSES = [
  ['active', 'Active'],
  ['on_hold', 'On hold'],
  ['completed', 'Completed'],
  ['cancelled', 'Cancelled'],
]

export const INCOME_CATEGORIES = [
  ['deposit', 'Customer deposit'],
  ['final_payment', 'Final payment'],
  ['product_sale', 'Product sale'],
  ['other_income', 'Other income'],
]

export const EXPENSE_CATEGORIES = [
  ['material_purchase', 'Material purchase'],
  ['labour', 'Employee labour'],
  ['transportation', 'Transportation'],
  ['electricity', 'Electricity'],
  ['maintenance', 'Equipment maintenance'],
  ['rent', 'Workshop rent'],
  ['other_expense', 'Other expense'],
]

export const PAYMENT_METHODS = [
  ['cash', 'Cash'],
  ['mobile_money', 'Mobile money'],
  ['bank', 'Bank'],
  ['other', 'Other'],
]

export const AVAILABILITY = [
  ['in_stock', 'In stock'],
  ['made_to_order', 'Made to order'],
  ['out_of_stock', 'Out of stock'],
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
