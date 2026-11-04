import { requireClient } from '../lib/supabase'
import { uploadFile } from './files'

export async function listTransactions({ from, to, type } = {}) {
  const client = requireClient()
  let query = client
    .from('transactions')
    .select('*, customers(full_name), orders(order_number), projects(project_number)')
    .order('transaction_date', { ascending: false })
  if (from) query = query.gte('transaction_date', from)
  if (to) query = query.lte('transaction_date', to)
  if (type) query = query.eq('type', type)
  const { data, error } = await query
  if (error) throw error
  return data
}

export async function recordTransaction(values, file) {
  const client = requireClient()
  let receiptPath = values.receipt_path || null
  if (file) {
    receiptPath = await uploadFile(client, 'receipts', file, 'receipts')
  }
  const { data, error } = await client.rpc('record_transaction', {
    p_type: values.type,
    p_category: values.category,
    p_amount: Number(values.amount),
    p_transaction_date: values.transaction_date,
    p_description: values.description || '',
    p_payment_method: values.payment_method || 'cash',
    p_customer: values.customer_id || null,
    p_order: values.order_id || null,
    p_project: values.project_id || null,
    p_receipt: receiptPath,
  })
  if (error) throw error
  return data
}

export async function getDashboard() {
  const client = requireClient()
  const { data, error } = await client.rpc('get_dashboard_summary')
  if (error) throw error
  return data
}

export async function listEmployees() {
  const client = requireClient()
  const { data, error } = await client.from('employees').select('*, profiles(full_name, email)').order('full_name')
  if (error) throw error
  return data
}

export async function listProfiles() {
  const client = requireClient()
  const { data, error } = await client.from('profiles').select('id, full_name, email, role').order('full_name')
  if (error) throw error
  return data
}

export async function saveEmployee(values) {
  const client = requireClient()
  const payload = {
    full_name: values.full_name.trim(),
    phone: values.phone || '',
    job_title: values.job_title || 'Fabricator',
    default_daily_rate: Number(values.default_daily_rate || 0),
    is_active: values.is_active !== false,
    profile_id: values.profile_id || null,
  }
  const query = values.id
    ? client.from('employees').update(payload).eq('id', values.id).select().single()
    : client.from('employees').insert(payload).select().single()
  const { data, error } = await query
  if (error) throw error
  return data
}

export async function reportProjects() {
  const client = requireClient()
  const { data, error } = await client
    .from('projects')
    .select('*, customers(full_name), project_materials(quantity, unit_cost_at_time)')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function reportOrders() {
  const client = requireClient()
  const { data, error } = await client.from('orders').select('*, customers(full_name)').order('created_at', { ascending: false })
  if (error) throw error
  return data
}
