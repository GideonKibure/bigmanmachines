import { requireClient } from '../lib/supabase'

const orderSelect = '*, customers(full_name, phone, email, location), projects(id, project_number, status, progress_percent), deliveries(*)'

export async function listOrders() {
  const client = requireClient()
  const { data, error } = await client.from('orders').select(orderSelect).order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function getOrder(id) {
  const client = requireClient()
  const order = await client.from('orders').select(orderSelect).eq('id', id).single()
  if (order.error) throw order.error
  const payments = await client.from('transactions').select('*').eq('order_id', id).order('transaction_date', { ascending: false })
  if (payments.error) throw payments.error
  return { ...order.data, payments: payments.data }
}

export async function updateOrder(id, values) {
  const client = requireClient()
  const { error } = await client.from('orders').update(values).eq('id', id)
  if (error) throw error
}

export async function addDelivery(orderId, values) {
  const client = requireClient()
  const { error } = await client.from('deliveries').insert({
    order_id: orderId,
    received_by: values.received_by || '',
    notes: values.notes || '',
  })
  if (error) throw error
}
