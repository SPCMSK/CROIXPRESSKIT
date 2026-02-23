import { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { presskitService, PresskitConfig } from '@/lib/supabase';
import { 
  X, 
  Save, 
  Upload, 
  Trash2, 
  Star, 
  Image as ImageIcon,
  Video,
  User,
  Home,
  Share2,
  LogOut,
  Loader2,
  CheckCircle2,
  XCircle,
  GripVertical
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

interface VideoItem {
  id: string;
  title: string;
  embedUrl: string;
  description?: string;
  featured?: boolean;
}

interface GalleryPhoto {
  id: string;
  src: string;
  alt: string;
  featured: boolean;
  category: 'dj' | 'studio' | 'press' | 'colabs' | 'releases';
}

interface SocialLink {
  platform: string;
  url: string;
  icon?: string;
}

export default function AdminPanel({ isOpen, onClose }: AdminPanelProps) {
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [supabaseOnline, setSupabaseOnline] = useState(true);
  const [activeTab, setActiveTab] = useState('hero');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ type: string; id: string } | null>(null);

  // Form states
  const [heroData, setHeroData] = useState({
    title: '',
    subtitle: '',
    description1: '',
    description2: '',
    background_image: ''
  });

  const [bioData, setBioData] = useState({
    title: '',
    image: '',
    paragraph1: '',
    paragraph2: '',
    paragraph3: '',
    paragraph4: ''
  });

  const [galleryPhotos, setGalleryPhotos] = useState<GalleryPhoto[]>([]);
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);

  // New item states
  const [newVideo, setNewVideo] = useState({ title: '', url: '' });
  const [newSocial, setNewSocial] = useState({ platform: '', url: '' });
  const [draggedItem, setDraggedItem] = useState<number | null>(null);

  // Load configuration on mount
  useEffect(() => {
    if (isAuthenticated) {
      loadConfiguration();
    }
  }, [isAuthenticated]);

  const loadConfiguration = async () => {
    setIsLoading(true);
    try {
      const config = await presskitService.getConfig();
      
      if (config) {
        setSupabaseOnline(true);
        setHeroData(config.hero_data);
        setBioData(config.bio_data);
        setGalleryPhotos(config.gallery_photos || []);
        setVideos(config.videos || []);
        setSocialLinks(config.social_links || []);
        
        toast({
          title: "Configuración cargada",
          description: "Datos cargados desde Supabase exitosamente",
        });
      } else {
        setSupabaseOnline(false);
        toast({
          title: "Error al cargar",
          description: "No se pudo conectar con Supabase",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error loading config:', error);
      setSupabaseOnline(false);
      toast({
        title: "Error",
        description: "Error al cargar la configuración",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (email === 'admin@croix.com' && password === 'croix2024') {
      setIsAuthenticated(true);
      toast({
        title: "Acceso concedido",
        description: "Bienvenido al panel de administración",
      });
    } else {
      toast({
        title: "Error de autenticación",
        description: "Credenciales incorrectas",
        variant: "destructive"
      });
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setEmail('');
    setPassword('');
    onClose();
  };

  const saveConfiguration = async () => {
    setIsSaving(true);
    try {
      const config: Partial<PresskitConfig> = {
        hero_data: heroData,
        bio_data: bioData,
        gallery_photos: galleryPhotos,
        videos: videos,
        social_links: socialLinks,
      };

      const success = await presskitService.updateConfig(config);

      if (success) {
        toast({
          title: "Guardado exitoso",
          description: "Los cambios se han guardado correctamente",
        });
      } else {
        throw new Error('Failed to save');
      }
    } catch (error) {
      console.error('Error saving config:', error);
      toast({
        title: "Error al guardar",
        description: "No se pudieron guardar los cambios",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Image upload handler
  const onImageDrop = async (acceptedFiles: File[], category: 'dj' | 'studio' | 'press' | 'colabs' | 'releases') => {
    for (const file of acceptedFiles) {
      try {
        const uploadedImage = await presskitService.uploadImage(file, category);
        
        if (uploadedImage) {
          const newPhoto: GalleryPhoto = {
            id: uploadedImage.id,
            src: uploadedImage.url,
            alt: uploadedImage.alt_text,
            featured: false,
            category: category
          };
          
          setGalleryPhotos(prev => [...prev, newPhoto]);
          
          toast({
            title: "Imagen subida",
            description: `${file.name} se ha subido correctamente`,
          });
        }
      } catch (error) {
        console.error('Error uploading image:', error);
        toast({
          title: "Error",
          description: `No se pudo subir ${file.name}`,
          variant: "destructive"
        });
      }
    }
  };

  const { getRootProps: getRootPropsGallery, getInputProps: getInputPropsGallery, isDragActive } = useDropzone({
    onDrop: (files) => onImageDrop(files, 'dj'),
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
    },
    multiple: true
  });

  const togglePhotoFeatured = (photoId: string) => {
    setGalleryPhotos(prev =>
      prev.map(photo =>
        photo.id === photoId ? { ...photo, featured: !photo.featured } : photo
      )
    );
  };

  const confirmDelete = (type: string, id: string) => {
    setItemToDelete({ type, id });
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;

    const { type, id } = itemToDelete;

    if (type === 'photo') {
      try {
        await presskitService.deleteImage(id);
        setGalleryPhotos(prev => prev.filter(photo => photo.id !== id));
        toast({
          title: "Imagen eliminada",
          description: "La imagen se ha eliminado correctamente",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "No se pudo eliminar la imagen",
          variant: "destructive"
        });
      }
    } else if (type === 'video') {
      setVideos(prev => prev.filter(video => video.id !== id));
      toast({
        title: "Video eliminado",
        description: "El video se ha eliminado de la lista",
      });
    } else if (type === 'social') {
      setSocialLinks(prev => prev.filter(link => link.platform !== id));
      toast({
        title: "Red social eliminada",
        description: "La red social se ha eliminado",
      });
    }

    setDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  const extractYouTubeId = (url: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /^([a-zA-Z0-9_-]{11})$/
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  const addVideo = () => {
    if (!newVideo.title || !newVideo.url) {
      toast({
        title: "Campos incompletos",
        description: "Por favor completa título y URL",
        variant: "destructive"
      });
      return;
    }

    const videoId = extractYouTubeId(newVideo.url);
    if (!videoId) {
      toast({
        title: "URL inválida",
        description: "Por favor ingresa una URL válida de YouTube",
        variant: "destructive"
      });
      return;
    }

    const video: VideoItem = {
      id: videoId,
      title: newVideo.title,
      embedUrl: `https://www.youtube.com/embed/${videoId}`,
      description: '',
      featured: false
    };

    setVideos(prev => [...prev, video]);
    setNewVideo({ title: '', url: '' });
    
    toast({
      title: "Video agregado",
      description: "El video se ha agregado correctamente",
    });
  };

  const toggleVideoFeatured = (videoId: string) => {
    setVideos(prev =>
      prev.map(video =>
        video.id === videoId ? { ...video, featured: !video.featured } : video
      )
    );
  };

  const addSocialLink = () => {
    if (!newSocial.platform || !newSocial.url) {
      toast({
        title: "Campos incompletos",
        description: "Por favor completa plataforma y URL",
        variant: "destructive"
      });
      return;
    }

    // Simple URL validation
    try {
      new URL(newSocial.url);
    } catch {
      toast({
        title: "URL inválida",
        description: "Por favor ingresa una URL válida",
        variant: "destructive"
      });
      return;
    }

    setSocialLinks(prev => [...prev, { ...newSocial }]);
    setNewSocial({ platform: '', url: '' });
    
    toast({
      title: "Red social agregada",
      description: "La red social se ha agregado correctamente",
    });
  };

  const updateSocialLink = (platform: string, newUrl: string) => {
    setSocialLinks(prev =>
      prev.map(link =>
        link.platform === platform ? { ...link, url: newUrl } : link
      )
    );
  };

  // Drag and drop for reordering
  const handleDragStart = (index: number) => {
    setDraggedItem(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedItem === null || draggedItem === index) return;

    const items = [...galleryPhotos];
    const draggedPhoto = items[draggedItem];
    items.splice(draggedItem, 1);
    items.splice(index, 0, draggedPhoto);

    setGalleryPhotos(items);
    setDraggedItem(index);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  const handleVideoDragStart = (index: number) => {
    setDraggedItem(index);
  };

  const handleVideoDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedItem === null || draggedItem === index) return;

    const items = [...videos];
    const draggedVideo = items[draggedItem];
    items.splice(draggedItem, 1);
    items.splice(index, 0, draggedVideo);

    setVideos(items);
    setDraggedItem(index);
  };

  const uploadHeroBackground = async (file: File) => {
    try {
      const uploaded = await presskitService.uploadImage(file, 'press');
      if (uploaded) {
        setHeroData(prev => ({ ...prev, background_image: uploaded.url }));
        toast({
          title: "Imagen de fondo actualizada",
          description: "La imagen de fondo del hero se ha actualizado",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo subir la imagen",
        variant: "destructive"
      });
    }
  };

  const uploadBioImage = async (file: File) => {
    try {
      const uploaded = await presskitService.uploadImage(file, 'press');
      if (uploaded) {
        setBioData(prev => ({ ...prev, image: uploaded.url }));
        toast({
          title: "Imagen de biografía actualizada",
          description: "La imagen de biografía se ha actualizado",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo subir la imagen",
        variant: "destructive"
      });
    }
  };

  if (!isOpen) return null;

  // Login screen
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Panel de Administración</CardTitle>
            <CardDescription>Ingresa tus credenciales para acceder</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@croix.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  Iniciar Sesión
                </Button>
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Main admin panel
  return (
    <div className="fixed inset-0 z-50 bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold">Panel de Administración</h1>
            <div className="flex items-center gap-2 text-sm">
              {supabaseOnline ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span className="text-muted-foreground">Sistema Online</span>
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4 text-red-500" />
                  <span className="text-muted-foreground">Sistema Offline</span>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={saveConfiguration}
              disabled={isSaving}
              className="gap-2"
            >
              {isSaving ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Guardando...</>
              ) : (
                <><Save className="h-4 w-4" /> Guardar Cambios</>
              )}
            </Button>
            <Button variant="outline" onClick={handleLogout} className="gap-2">
              <LogOut className="h-4 w-4" /> Cerrar Sesión
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container h-[calc(100vh-4rem)] py-6">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
            <TabsList className="grid w-full grid-cols-5 mb-4">
              <TabsTrigger value="hero" className="gap-2">
                <Home className="h-4 w-4" /> Hero
              </TabsTrigger>
              <TabsTrigger value="bio" className="gap-2">
                <User className="h-4 w-4" /> Biografía
              </TabsTrigger>
              <TabsTrigger value="gallery" className="gap-2">
                <ImageIcon className="h-4 w-4" /> Galería
              </TabsTrigger>
              <TabsTrigger value="videos" className="gap-2">
                <Video className="h-4 w-4" /> Videos
              </TabsTrigger>
              <TabsTrigger value="social" className="gap-2">
                <Share2 className="h-4 w-4" /> Redes
              </TabsTrigger>
            </TabsList>

            <ScrollArea className="h-[calc(100vh-12rem)]">
              {/* Hero Section */}
              <TabsContent value="hero" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Sección Hero</CardTitle>
                    <CardDescription>
                      Edita el contenido principal de la página de inicio
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="hero-title">Título Principal</Label>
                      <Input
                        id="hero-title"
                        value={heroData.title}
                        onChange={(e) => setHeroData(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="CROIX"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="hero-subtitle">Subtítulo</Label>
                      <Input
                        id="hero-subtitle"
                        value={heroData.subtitle}
                        onChange={(e) => setHeroData(prev => ({ ...prev, subtitle: e.target.value }))}
                        placeholder="Electronic Press Kit"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="hero-desc1">Descripción 1</Label>
                      <Input
                        id="hero-desc1"
                        value={heroData.description1}
                        onChange={(e) => setHeroData(prev => ({ ...prev, description1: e.target.value }))}
                        placeholder="DJ y Productor Chileno"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="hero-desc2">Descripción 2</Label>
                      <Input
                        id="hero-desc2"
                        value={heroData.description2}
                        onChange={(e) => setHeroData(prev => ({ ...prev, description2: e.target.value }))}
                        placeholder="Underground Techno • Oetraxxrecords"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Imagen de Fondo</Label>
                      {heroData.background_image && (
                        <div className="relative w-full h-48 rounded-lg overflow-hidden border">
                          <img
                            src={heroData.background_image}
                            alt="Hero background"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex gap-2">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) uploadHeroBackground(file);
                          }}
                          className="flex-1"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Biography Section */}
              <TabsContent value="bio" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Sección Biografía</CardTitle>
                    <CardDescription>
                      Edita tu biografía y texto de presentación
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="bio-title">Título de Biografía</Label>
                      <Input
                        id="bio-title"
                        value={bioData.title}
                        onChange={(e) => setBioData(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Acerca de CROIX"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Imagen de Biografía</Label>
                      {bioData.image && (
                        <div className="relative w-64 h-64 rounded-lg overflow-hidden border mx-auto">
                          <img
                            src={bioData.image}
                            alt="Bio"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) uploadBioImage(file);
                        }}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio-p1">Párrafo 1</Label>
                      <Textarea
                        id="bio-p1"
                        value={bioData.paragraph1}
                        onChange={(e) => setBioData(prev => ({ ...prev, paragraph1: e.target.value }))}
                        rows={4}
                        placeholder="Primera parte de la biografía..."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio-p2">Párrafo 2</Label>
                      <Textarea
                        id="bio-p2"
                        value={bioData.paragraph2}
                        onChange={(e) => setBioData(prev => ({ ...prev, paragraph2: e.target.value }))}
                        rows={4}
                        placeholder="Segunda parte de la biografía..."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio-p3">Párrafo 3</Label>
                      <Textarea
                        id="bio-p3"
                        value={bioData.paragraph3}
                        onChange={(e) => setBioData(prev => ({ ...prev, paragraph3: e.target.value }))}
                        rows={4}
                        placeholder="Tercera parte de la biografía..."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio-p4">Párrafo 4</Label>
                      <Textarea
                        id="bio-p4"
                        value={bioData.paragraph4}
                        onChange={(e) => setBioData(prev => ({ ...prev, paragraph4: e.target.value }))}
                        rows={4}
                        placeholder="Cuarta parte de la biografía..."
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Gallery Section */}
              <TabsContent value="gallery" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Gestión de Galería</CardTitle>
                    <CardDescription>
                      Sube, organiza y administra las fotos de tu presskit
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Upload area */}
                    <div
                      {...getRootPropsGallery()}
                      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                        isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
                      }`}
                    >
                      <input {...getInputPropsGallery()} />
                      <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-lg font-medium mb-2">
                        {isDragActive
                          ? 'Suelta las imágenes aquí...'
                          : 'Arrastra imágenes aquí o haz clic para seleccionar'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Soporta: PNG, JPG, JPEG, GIF, WEBP
                      </p>
                    </div>

                    {/* Gallery grid */}
                    {galleryPhotos.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {galleryPhotos.map((photo, index) => (
                          <div
                            key={photo.id}
                            draggable
                            onDragStart={() => handleDragStart(index)}
                            onDragOver={(e) => handleDragOver(e, index)}
                            onDragEnd={handleDragEnd}
                            className="relative group rounded-lg overflow-hidden border bg-card cursor-move"
                          >
                            <div className="absolute top-2 left-2 z-10">
                              <GripVertical className="h-5 w-5 text-white drop-shadow-lg" />
                            </div>
                            <img
                              src={photo.src}
                              alt={photo.alt}
                              className="w-full h-48 object-cover"
                            />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                              <Button
                                size="icon"
                                variant={photo.featured ? "default" : "secondary"}
                                onClick={() => togglePhotoFeatured(photo.id)}
                                title="Marcar como destacada"
                              >
                                <Star className={`h-4 w-4 ${photo.featured ? 'fill-current' : ''}`} />
                              </Button>
                              <Button
                                size="icon"
                                variant="destructive"
                                onClick={() => confirmDelete('photo', photo.id)}
                                title="Eliminar imagen"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="p-2 bg-card">
                              <p className="text-xs text-muted-foreground truncate">
                                {photo.alt}
                              </p>
                              <p className="text-xs font-medium text-primary">
                                {photo.category}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {galleryPhotos.length === 0 && (
                      <div className="text-center py-12 text-muted-foreground">
                        No hay imágenes en la galería. Sube algunas para comenzar.
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Videos Section */}
              <TabsContent value="videos" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Gestión de Videos</CardTitle>
                    <CardDescription>
                      Administra los videos de YouTube en tu presskit
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Add new video */}
                    <div className="border rounded-lg p-4 space-y-4">
                      <h3 className="font-medium">Agregar Nuevo Video</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="video-title">Título del Video</Label>
                          <Input
                            id="video-title"
                            value={newVideo.title}
                            onChange={(e) => setNewVideo(prev => ({ ...prev, title: e.target.value }))}
                            placeholder="Live Set @ Club XYZ"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="video-url">URL de YouTube</Label>
                          <Input
                            id="video-url"
                            value={newVideo.url}
                            onChange={(e) => setNewVideo(prev => ({ ...prev, url: e.target.value }))}
                            placeholder="https://youtube.com/watch?v=..."
                          />
                        </div>
                      </div>
                      <Button onClick={addVideo} className="w-full">
                        <Upload className="h-4 w-4 mr-2" />
                        Agregar Video
                      </Button>
                    </div>

                    {/* Videos list */}
                    {videos.length > 0 && (
                      <div className="space-y-4">
                        <h3 className="font-medium">Videos Actuales</h3>
                        <div className="space-y-3">
                          {videos.map((video, index) => (
                            <div
                              key={video.id}
                              draggable
                              onDragStart={() => handleVideoDragStart(index)}
                              onDragOver={(e) => handleVideoDragOver(e, index)}
                              onDragEnd={handleDragEnd}
                              className="flex items-center gap-4 p-4 border rounded-lg bg-card cursor-move"
                            >
                              <GripVertical className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                              <div className="w-32 h-20 rounded overflow-hidden bg-muted flex-shrink-0">
                                <img
                                  src={`https://img.youtube.com/vi/${video.id}/mqdefault.jpg`}
                                  alt={video.title}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex-1">
                                <Input
                                  value={video.title}
                                  onChange={(e) => {
                                    setVideos(prev =>
                                      prev.map(v => v.id === video.id ? { ...v, title: e.target.value } : v)
                                    );
                                  }}
                                  className="font-medium"
                                />
                                <p className="text-xs text-muted-foreground mt-1">
                                  ID: {video.id}
                                </p>
                              </div>
                              <Button
                                size="icon"
                                variant={video.featured ? "default" : "outline"}
                                onClick={() => toggleVideoFeatured(video.id)}
                                title="Marcar como destacado"
                              >
                                <Star className={`h-4 w-4 ${video.featured ? 'fill-current' : ''}`} />
                              </Button>
                              <Button
                                size="icon"
                                variant="destructive"
                                onClick={() => confirmDelete('video', video.id)}
                                title="Eliminar video"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {videos.length === 0 && (
                      <div className="text-center py-12 text-muted-foreground">
                        No hay videos agregados. Agrega uno para comenzar.
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Social Links Section */}
              <TabsContent value="social" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Redes Sociales</CardTitle>
                    <CardDescription>
                      Administra los enlaces a tus redes sociales
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Add new social link */}
                    <div className="border rounded-lg p-4 space-y-4">
                      <h3 className="font-medium">Agregar Nueva Red Social</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="social-platform">Plataforma</Label>
                          <Input
                            id="social-platform"
                            value={newSocial.platform}
                            onChange={(e) => setNewSocial(prev => ({ ...prev, platform: e.target.value }))}
                            placeholder="Instagram, Spotify, etc."
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="social-url">URL</Label>
                          <Input
                            id="social-url"
                            value={newSocial.url}
                            onChange={(e) => setNewSocial(prev => ({ ...prev, url: e.target.value }))}
                            placeholder="https://..."
                          />
                        </div>
                      </div>
                      <Button onClick={addSocialLink} className="w-full">
                        <Upload className="h-4 w-4 mr-2" />
                        Agregar Red Social
                      </Button>
                    </div>

                    {/* Social links list */}
                    {socialLinks.length > 0 && (
                      <div className="space-y-4">
                        <h3 className="font-medium">Redes Sociales Actuales</h3>
                        <div className="space-y-3">
                          {socialLinks.map((link) => (
                            <div
                              key={link.platform}
                              className="flex items-center gap-4 p-4 border rounded-lg bg-card"
                            >
                              <div className="flex-1 space-y-2">
                                <Label className="text-base font-medium">
                                  {link.platform}
                                </Label>
                                <Input
                                  value={link.url}
                                  onChange={(e) => updateSocialLink(link.platform, e.target.value)}
                                  placeholder="https://..."
                                />
                              </div>
                              <Button
                                size="icon"
                                variant="destructive"
                                onClick={() => confirmDelete('social', link.platform)}
                                title="Eliminar red social"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {socialLinks.length === 0 && (
                      <div className="text-center py-12 text-muted-foreground">
                        No hay redes sociales agregadas. Agrega una para comenzar.
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </ScrollArea>
          </Tabs>
        )}
      </div>

      {/* Delete confirmation dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El elemento será eliminado permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
