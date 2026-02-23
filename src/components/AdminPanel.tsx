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
  const [activeTab, setActiveTab] = useState('biografia')
  const [supabaseStatus, setSupabaseStatus] = useState<{
    configured: boolean
    loading: boolean
    error?: string
  }>({ configured: false, loading: true })
  
  const { toast } = useToast()

  // Verificar configuración de Supabase
  useEffect(() => {
    console.log('🚀 AdminPanel useEffect ejecutándose, isOpen:', isOpen)
    
    const checkSupabaseConfig = async () => {
      console.log('🔄 Iniciando verificación de Supabase...')
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
            /* Admin Interface with Tabs */
            <div className="h-[calc(90vh-80px)] flex">
              {/* Sidebar Navigation */}
              <div className="w-64 border-r bg-muted/30">
                <div className="p-4">
                  <h4 className="font-medium mb-4 text-sm text-muted-foreground">PANEL DE CONTROL</h4>
                  <nav className="space-y-2">
                    <button
                      onClick={() => setActiveTab('biografia')}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-3 transition-colors ${
                        activeTab === 'biografia' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                      }`}
                    >
                      <User className="w-4 h-4" />
                      Editor de Biografía
                    </button>
                    <button
                      onClick={() => setActiveTab('imagenes')}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-3 transition-colors ${
                        activeTab === 'imagenes' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                      }`}
                    >
                      <ImageIcon className="w-4 h-4" />
                      Gestión de Imágenes
                    </button>
                    <button
                      onClick={() => setActiveTab('redes')}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-3 transition-colors ${
                        activeTab === 'redes' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                      }`}
                    >
                      <Link2 className="w-4 h-4" />
                      Redes Sociales
                    </button>
                  </nav>
                </div>
                
                {/* Status Information */}
                <div className="p-4 border-t">
                  <div className={`p-3 rounded-lg text-xs ${
                    supabaseStatus.configured
                      ? 'bg-green-50 border border-green-200 text-green-800'
                      : 'bg-yellow-50 border border-yellow-200 text-yellow-800'
                  }`}>
                    <div className="flex items-center gap-2 mb-1">
                      {supabaseStatus.configured ? (
                        <CheckCircle className="w-3 h-3 text-green-600" />
                      ) : (
                        <AlertCircle className="w-3 h-3 text-yellow-600" />
                      )}
                      <span className="font-medium">
                        {supabaseStatus.configured ? 'Sistema Online' : 'Configuración Pendiente'}
                      </span>
                    </div>
                    {!supabaseStatus.configured && (
                      <p>Revisa SUPABASE_SETUP.md</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Main Content Area */}
              <div className="flex-1 overflow-y-auto">
                <div className="p-6">
                  {activeTab === 'biografia' && (
                    <div>
                      <h3 className="text-xl font-semibold mb-4">Editor de Biografía</h3>
                      <div className="space-y-4">
                        <Card>
                          <CardContent className="p-6">
                            <p className="text-muted-foreground mb-4">
                              Edita la información principal de CROIX que aparece en el presskit.
                            </p>
                            <div className="space-y-4">
                              <div>
                                <Label>Título Principal</Label>
                                <Input defaultValue="CROIX" className="mt-1" />
                              </div>
                              <div>
                                <Label>Subtítulo</Label>
                                <Input defaultValue="DJ y Productor Chileno" className="mt-1" />
                              </div>
                              <div>
                                <Label>Biografía</Label>
                                <div className="mt-1 p-4 border rounded-lg min-h-[200px] bg-muted/30">
                                  <p className="text-sm text-muted-foreground">
                                    Editor de texto enriquecido disponible una vez configurado Supabase...
                                  </p>
                                </div>
                              </div>
                              <Button disabled={!supabaseStatus.configured}>
                                💾 Guardar Cambios
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  )}

                  {activeTab === 'imagenes' && (
                    <div>
                      <h3 className="text-xl font-semibold mb-4">Gestión de Imágenes</h3>
                      <div className="space-y-4">
                        <Card>
                          <CardContent className="p-6">
                            <p className="text-muted-foreground mb-4">
                              Sube y organiza las imágenes del presskit por categorías.
                            </p>
                            <div className="border-2 border-dashed border-muted rounded-lg p-12 text-center">
                              <ImageIcon className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                              <p className="text-muted-foreground">
                                {supabaseStatus.configured 
                                  ? "Arrastra y suelta imágenes aquí, o haz clic para seleccionar"
                                  : "Configuración de Supabase requerida para subir imágenes"
                                }
                              </p>
                              <Button disabled={!supabaseStatus.configured} className="mt-4">
                                📁 Seleccionar Imágenes
                              </Button>
                            </div>
                            
                            <div className="mt-6">
                              <Label className="text-sm font-medium">Categorías disponibles:</Label>
                              <div className="flex gap-2 mt-2">
                                {['DJ', 'Studio', 'Press', 'Colabs', 'Releases'].map(cat => (
                                  <span key={cat} className="px-2 py-1 bg-primary/10 text-primary rounded text-xs">
                                    {cat}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  )}

                  {activeTab === 'redes' && (
                    <div>
                      <h3 className="text-xl font-semibold mb-4">Redes Sociales</h3>
                      <div className="space-y-4">
                        <Card>
                          <CardContent className="p-6">
                            <p className="text-muted-foreground mb-4">
                              Gestiona los enlaces a redes sociales que aparecen en el presskit.
                            </p>
                            <div className="space-y-4">
                              <div>
                                <Label>Instagram</Label>
                                <Input 
                                  defaultValue="https://www.instagram.com/croix__/" 
                                  placeholder="https://instagram.com/usuario"
                                  className="mt-1" 
                                />
                              </div>
                              <div>
                                <Label>Spotify</Label>
                                <Input 
                                  defaultValue="https://open.spotify.com/intl-es/artist/7H3B36EQXldij3pvfgeDQk"
                                  placeholder="https://open.spotify.com/artist/..."
                                  className="mt-1" 
                                />
                              </div>
                              <div>
                                <Label>SoundCloud</Label>
                                <Input 
                                  placeholder="https://soundcloud.com/usuario"
                                  className="mt-1" 
                                />
                              </div>
                              <div>
                                <Label>YouTube</Label>
                                <Input 
                                  placeholder="https://youtube.com/@usuario"
                                  className="mt-1" 
                                />
                              </div>
                              <Button disabled={!supabaseStatus.configured}>
                                💾 Guardar Enlaces
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  )}
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