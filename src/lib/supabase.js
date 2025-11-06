import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

/**
 * Upload a CSV file to Supabase Storage
 * @param {File} file - The file to upload
 * @param {string} userId - The user's ID
 * @returns {Promise<string>} The storage path
 */
export async function uploadCSV(file, userId) {
  const timestamp = Date.now()
  const filePath = `${userId}/${timestamp}-${file.name}`
  
  const { data, error } = await supabase.storage
    .from('datasets')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    })

  if (error) throw error
  return data.path
}

/**
 * Get a public URL for a storage object
 * @param {string} path - The storage path
 * @returns {string} Public URL
 */
export function getStorageURL(path) {
  const { data } = supabase.storage
    .from('datasets')
    .getPublicUrl(path)
  
  return data.publicUrl
}

/**
 * Download CSV content from storage
 * @param {string} path - The storage path
 * @returns {Promise<string>} CSV content
 */
export async function downloadCSV(path) {
  const { data, error } = await supabase.storage
    .from('datasets')
    .download(path)

  if (error) throw error
  return await data.text()
}
