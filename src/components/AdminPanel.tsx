import { useState, useEffect } from 'react';
import { useContent } from '@/contexts/ContentContext';
import { useDropzone } from 'react-dropzone';
import { presskitService, supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Save, 
  Upload, 
  Trash2, 
  Star, 
  GripVertical, 
  X, 
  LogOut, 
  Image as ImageIcon,
  Video,
  Share2,
  FileText,
  Home,
  Plus
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

interface GalleryPhoto {
  id: string;
  src: string;
  alt: string;
  category: 'dj' | 'studio' | 'press' | 'colabs' | 'releases';
  featured: boolean;
}

interface Video {
  id: string;
  title: string;
  embedUrl: string;
  description?: string;
}

interface SocialLink {
  platform: string;
  url: string;
}

const AdminPanel = ({ isOpen, onClose }: AdminPanelProps) => {
  const { content, updateContent } = useContent();
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentTab, setCurrentTab] = useState('hero');

  // States for each section
  const [heroData, setHeroData] = useState(content.heroData);
  const [bioData, setBioData] = useState(content.bioData);
  const [galleryPhotos, setGalleryPhotos] = useState<GalleryPhoto[]>([]);
  const [videos, setVideos] = useState<Video[]>(content.videos);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(content.socialLinks);

  // Dialog states
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; type: string; id: string }>({ 
    open: false, 
    type: '', 
    id: '' 
  });

  // New item states
  const [newVideo, setNewVideo] = useState({ title: '', url: '' });
  const [newSocial, setNewSocial] = useState({ platform: '', url: '' });

  // Drag state
  const [draggedItem, setDraggedItem] = useState<number | null>(null);

  // Load data from ContentContext on mount
  useEffect(() => {
    if (isAuthenticated) {
      setHeroData(content.heroData);
      setBioData(content.bioData);
      
      // Convert galleryPhotos to include id and category
      const photosWithMeta = content.galleryPhotos.map((photo, idx) => ({
        id: crypto.randomUUID(),
        src: photo.src,
        alt: photo.alt,
        featured: photo.featured,
        category: (photo.src.includes('/DJ/') ? 'dj' : 'studio') as 'dj' | 'studio' | 'press' | 'colabs' | 'releases'
      }));
      setGalleryPhotos(photosWithMeta);
      
      setVideos(content.videos);
      setSocialLinks(content.socialLinks);
    }
  }, [content, isAuthenticated]);

  // Authentication
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (email === 'admin@croix.com' && password === 'croix2024') {
      setIsAuthenticated(true);
      toast({
        title: "✅ Autenticado",
        description: "Bienvenido al panel de administración",
      });
    } else {
      toast({
        title: "❌ Error",
        description: "Credenciales incorrectas",
        variant: "destructive",
      });
    }

    setLoading(false);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setEmail('');
    setPassword('');
    onClose();
  };

  // HERO SECTION
  const handleHeroImageUpload = async (files: File[]) => {
    if (files.length === 0) return;
    
    setLoading(true);
    const file = files[0];

    try {
      const result = await presskitService.uploadImage(file, 'hero');
      if (result) {
        const updatedHeroData = { ...heroData, backgroundImage: result.url };
        setHeroData(updatedHeroData);
        
        // Guardar automáticamente en Supabase y ContentContext
        await presskitService.updateConfig({
          hero_data: {
            title: updatedHeroData.title,
            subtitle: updatedHeroData.subtitle,
            description1: updatedHeroData.description1,
            description2: updatedHeroData.description2,
            background_image: updatedHeroData.backgroundImage,
          },
        });
        
        updateContent({ heroData: updatedHeroData });
        
        toast({
          title: "✅ Imagen guardada",
          description: "Imagen de fondo actualizada y guardada",
        });
      }
    } catch (error) {
      toast({
        title: "❌ Error",
        description: "No se pudo subir la imagen",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const heroDropzone = useDropzone({
    onDrop: handleHeroImageUpload,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] },
    maxFiles: 1,
  });

  const saveHero = async () => {
    setLoading(true);
    try {
      await presskitService.updateConfig({
        hero_data: {
          title: heroData.title,
          subtitle: heroData.subtitle,
          description1: heroData.description1,
          description2: heroData.description2,
          background_image: heroData.backgroundImage,
        },
      });

      updateContent({ heroData });

      toast({
        title: "✅ Guardado",
        description: "Cambios en Hero guardados exitosamente",
      });
    } catch (error) {
      toast({
        title: "❌ Error",
        description: "No se pudieron guardar los cambios",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // BIO SECTION
  const handleBioImageUpload = async (files: File[]) => {
    if (files.length === 0) return;
    
    setLoading(true);
    const file = files[0];

    try {
      const result = await presskitService.uploadImage(file, 'bio');
      if (result) {
        const updatedBioData = { ...bioData, image: result.url };
        setBioData(updatedBioData);
        
        // Guardar automáticamente en Supabase y ContentContext
        await presskitService.updateConfig({
          bio_data: updatedBioData,
        });
        
        updateContent({ bioData: updatedBioData });
        
        toast({
          title: "✅ Imagen guardada",
          description: "Imagen de biografía actualizada y guardada",
        });
      }
    } catch (error) {
      toast({
        title: "❌ Error",
        description: "No se pudo subir la imagen",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const bioDropzone = useDropzone({
    onDrop: handleBioImageUpload,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] },
    maxFiles: 1,
  });

  const saveBio = async () => {
    setLoading(true);
    try {
      await presskitService.updateConfig({
        bio_data: bioData,
      });

      updateContent({ bioData });

      toast({
        title: "✅ Guardado",
        description: "Cambios en Biografía guardados exitosamente",
      });
    } catch (error) {
      toast({
        title: "❌ Error",
        description: "No se pudieron guardar los cambios",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // GALLERY SECTION
  const handleGalleryUpload = async (files: File[]) => {
    if (files.length === 0) return;
    
    setLoading(true);

    try {
      const uploadPromises = files.map(file => 
        presskitService.uploadImage(file, 'gallery')
      );
      
      const results = await Promise.all(uploadPromises);
      const newPhotos: GalleryPhoto[] = results
        .filter(result => result !== null)
        .map(result => ({
          id: result!.id,
          src: result!.url,
          alt: result!.alt_text,
          category: 'dj' as const,
          featured: false,
        }));

      setGalleryPhotos(prev => [...prev, ...newPhotos]);

      toast({
        title: "✅ Imágenes subidas",
        description: `${newPhotos.length} imagen(es) agregada(s) a la galería`,
      });
    } catch (error) {
      toast({
        title: "❌ Error",
        description: "No se pudieron subir las imágenes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const galleryDropzone = useDropzone({
    onDrop: handleGalleryUpload,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] },
    maxFiles: 10,
  });

  const toggleFeatured = (id: string) => {
    setGalleryPhotos(prev =>
      prev.map(photo =>
        photo.id === id ? { ...photo, featured: !photo.featured } : photo
      )
    );
  };

  const deletePhoto = (id: string) => {
    setGalleryPhotos(prev => prev.filter(photo => photo.id !== id));
    setDeleteDialog({ open: false, type: '', id: '' });
    toast({
      title: "✅ Eliminada",
      description: "Foto eliminada de la galería",
    });
  };

  const handlePhotoDragStart = (index: number) => {
    setDraggedItem(index);
  };

  const handlePhotoDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedItem === null || draggedItem === index) return;

    const newPhotos = [...galleryPhotos];
    const draggedPhoto = newPhotos[draggedItem];
    newPhotos.splice(draggedItem, 1);
    newPhotos.splice(index, 0, draggedPhoto);

    setGalleryPhotos(newPhotos);
    setDraggedItem(index);
  };

  const handlePhotoDragEnd = () => {
    setDraggedItem(null);
  };

  const saveGallery = async () => {
    setLoading(true);
    try {
      await presskitService.updateConfig({
        gallery_photos: galleryPhotos,
      });

      // Update ContentContext - convert to simple format
      const simplePhotos = galleryPhotos.map(photo => ({
        src: photo.src,
        alt: photo.alt,
        featured: photo.featured,
      }));
      updateContent({ galleryPhotos: simplePhotos });

      toast({
        title: "✅ Guardado",
        description: "Cambios en Galería guardados exitosamente",
      });
    } catch (error) {
      toast({
        title: "❌ Error",
        description: "No se pudieron guardar los cambios",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // VIDEOS SECTION
  const extractYouTubeId = (url: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i,
      /^([^"&?\/\s]{11})$/
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
        title: "⚠️ Campos incompletos",
        description: "Debes ingresar título y URL",
        variant: "destructive",
      });
      return;
    }

    const videoId = extractYouTubeId(newVideo.url);
    if (!videoId) {
      toast({
        title: "⚠️ URL inválida",
        description: "No se pudo extraer el ID del video de YouTube",
        variant: "destructive",
      });
      return;
    }

    const video: Video = {
      id: crypto.randomUUID(),
      title: newVideo.title,
      embedUrl: `https://www.youtube.com/embed/${videoId}`,
    };

    setVideos(prev => [...prev, video]);
    setNewVideo({ title: '', url: '' });

    toast({
      title: "✅ Video agregado",
      description: "Nuevo video añadido a la lista",
    });
  };

  const deleteVideo = (id: string) => {
    setVideos(prev => prev.filter(video => video.id !== id));
    setDeleteDialog({ open: false, type: '', id: '' });
    toast({
      title: "✅ Eliminado",
      description: "Video eliminado de la lista",
    });
  };

  const handleVideoDragStart = (index: number) => {
    setDraggedItem(index);
  };

  const handleVideoDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedItem === null || draggedItem === index) return;

    const newVideos = [...videos];
    const draggedVideo = newVideos[draggedItem];
    newVideos.splice(draggedItem, 1);
    newVideos.splice(index, 0, draggedVideo);

    setVideos(newVideos);
    setDraggedItem(index);
  };

  const handleVideoDragEnd = () => {
    setDraggedItem(null);
  };

  const saveVideos = async () => {
    setLoading(true);
    try {
      await presskitService.updateConfig({
        videos: videos,
      });

      updateContent({ videos });

      toast({
        title: "✅ Guardado",
        description: "Cambios en Videos guardados exitosamente",
      });
    } catch (error) {
      toast({
        title: "❌ Error",
        description: "No se pudieron guardar los cambios",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // SOCIAL LINKS SECTION
  const addSocialLink = () => {
    if (!newSocial.platform || !newSocial.url) {
      toast({
        title: "⚠️ Campos incompletos",
        description: "Debes ingresar plataforma y URL",
        variant: "destructive",
      });
      return;
    }

    // Basic URL validation
    try {
      new URL(newSocial.url);
    } catch {
      toast({
        title: "⚠️ URL inválida",
        description: "La URL ingresada no es válida",
        variant: "destructive",
      });
      return;
    }

    setSocialLinks(prev => [...prev, { ...newSocial }]);
    setNewSocial({ platform: '', url: '' });

    toast({
      title: "✅ Red social agregada",
      description: "Nueva red social añadida a la lista",
    });
  };

  const deleteSocialLink = (index: number) => {
    setSocialLinks(prev => prev.filter((_, i) => i !== index));
    setDeleteDialog({ open: false, type: '', id: '' });
    toast({
      title: "✅ Eliminada",
      description: "Red social eliminada de la lista",
    });
  };

  const saveSocialLinks = async () => {
    setLoading(true);
    try {
      await presskitService.updateConfig({
        social_links: socialLinks,
      });

      updateContent({ socialLinks });

      toast({
        title: "✅ Guardado",
        description: "Cambios en Redes Sociales guardados exitosamente",
      });
    } catch (error) {
      toast({
        title: "❌ Error",
        description: "No se pudieron guardar los cambios",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardHeader>
            <CardTitle>🔐 Panel de Administración</CardTitle>
            <CardDescription>Ingresa tus credenciales para continuar</CardDescription>
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
                <Button type="submit" className="flex-1" disabled={loading}>
                  {loading ? 'Autenticando...' : 'Ingresar'}
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

  // Main Admin Panel
  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex">
      {/* Sidebar */}
      <div className="w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col">
        <div className="p-6 border-b border-zinc-800">
          <h2 className="text-xl font-bold text-white">Admin Panel</h2>
          <p className="text-sm text-zinc-400">Gestión de contenido</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <Button
            variant={currentTab === 'hero' ? 'default' : 'ghost'}
            className="w-full justify-start"
            onClick={() => setCurrentTab('hero')}
          >
            <Home className="mr-2 h-4 w-4" />
            Hero
          </Button>
          <Button
            variant={currentTab === 'bio' ? 'default' : 'ghost'}
            className="w-full justify-start"
            onClick={() => setCurrentTab('bio')}
          >
            <FileText className="mr-2 h-4 w-4" />
            Biografía
          </Button>
          <Button
            variant={currentTab === 'gallery' ? 'default' : 'ghost'}
            className="w-full justify-start"
            onClick={() => setCurrentTab('gallery')}
          >
            <ImageIcon className="mr-2 h-4 w-4" />
            Galería
          </Button>
          <Button
            variant={currentTab === 'videos' ? 'default' : 'ghost'}
            className="w-full justify-start"
            onClick={() => setCurrentTab('videos')}
          >
            <Video className="mr-2 h-4 w-4" />
            Videos
          </Button>
          <Button
            variant={currentTab === 'social' ? 'default' : 'ghost'}
            className="w-full justify-start"
            onClick={() => setCurrentTab('social')}
          >
            <Share2 className="mr-2 h-4 w-4" />
            Redes Sociales
          </Button>
        </nav>

        <div className="p-4 border-t border-zinc-800 space-y-2">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Cerrar Sesión
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={onClose}
          >
            <X className="mr-2 h-4 w-4" />
            Cerrar Panel
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <ScrollArea className="flex-1 p-8">
          {/* HERO TAB */}
          {currentTab === 'hero' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Hero Section</h1>
                <p className="text-zinc-400">Edita los textos e imagen de fondo de la sección principal</p>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Textos</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="hero-title">Título</Label>
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
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Imagen de Fondo</CardTitle>
                  <CardDescription>Arrastra una imagen o haz clic para subir</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {heroData.backgroundImage && (
                    <div className="relative aspect-video rounded-lg overflow-hidden bg-zinc-900">
                      <img
                        src={heroData.backgroundImage}
                        alt="Hero background"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div
                    {...heroDropzone.getRootProps()}
                    className="border-2 border-dashed border-zinc-700 rounded-lg p-8 text-center cursor-pointer hover:border-zinc-500 transition-colors"
                  >
                    <input {...heroDropzone.getInputProps()} />
                    <Upload className="mx-auto h-12 w-12 text-zinc-500 mb-4" />
                    <p className="text-zinc-400">
                      {heroDropzone.isDragActive
                        ? 'Suelta la imagen aquí'
                        : 'Arrastra una imagen o haz clic para seleccionar'}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Button onClick={saveHero} disabled={loading} className="w-full" size="lg">
                {loading ? 'Guardando...' : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Guardar Cambios en Hero
                  </>
                )}
              </Button>
            </div>
          )}

          {/* BIO TAB */}
          {currentTab === 'bio' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Biografía</h1>
                <p className="text-zinc-400">Edita los textos e imagen de tu biografía</p>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Título</CardTitle>
                </CardHeader>
                <CardContent>
                  <Input
                    value={bioData.title}
                    onChange={(e) => setBioData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Acerca de CROIX"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Imagen de Biografía</CardTitle>
                  <CardDescription>Arrastra una imagen o haz clic para subir</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {bioData.image && (
                    <div className="relative aspect-video rounded-lg overflow-hidden bg-zinc-900">
                      <img
                        src={bioData.image}
                        alt="Bio"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div
                    {...bioDropzone.getRootProps()}
                    className="border-2 border-dashed border-zinc-700 rounded-lg p-8 text-center cursor-pointer hover:border-zinc-500 transition-colors"
                  >
                    <input {...bioDropzone.getInputProps()} />
                    <Upload className="mx-auto h-12 w-12 text-zinc-500 mb-4" />
                    <p className="text-zinc-400">
                      {bioDropzone.isDragActive
                        ? 'Suelta la imagen aquí'
                        : 'Arrastra una imagen o haz clic para seleccionar'}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Párrafos</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="bio-p1">Párrafo 1</Label>
                    <Textarea
                      id="bio-p1"
                      value={bioData.paragraph1}
                      onChange={(e) => setBioData(prev => ({ ...prev, paragraph1: e.target.value }))}
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio-p2">Párrafo 2</Label>
                    <Textarea
                      id="bio-p2"
                      value={bioData.paragraph2}
                      onChange={(e) => setBioData(prev => ({ ...prev, paragraph2: e.target.value }))}
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio-p3">Párrafo 3</Label>
                    <Textarea
                      id="bio-p3"
                      value={bioData.paragraph3}
                      onChange={(e) => setBioData(prev => ({ ...prev, paragraph3: e.target.value }))}
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio-p4">Párrafo 4</Label>
                    <Textarea
                      id="bio-p4"
                      value={bioData.paragraph4}
                      onChange={(e) => setBioData(prev => ({ ...prev, paragraph4: e.target.value }))}
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              <Button onClick={saveBio} disabled={loading} className="w-full" size="lg">
                {loading ? 'Guardando...' : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Guardar Cambios en Biografía
                  </>
                )}
              </Button>
            </div>
          )}

          {/* GALLERY TAB */}
          {currentTab === 'gallery' && (
            <div className="max-w-6xl mx-auto space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Galería de Fotos</h1>
                <p className="text-zinc-400">Gestiona las fotos de tu galería. Arrastra para reordenar.</p>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Subir Nuevas Fotos</CardTitle>
                  <CardDescription>Puedes subir múltiples fotos a la vez</CardDescription>
                </CardHeader>
                <CardContent>
                  <div
                    {...galleryDropzone.getRootProps()}
                    className="border-2 border-dashed border-zinc-700 rounded-lg p-8 text-center cursor-pointer hover:border-zinc-500 transition-colors"
                  >
                    <input {...galleryDropzone.getInputProps()} />
                    <Upload className="mx-auto h-12 w-12 text-zinc-500 mb-4" />
                    <p className="text-zinc-400">
                      {galleryDropzone.isDragActive
                        ? 'Suelta las imágenes aquí'
                        : 'Arrastra imágenes o haz clic para seleccionar (máx. 10)'}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Fotos Actuales ({galleryPhotos.length})</CardTitle>
                  <CardDescription>Arrastra las fotos para reordenar. Usa ⭐ para marcar como destacada.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {galleryPhotos.map((photo, index) => (
                      <div
                        key={photo.id}
                        draggable
                        onDragStart={() => handlePhotoDragStart(index)}
                        onDragOver={(e) => handlePhotoDragOver(e, index)}
                        onDragEnd={handlePhotoDragEnd}
                        className={`relative group cursor-move bg-zinc-900 rounded-lg overflow-hidden border-2 ${
                          photo.featured ? 'border-yellow-500' : 'border-transparent'
                        } ${draggedItem === index ? 'opacity-50' : ''}`}
                      >
                        <div className="absolute top-2 left-2 z-10">
                          <GripVertical className="h-5 w-5 text-white drop-shadow-lg" />
                        </div>
                        <div className="absolute top-2 right-2 z-10 flex gap-1">
                          <Button
                            size="icon"
                            variant={photo.featured ? 'default' : 'secondary'}
                            className="h-8 w-8"
                            onClick={() => toggleFeatured(photo.id)}
                          >
                            <Star className={`h-4 w-4 ${photo.featured ? 'fill-current' : ''}`} />
                          </Button>
                          <Button
                            size="icon"
                            variant="destructive"
                            className="h-8 w-8"
                            onClick={() => setDeleteDialog({ open: true, type: 'photo', id: photo.id })}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="aspect-square">
                          <img
                            src={photo.src}
                            alt={photo.alt}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-2 bg-zinc-900/90">
                          <Badge variant="outline" className="text-xs">
                            {photo.category}
                          </Badge>
                          <p className="text-xs text-zinc-400 mt-1 truncate">{photo.alt}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  {galleryPhotos.length === 0 && (
                    <p className="text-center text-zinc-500 py-12">
                      No hay fotos en la galería. Sube algunas para comenzar.
                    </p>
                  )}
                </CardContent>
              </Card>

              <Button onClick={saveGallery} disabled={loading} className="w-full" size="lg">
                {loading ? 'Guardando...' : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Guardar Cambios en Galería
                  </>
                )}
              </Button>
            </div>
          )}

          {/* VIDEOS TAB */}
          {currentTab === 'videos' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Videos YouTube</h1>
                <p className="text-zinc-400">Gestiona los videos de YouTube. Arrastra para reordenar.</p>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Agregar Nuevo Video</CardTitle>
                  <CardDescription>Ingresa el título y URL de YouTube</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="video-title">Título</Label>
                    <Input
                      id="video-title"
                      value={newVideo.title}
                      onChange={(e) => setNewVideo(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Nombre del video o set"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="video-url">URL de YouTube</Label>
                    <Input
                      id="video-url"
                      value={newVideo.url}
                      onChange={(e) => setNewVideo(prev => ({ ...prev, url: e.target.value }))}
                      placeholder="https://www.youtube.com/watch?v=..."
                    />
                  </div>
                  <Button onClick={addVideo} className="w-full">
                    <Plus className="mr-2 h-4 w-4" />
                    Agregar Video
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Videos Actuales ({videos.length})</CardTitle>
                  <CardDescription>Arrastra los videos para reordenar</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {videos.map((video, index) => (
                    <div
                      key={video.id}
                      draggable
                      onDragStart={() => handleVideoDragStart(index)}
                      onDragOver={(e) => handleVideoDragOver(e, index)}
                      onDragEnd={handleVideoDragEnd}
                      className={`flex items-center gap-3 p-4 bg-zinc-900 rounded-lg border border-zinc-800 cursor-move ${
                        draggedItem === index ? 'opacity-50' : ''
                      }`}
                    >
                      <GripVertical className="h-5 w-5 text-zinc-500" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-white truncate">{video.title}</p>
                        <p className="text-sm text-zinc-500 truncate">{video.embedUrl}</p>
                      </div>
                      <Button
                        size="icon"
                        variant="destructive"
                        onClick={() => setDeleteDialog({ open: true, type: 'video', id: video.id })}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  {videos.length === 0 && (
                    <p className="text-center text-zinc-500 py-12">
                      No hay videos agregados. Agrega algunos para comenzar.
                    </p>
                  )}
                </CardContent>
              </Card>

              <Button onClick={saveVideos} disabled={loading} className="w-full" size="lg">
                {loading ? 'Guardando...' : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Guardar Cambios en Videos
                  </>
                )}
              </Button>
            </div>
          )}

          {/* SOCIAL LINKS TAB */}
          {currentTab === 'social' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Redes Sociales</h1>
                <p className="text-zinc-400">Gestiona tus enlaces a redes sociales</p>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Agregar Nueva Red Social</CardTitle>
                  <CardDescription>Ingresa el nombre de la plataforma y la URL</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="social-platform">Plataforma</Label>
                    <Input
                      id="social-platform"
                      value={newSocial.platform}
                      onChange={(e) => setNewSocial(prev => ({ ...prev, platform: e.target.value }))}
                      placeholder="Instagram, Twitter, Facebook..."
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
                  <Button onClick={addSocialLink} className="w-full">
                    <Plus className="mr-2 h-4 w-4" />
                    Agregar Red Social
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Redes Sociales Actuales ({socialLinks.length})</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {socialLinks.map((link, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-4 bg-zinc-900 rounded-lg border border-zinc-800"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-white">{link.platform}</p>
                        <a 
                          href={link.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-blue-400 hover:underline truncate block"
                        >
                          {link.url}
                        </a>
                      </div>
                      <Button
                        size="icon"
                        variant="destructive"
                        onClick={() => setDeleteDialog({ open: true, type: 'social', id: index.toString() })}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  {socialLinks.length === 0 && (
                    <p className="text-center text-zinc-500 py-12">
                      No hay redes sociales agregadas. Agrega algunas para comenzar.
                    </p>
                  )}
                </CardContent>
              </Card>

              <Button onClick={saveSocialLinks} disabled={loading} className="w-full" size="lg">
                {loading ? 'Guardando...' : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Guardar Cambios en Redes Sociales
                  </>
                )}
              </Button>
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialog.open} onOpenChange={(open) => !open && setDeleteDialog({ open: false, type: '', id: '' })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente{' '}
              {deleteDialog.type === 'photo' && 'esta foto de la galería'}
              {deleteDialog.type === 'video' && 'este video de la lista'}
              {deleteDialog.type === 'social' && 'esta red social de la lista'}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteDialog.type === 'photo') deletePhoto(deleteDialog.id);
                if (deleteDialog.type === 'video') deleteVideo(deleteDialog.id);
                if (deleteDialog.type === 'social') deleteSocialLink(parseInt(deleteDialog.id));
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminPanel;
