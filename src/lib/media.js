import { supabase } from './supabase'

export function mediaUrl(path) {
  if (!path) return ''
  if (/^https?:\/\//i.test(path)) return path
  if (!supabase) return ''
  return supabase.storage.from('public-assets').getPublicUrl(path).data.publicUrl
}

export async function uploadFile(bucket, file, folder) {
  const client = supabase
  if (!client) {
    throw new Error('Connect Supabase before uploading files.')
  }
  const extension = (file.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '')
  const path = `${folder}/${crypto.randomUUID()}.${extension || 'jpg'}`
  const { error } = await client.storage.from(bucket).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
    contentType: file.type || undefined,
  })
  if (error) throw error
  return path
}

export async function signedUrl(bucket, path) {
  if (!path) return ''
  if (/^https?:\/\//i.test(path)) return path
  if (!supabase) return ''
  const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, 60 * 30)
  if (error) throw error
  return data.signedUrl
}
