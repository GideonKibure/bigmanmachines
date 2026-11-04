import { requireClient } from '../lib/supabase'

async function selectProjects(client, columns) {
  const first = await client.from('projects').select(columns).order('created_at', { ascending: false })
  if (!first.error) return first.data
  const fallback = await client
    .from('projects')
    .select('*, customers(full_name, phone)')
    .order('created_at', { ascending: false })
  if (fallback.error) throw fallback.error
  return fallback.data
}

export async function listProjects() {
  const client = requireClient()
  return selectProjects(client, '*, customers(full_name, phone), employees(full_name)')
}

export async function getProject(id) {
  const client = requireClient()
  const project = await client
    .from('projects')
    .select('*, customers(full_name, phone, location), employees(full_name, job_title), project_stages(*), project_images(*)')
    .eq('id', id)
    .single()
  if (project.error) {
    const fallback = await client
      .from('projects')
      .select('*, customers(full_name, phone, location), project_stages(*), project_images(*)')
      .eq('id', id)
      .single()
    if (fallback.error) throw fallback.error
    return { ...fallback.data, employees: null }
  }
  return project.data
}

export async function updateProject(id, values) {
  const client = requireClient()
  const { error } = await client.from('projects').update(values).eq('id', id)
  if (error) throw error
}

export async function setStage(projectId, stageKey, status, notes) {
  const client = requireClient()
  const { error } = await client.rpc('set_project_stage', {
    p_project: projectId,
    p_stage: stageKey,
    p_status: status,
    p_notes: notes ?? null,
  })
  if (error) throw error
}

export async function listProjectMaterials(projectId) {
  const client = requireClient()
  const { data, error } = await client.rpc('list_project_materials', { p_project: projectId })
  if (error) throw error
  return data
}

export async function addProjectImage(projectId, imagePath, caption) {
  const client = requireClient()
  const { error } = await client.from('project_images').insert({
    project_id: projectId,
    image_path: imagePath,
    caption: caption || '',
  })
  if (error) throw error
}
