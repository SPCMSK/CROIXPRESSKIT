import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface PresskitConfig {
  id: string
  hero_data: {
    title: string
    subtitle: string
    description1: string
    description2: string
    background_image: string
  }
  bio_data: {
    title: string
    image: string
    paragraph1: string
    paragraph2: string
    paragraph3: string
    paragraph4: string
  }
  social_links: Array<{
    platform: string
    url: string
    icon?: string
  }>
  videos: Array<{
    id: string
    title: string
    embedUrl: string
    description?: string
  }>
  gallery_photos: Array<{
    id: string
    src: string
    alt: string
    featured: boolean
    category: 'dj' | 'studio' | 'press' | 'colabs' | 'releases'
  }>
  theme_colors: {
    primary: string
    secondary: string
    background: string
    foreground: string
  }
  created_at: string
  updated_at: string
}

export interface UploadedImage {
  id: string
  filename: string
  url: string
  category: string
  alt_text: string
  created_at: string
}

// Storage buckets
export const STORAGE_BUCKETS = {
  IMAGES: 'presskit-images',
  VIDEOS: 'presskit-videos',
  ASSETS: 'presskit-assets'
}

// Database functions
export const presskitService = {
  // Get current configuration
  async getConfig(): Promise<PresskitConfig | null> {
    const { data, error } = await supabase
      .from('presskit_config')
      .select('*')
      .single()
    
    if (error) {
      console.error('Error fetching config:', error)
      return null
    }
    
    return data
  },

  // Update configuration
  async updateConfig(config: Partial<PresskitConfig>): Promise<boolean> {
    const { error } = await supabase
      .from('presskit_config')
      .upsert({
        id: 'main',
        ...config,
        updated_at: new Date().toISOString()
      })
    
    if (error) {
      console.error('Error updating config:', error)
      return false
    }
    
    return true
  },

  // Upload image to storage
  async uploadImage(file: File, category: string): Promise<UploadedImage | null> {
    const filename = `${category}/${Date.now()}-${file.name}`
    
    const { error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKETS.IMAGES)
      .upload(filename, file)
    
    if (uploadError) {
      console.error('Error uploading image:', uploadError)
      return null
    }
    
    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(STORAGE_BUCKETS.IMAGES)
      .getPublicUrl(filename)
    
    // Save to database
    const imageData = {
      id: crypto.randomUUID(),
      filename,
      url: publicUrl,
      category,
      alt_text: file.name.replace(/\.[^/.]+$/, ""),
      created_at: new Date().toISOString()
    }
    
    const { error: dbError } = await supabase
      .from('uploaded_images')
      .insert(imageData)
    
    if (dbError) {
      console.error('Error saving image to database:', dbError)
      return null
    }
    
    return imageData
  },

  // Get all uploaded images
  async getImages(category?: string): Promise<UploadedImage[]> {
    let query = supabase
      .from('uploaded_images')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (category) {
      query = query.eq('category', category)
    }
    
    const { data, error } = await query
    
    if (error) {
      console.error('Error fetching images:', error)
      return []
    }
    
    return data || []
  },

  // Delete image
  async deleteImage(imageId: string): Promise<boolean> {
    // Get image data first
    const { data: image } = await supabase
      .from('uploaded_images')
      .select('filename')
      .eq('id', imageId)
      .single()
    
    if (!image) return false
    
    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from(STORAGE_BUCKETS.IMAGES)
      .remove([image.filename])
    
    if (storageError) {
      console.error('Error deleting from storage:', storageError)
      return false
    }
    
    // Delete from database
    const { error: dbError } = await supabase
      .from('uploaded_images')
      .delete()
      .eq('id', imageId)
    
    if (dbError) {
      console.error('Error deleting from database:', dbError)
      return false
    }
    
    return true
  }
}