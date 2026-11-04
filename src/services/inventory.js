import { requireClient } from '../lib/supabase'

export async function listMaterials() {
  const client = requireClient()
  const { data, error } = await client.rpc('list_materials')
  if (error) throw error
  return data
}

export async function listSuppliers() {
  const client = requireClient()
  const { data, error } = await client.from('suppliers').select('*').order('name')
  if (error) throw error
  return data
}

export async function saveSupplier(values) {
  const client = requireClient()
  const payload = { name: values.name.trim(), phone: values.phone || '', email: values.email || '', notes: values.notes || '' }
  const query = values.id
    ? client.from('suppliers').update(payload).eq('id', values.id).select().single()
    : client.from('suppliers').insert(payload).select().single()
  const { data, error } = await query
  if (error) throw error
  return data
}

export async function saveMaterial(values) {
  const client = requireClient()
  const payload = {
    name: values.name.trim(),
    category: values.category.trim() || 'General',
    unit: values.unit.trim() || 'pcs',
    quantity_available: Number(values.quantity_available || 0),
    minimum_stock: Number(values.minimum_stock || 0),
    purchase_price: Number(values.purchase_price || 0),
    supplier_id: values.supplier_id || null,
  }
  if (values.id) {
    const editable = { ...payload }
    delete editable.quantity_available
    const { error } = await client.from('inventory_items').update(editable).eq('id', values.id)
    if (error) throw error
    return values.id
  }
  const { data, error } = await client.from('inventory_items').insert(payload).select().single()
  if (error) throw error
  return data.id
}

export async function moveStock(values) {
  const client = requireClient()
  const { data, error } = await client.rpc('record_stock_movement', {
    p_item: values.itemId,
    p_type: values.type,
    p_quantity: Number(values.quantity),
    p_unit_cost: values.unitCost === '' || values.unitCost === undefined ? 0 : Number(values.unitCost),
    p_supplier: values.supplierId || null,
    p_project: values.projectId || null,
    p_note: values.note || '',
    p_record_expense: Boolean(values.recordExpense),
  })
  if (error) throw error
  return data
}

export async function listMovements(itemId) {
  const client = requireClient()
  let query = client
    .from('inventory_transactions')
    .select('*, inventory_items(name, unit), projects(project_number)')
    .order('created_at', { ascending: false })
    .limit(200)
  if (itemId) query = query.eq('item_id', itemId)
  const { data, error } = await query
  if (error) throw error
  return data
}
