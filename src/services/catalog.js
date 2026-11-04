import { previewProducts, previewProjects, previewServices } from '../data/preview'
import { requireClient, supabase } from '../lib/supabase'

function published(rows, flag, includeHidden) {
  if (includeHidden) return rows
  return rows.filter((row) => row[flag])
}

export async function listServices({ includeHidden = false } = {}) {
  if (!supabase) return published(previewServices, 'is_active', includeHidden)
  let query = supabase.from('services').select('*').order('sort_order')
  if (!includeHidden) query = query.eq('is_active', true)
  const { data, error } = await query
  if (error) throw error
  return data
}

export async function saveService(values) {
  const client = requireClient()
  const payload = {
    name: values.name,
    slug: values.slug,
    category: values.category || 'Custom',
    summary: values.summary || '',
    description: values.description || '',
    image_url: values.image_url || '',
    highlights: values.highlights || [],
    is_featured: Boolean(values.is_featured),
    is_active: values.is_active !== false,
    sort_order: Number(values.sort_order || 0),
  }
  if (values.id) payload.id = values.id
  const { data, error } = await client.from('services').upsert(payload).select().single()
  if (error) throw error
  return data
}

export async function setServiceActive(id, isActive) {
  const client = requireClient()
  const { error } = await client.from('services').update({ is_active: isActive }).eq('id', id)
  if (error) throw error
}

export async function listProducts({ includeHidden = false } = {}) {
  if (!supabase) return published(previewProducts, 'is_active', includeHidden)
  let query = supabase.from('products').select('*').order('name')
  if (!includeHidden) query = query.eq('is_active', true)
  const { data, error } = await query
  if (error) throw error
  return data
}

export async function saveProduct(values) {
  const client = requireClient()
  const payload = {
    name: values.name,
    slug: values.slug,
    description: values.description || '',
    image_url: values.image_url || '',
    price: values.price === '' || values.price === null || values.price === undefined ? null : Number(values.price),
    availability: values.availability || 'made_to_order',
    specifications: values.specifications || {},
    is_featured: Boolean(values.is_featured),
    is_active: values.is_active !== false,
  }
  if (values.id) payload.id = values.id
  const { data, error } = await client.from('products').upsert(payload).select().single()
  if (error) throw error
  return data
}

export async function setProductActive(id, isActive) {
  const client = requireClient()
  const { error } = await client.from('products').update({ is_active: isActive }).eq('id', id)
  if (error) throw error
}

export async function listPortfolio({ includeHidden = false } = {}) {
  if (!supabase) return published(previewProjects, 'is_published', includeHidden)
  let query = supabase
    .from('portfolio_projects')
    .select('*, portfolio_images(image_url, sort_order)')
    .order('completion_date', { ascending: false })
  if (!includeHidden) query = query.eq('is_published', true)
  const { data, error } = await query
  if (error) throw error
  return data.map((project) => ({
    ...project,
    images: project.portfolio_images || [],
  }))
}

export async function savePortfolioProject(values) {
  const client = requireClient()
  const images = values.images || []
  const project = {
    title: values.title,
    category: values.category || 'Custom',
    description: values.description || '',
    completion_date: values.completion_date || null,
    materials: values.materials || '',
    cover_image_url: values.cover_image_url || values.image_url || '',
    is_featured: Boolean(values.is_featured),
    is_published: values.is_published !== false,
  }
  if (values.id) project.id = values.id
  const { data, error } = await client.from('portfolio_projects').upsert(project).select().single()
  if (error) throw error
  if (images.length) {
    await client.from('portfolio_images').delete().eq('portfolio_project_id', data.id)
    const rows = images
      .filter((image) => image.image_url)
      .map((image, index) => ({
        portfolio_project_id: data.id,
        image_url: image.image_url,
        sort_order: index + 1,
      }))
    if (rows.length) {
      const insert = await client.from('portfolio_images').insert(rows)
      if (insert.error) throw insert.error
    }
  }
  return data
}

export async function setPortfolioPublished(id, isPublished) {
  const client = requireClient()
  const { error } = await client.from('portfolio_projects').update({ is_published: isPublished }).eq('id', id)
  if (error) throw error
}

export async function updateSettings(values) {
  const client = requireClient()
  const { error } = await client.from('business_settings').update(values).eq('id', 1)
  if (error) throw error
}
