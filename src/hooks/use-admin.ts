import { useState, useEffect } from 'react'
import { useToast } from '@/hooks/use-toast'
import { presskitService, PresskitConfig, UploadedImage } from '@/lib/supabase'

interface UseAdminReturn {
  // Authentication
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  
  // Configuration
  config: PresskitConfig | null
  updateConfig: (updates: Partial<PresskitConfig>) => Promise<boolean>
  saveConfig: () => Promise<boolean>
  
  // Image Management
  images: UploadedImage[]
  uploadImage: (file: File, category: string) => Promise<UploadedImage | null>
  deleteImage: (imageId: string) => Promise<boolean>
  refreshImages: () => Promise<void>
  
  // Loading states
  loading: boolean
  uploading: boolean
  saving: boolean
}

export const useAdmin = (): UseAdminReturn => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [config, setConfig] = useState<PresskitConfig | null>(null)
  const [images, setImages] = useState<UploadedImage[]>([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  
  const { toast } = useToast()

  // Check if user is already authenticated
  useEffect(() => {
    const authStatus = localStorage.getItem('admin-authenticated')
    if (authStatus === 'true') {
      setIsAuthenticated(true)
      loadInitialData()
    }
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || 'admin@croix.com'
    const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'croix2024'
    
    if (email === adminEmail && password === adminPassword) {
      setIsAuthenticated(true)
      localStorage.setItem('admin-authenticated', 'true')
      await loadInitialData()
      toast({
        title: '¡Bienvenido!',
        description: 'Has iniciado sesión correctamente',
      })
      return true
    } else {
      toast({
        title: 'Error de autenticación',
        description: 'Email o contraseña incorrectos',
        variant: 'destructive'
      })
      return false
    }
  }

  const logout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem('admin-authenticated')
    setConfig(null)
    setImages([])
    toast({
      title: 'Sesión cerrada',
      description: 'Has cerrado sesión correctamente'
    })
  }

  const loadInitialData = async () => {
    setLoading(true)
    try {
      // Load configuration
      const configData = await presskitService.getConfig()
      if (configData) {
        setConfig(configData)
      } else {
        // Create default configuration if none exists
        const defaultConfig: Partial<PresskitConfig> = {
          id: 'main',
          hero_data: {
            title: 'CROIX',
            subtitle: 'Electronic Press Kit',
            description1: 'DJ y Productor Chileno',
            description2: 'Underground Techno • Oetraxxrecords',
            background_image: ''
          },
          bio_data: {
            title: 'Acerca de CROIX',
            image: '',
            paragraph1: 'Croix es un DJ y productor chileno...',
            paragraph2: 'Su prolífica carrera en el estudio...',
            paragraph3: 'Más allá de sus lanzamientos en solitario...',
            paragraph4: 'Su faceta colaborativa es igualmente sólida...'
          },
          social_links: [
            { platform: 'Instagram', url: 'https://www.instagram.com/croix__/' },
            { platform: 'Spotify', url: 'https://open.spotify.com/intl-es/artist/7H3B36EQXldij3pvfgeDQk' }
          ],
          videos: [],
          gallery_photos: [],
          theme_colors: {
            primary: '320 100% 65%',
            secondary: '0 100% 60%',
            background: '0 0% 1%',
            foreground: '0 0% 98%'
          },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
        await presskitService.updateConfig(defaultConfig)
        setConfig(defaultConfig as PresskitConfig)
      }
      
      // Load images
      await refreshImages()
    } catch (error) {
      console.error('Error loading initial data:', error)
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los datos iniciales',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const updateConfig = async (updates: Partial<PresskitConfig>): Promise<boolean> => {
    if (!config) return false
    
    const updatedConfig = { ...config, ...updates }
    setConfig(updatedConfig)
    return true
  }

  const saveConfig = async (): Promise<boolean> => {
    if (!config) return false
    
    setSaving(true)
    try {
      const success = await presskitService.updateConfig(config)
      if (success) {
        toast({
          title: 'Guardado exitoso',
          description: 'Los cambios se han guardado correctamente'
        })
        return true
      } else {
        throw new Error('Failed to save config')
      }
    } catch (error) {
      console.error('Error saving config:', error)
      toast({
        title: 'Error al guardar',
        description: 'No se pudieron guardar los cambios',
        variant: 'destructive'
      })
      return false
    } finally {
      setSaving(false)
    }
  }

  const uploadImage = async (file: File, category: string): Promise<UploadedImage | null> => {
    setUploading(true)
    try {
      const uploadedImage = await presskitService.uploadImage(file, category)
      if (uploadedImage) {
        setImages(prev => [uploadedImage, ...prev])
        toast({
          title: 'Imagen subida',
          description: `${file.name} se ha subido correctamente`
        })
        return uploadedImage
      } else {
        throw new Error('Failed to upload image')
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      toast({
        title: 'Error al subir imagen',
        description: 'No se pudo subir la imagen',
        variant: 'destructive'
      })
      return null
    } finally {
      setUploading(false)
    }
  }

  const deleteImage = async (imageId: string): Promise<boolean> => {
    try {
      const success = await presskitService.deleteImage(imageId)
      if (success) {
        setImages(prev => prev.filter(img => img.id !== imageId))
        toast({
          title: 'Imagen eliminada',
          description: 'La imagen se ha eliminado correctamente'
        })
        return true
      } else {
        throw new Error('Failed to delete image')
      }
    } catch (error) {
      console.error('Error deleting image:', error)
      toast({
        title: 'Error al eliminar',
        description: 'No se pudo eliminar la imagen',
        variant: 'destructive'
      })
      return false
    }
  }

  const refreshImages = async () => {
    try {
      const imageList = await presskitService.getImages()
      setImages(imageList)
    } catch (error) {
      console.error('Error refreshing images:', error)
    }
  }

  return {
    isAuthenticated,
    login,
    logout,
    config,
    updateConfig,
    saveConfig,
    images,
    uploadImage,
    deleteImage,
    refreshImages,
    loading,
    uploading,
    saving
  }
}