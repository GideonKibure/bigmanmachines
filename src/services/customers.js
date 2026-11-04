import { requireClient } from '../lib/supabase'

function safeSearch(value) {
  return value.replace(/[%_,]/g, '').trim()
}

export async function listCustomers({ search = '', archived = false } = {}) {
  const client = requireClient()
  let query = client.from('customers').select('*').order('full_name')
  query = archived ? query.not('archived_at', 'is', null) : query.is('archived_at', null)
  const term = safeSearch(search)
  if (term) query = query.or(`full_name.ilike.%${term}%,phone.ilike.%${term}%`)
  const { data, error } = await query
  if (error) throw error
  return data
}

export async function getCustomer(id) {
  const client = requireClient()
  const customer = await client.from('customers').select('*').eq('id', id).single()
  if (customer.error) throw customer.error
  const quotes = await client.from('quotations').select('*').eq('customer_id', id).order('created_at', { ascending: false })
  if (quotes.error) throw quotes.error
  const orders = await client.from('orders').select('*').eq('customer_id', id).order('created_at', { ascending: false })
  if (orders.error) throw orders.error
  const payments = await client
    .from('transactions')
    .select('*')
    .eq('customer_id', id)
    .eq('type', 'income')
    .order('transaction_date', { ascending: false })
  if (payments.error) throw payments.error
  const requests = await client.from('quotation_requests').select('*').eq('customer_id', id).order('created_at', { ascending: false })
  if (requests.error) throw requests.error
  return {
    customer: customer.data,
    quotes: quotes.data,
    orders: orders.data,
    payments: payments.data,
    requests: requests.data,
  }
}

export async function saveCustomer(values) {
  const client = requireClient()
  const payload = {
    full_name: values.full_name.trim(),
    phone: values.phone.trim(),
    email: values.email?.trim() || '',
    location: values.location?.trim() || '',
    notes: values.notes?.trim() || '',
  }
  const query = values.id
    ? client.from('customers').update(payload).eq('id', values.id).select().single()
    : client.from('customers').insert(payload).select().single()
  const { data, error } = await query
  if (error) throw error
  return data
}

export async function setCustomerArchived(id, archived) {
  const client = requireClient()
  const { error } = await client
    .from('customers')
    .update({ archived_at: archived ? new Date().toISOString() : null })
    .eq('id', id)
  if (error) throw error
}
