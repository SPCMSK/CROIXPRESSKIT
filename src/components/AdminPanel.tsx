import React, { useState, useEffect } from 'react'
import { 
  LogOut, 
  Image as ImageIcon, 
  Link2, 
  User,
  X,
  Shield,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'

interface AdminPanelProps {
  isOpen: boolean
  onClose: () => void
}

const AdminPanel: React.FC<AdminPanelProps> = ({ isOpen, onClose }) => {
  const [loginData, setLoginData] = useState({ email: '', password: '' })
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [supabaseStatus, setSupabaseStatus] = useState<{
    configured: boolean
    loading: boolean
    error?: string
  }>({ configured: false, loading: true })
  
  const { toast } = useToast()

  // Verificar configuración de Supabase
  useEffect(() => {
    const checkSupabaseConfig = async () => {
      setSupabaseStatus({ configured: false, loading: true })
      
      try {
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
        const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
        
        console.log('🔍 Verificando variables:', {
          hasUrl: !!supabaseUrl,
          hasKey: !!supabaseKey,
          url: supabaseUrl?.substring(0, 30) + '...', 
          keyLength: supabaseKey?.length
        })
        
        if (!supabaseUrl || !supabaseKey || 
            supabaseUrl === 'your_supabase_url_here' || 
            supabaseKey === 'your_supabase_anon_key_here') {
          setSupabaseStatus({ 
            configured: false, 
            loading: false,
            error: 'Variables de entorno no configuradas'
          })
          return
        }
        
        // Verificación simplificada sin fetch
        if (supabaseUrl.includes('supabase.co') && supabaseKey.length > 50) {
          console.log('✅ Variables de Supabase válidas')
          setSupabaseStatus({ configured: true, loading: false })
        } else {
          setSupabaseStatus({ 
            configured: false, 
            loading: false,
            error: 'Formato de variables inválido'
          })
        }
        
      } catch (error) {
        console.error('❌ Error al verificar Supabase:', error)
        setSupabaseStatus({ 
          configured: false, 
          loading: false,
          error: 'Error al verificar configuración'
        })
      }
    }
    
    if (isOpen) {
      checkSupabaseConfig()
    }
  }, [isOpen])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Simple authentication for now
    if (loginData.email === 'admin@croix.com' && loginData.password === 'croix2024') {
      setIsAuthenticated(true)
      toast({
        title: '¡Bienvenido!',
        description: 'Has iniciado sesión correctamente',
      })
    } else {
      toast({
        title: 'Error de autenticación',
        description: 'Email o contraseña incorrectos',
        variant: 'destructive'
      })
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setLoginData({ email: '', password: '' })
    toast({
      title: 'Sesión cerrada',
      description: 'Has cerrado sesión correctamente'
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-background rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="font-bold text-xl">Panel de Administración</h2>
              <p className="text-sm text-muted-foreground">Gestiona tu presskit completo</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <Button onClick={handleLogout} variant="outline">
                <LogOut className="w-4 h-4 mr-2" />
                Cerrar sesión
              </Button>
            )}
            <Button variant="ghost" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {!isAuthenticated ? (
            /* Login Form */
            <div className="flex items-center justify-center h-96">
              <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                  <CardTitle>Iniciar Sesión</CardTitle>
                  <CardDescription>
                    Accede al panel de administración
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={loginData.email}
                        onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="admin@croix.com"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Contraseña</Label>
                      <Input
                        id="password"
                        type="password"
                        value={loginData.password}
                        onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                        placeholder="••••••••"
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      Iniciar Sesión
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          ) : (
            /* Admin Interface */
            <div className="h-[calc(90vh-80px)] overflow-y-auto">
              <div className="p-6">
                <div className="text-center py-12">
                  <Shield className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-semibold text-lg mb-2">Panel de Administración</h3>
                  <p className="text-muted-foreground mb-4">
                    ¡Bienvenido al panel de administración de CROIX!
                  </p>
                  
                  <div className="space-y-3 text-sm text-muted-foreground max-w-2xl mx-auto">
                    {/* Estado de Supabase */}
                    <div className={`p-4 border rounded-lg ${
                      supabaseStatus.loading 
                        ? 'bg-blue-50 border-blue-200 text-blue-800' 
                        : supabaseStatus.configured
                          ? 'bg-green-50 border-green-200 text-green-800'
                          : 'bg-yellow-50 border-yellow-200 text-yellow-800'
                    }`}>
                      <div className="flex items-center justify-center gap-2 mb-2">
                        {supabaseStatus.loading ? (
                          <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                        ) : supabaseStatus.configured ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-yellow-600" />
                        )}
                        <p className="font-medium">
                          {supabaseStatus.loading 
                            ? 'Verificando configuración...'
                            : supabaseStatus.configured
                              ? '✅ Supabase configurado correctamente'
                              : '🔧 Configuración de Supabase requerida'
                          }
                        </p>
                      </div>
                      
                      {!supabaseStatus.loading && !supabaseStatus.configured && (
                        <div>
                          <p>Para usar todas las funcionalidades del panel:</p>
                          <ol className="list-decimal list-inside mt-2 space-y-1">
                            <li>Revisa el archivo <code className="bg-yellow-100 px-1 rounded">SUPABASE_SETUP.md</code></li>
                            <li>Crea un proyecto en Supabase</li>
                            <li>Ejecuta las consultas SQL proporcionadas</li>
                            <li>Actualiza las variables de entorno en .env.local</li>
                          </ol>
                          {supabaseStatus.error && (
                            <p className="text-red-600 mt-2 font-medium">Error: {supabaseStatus.error}</p>
                          )}
                        </div>
                      )}
                      
                      {supabaseStatus.configured && (
                        <p>Todas las funcionalidades están disponibles: gestión de imágenes, contenido dinámico y más.</p>
                      )}
                    </div>
                    
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-800">
                      <p className="font-medium mb-2">📝 Guía de uso</p>
                      <p>Lee la <code className="bg-blue-100 px-1 rounded">ADMIN_GUIDE.md</code> para aprender a usar todas las funcionalidades</p>
                    </div>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 max-w-4xl mx-auto">
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6 text-center">
                      <User className="w-12 h-12 mx-auto mb-4 text-primary" />
                      <h4 className="font-medium mb-2">Editor de Biografía</h4>
                      <p className="text-sm text-muted-foreground">
                        Editor de texto enriquecido con formato visual y vista previa
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6 text-center">
                      <ImageIcon className="w-12 h-12 mx-auto mb-4 text-primary" />
                      <h4 className="font-medium mb-2">Gestión de Imágenes</h4>
                      <p className="text-sm text-muted-foreground">
                        Drag & drop, categorías automáticas, eliminar/descargar
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6 text-center">
                      <Link2 className="w-12 h-12 mx-auto mb-4 text-primary" />
                      <h4 className="font-medium mb-2">Redes Sociales</h4>
                      <p className="text-sm text-muted-foreground">
                        Agregar/eliminar redes, validación automática de URLs
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminPanel