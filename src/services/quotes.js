import { uploadFile } from './files'
import { requireClient } from '../lib/supabase'
import { validateImage } from '../utils/validators'

export async function submitQuote(values, file) {
  const client = requireClient()
  let imagePath = ''
  if (file) {
    const problem = validateImage(file)
    if (problem) throw new Error(problem)
    imagePath = await uploadFile(client, 'quote-uploads', file, 'requests')
  }
  const { data, error } = await client.rpc('submit_quotation_request', {
    payload: {
      ...values,
      quantity: Number(values.quantity),
      image_path: imagePath,
    },
  })
  if (error) throw error
  return data
}

export async function listRequests() {
  const client = requireClient()
  const { data, error } = await client
    .from('quotation_requests')
    .select('*, customers(full_name)')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function getRequest(id) {
  const client = requireClient()
  const { data, error } = await client.from('quotation_requests').select('*').eq('id', id).single()
  if (error) throw error
  return data
}

export async function updateRequest(id, values) {
  const client = requireClient()
  const { error } = await client.from('quotation_requests').update(values).eq('id', id)
  if (error) throw error
}

export async function listQuotations() {
  const client = requireClient()
  const { data, error } = await client
    .from('quotations')
    .select('*, customers(full_name, phone)')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function getQuotation(id) {
  const client = requireClient()
  const { data, error } = await client
    .from('quotations')
    .select('*, customers(*), quotation_items(*), quotation_requests(*)')
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

export async function saveQuotation(payload) {
  const client = requireClient()
  const { data, error } = await client.rpc('save_quotation', { payload })
  if (error) throw error
  return data
}

export async function updateQuotationStatus(id, status) {
  const client = requireClient()
  const { error } = await client.from('quotations').update({ status }).eq('id', id)
  if (error) throw error
}

export async function convertQuotation(id, expectedDate) {
  const client = requireClient()
  const { data, error } = await client.rpc('convert_quotation_to_order', {
    p_quotation_id: id,
    p_expected_completion: expectedDate || null,
  })
  if (error) throw error
  return data
}

export async function submitContact(values) {
  const client = requireClient()
  const { data, error } = await client.rpc('submit_contact_message', { payload: values })
  if (error) throw error
  return data
}

export async function listMessages() {
  const client = requireClient()
  const { data, error } = await client.from('contact_messages').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return data
}
