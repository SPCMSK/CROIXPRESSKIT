import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { presskitService } from '@/lib/supabase';

interface ContentData {
  heroData: {
    title: string;
    subtitle: string;
    description1: string;
    description2: string;
    backgroundImage: string;
  };
  bioData: {
    title: string;
    image: string;
    paragraph1: string;
    paragraph2: string;
    paragraph3: string;
    paragraph4: string;
  };
  galleryPhotos: Array<{
    src: string;
    alt: string;
    featured: boolean;
  }>;
  socialLinks: Array<{
    platform: string;
    url: string;
  }>;
  videos: Array<{
    id: string;
    title: string;
    embedUrl: string;
    description?: string;
  }>;
  releases: Array<{
    id: string;
    title: string;
    coverImage: string;
    category: 'own' | 'remix' | 'va';
    label?: string;
    link?: string;
  }>;
}

interface ContentContextType {
  content: ContentData;
  updateContent: (newContent: Partial<ContentData>) => void;
  isLoading: boolean;
}

const defaultContent: ContentData = {
  heroData: {
    title: "CROIX",
    subtitle: "Electronic Press Kit",
    description1: "DJ y Productor Chileno",
    description2: "Underground Techno • Oetraxxrecords",
    backgroundImage: "/PRESKIT MATERIAL/fotos croix/estudio/Fotos Croix _10.JPG"
  },
  bioData: {
    title: "Acerca de CROIX",
    image: "/PRESKIT MATERIAL/fotos croix/estudio/Fotos Croix _2.JPG",
    paragraph1: "**Croix** es un DJ y productor chileno que se ha convertido en una figura esencial del **techno underground e irreverente**. Fundador del sello **Oetraxxrecords**, su sonido se define por una **energía inagotable** y un uso audaz del sampling diseñado para el clímax de la pista.",
    paragraph2: "Su prolífica carrera en el estudio cuenta con lanzamientos en sellos internacionales y nacionales de renombre, destacando trabajos como el **Hot Rhythms EP** en **SpaceRecords**, **Calentando EP** en **Gruvalismo**, **Sustancia EP** en **KRAFT.rec**, y su track **Worker** bajo el sello **[One:Thirty]**.",
    paragraph3: "Más allá de sus lanzamientos en solitario, Croix ha dejado su marca en importantes compilados de varios artistas (VA), incluyendo **NASTY TRAX VOL.6** (con su track Acid Work), **ONE THIRTY Vol. 2**, **PHANTASOS 03** de **Oneiros Records**, e inicios potentes en los primeros volúmenes de **IMPCORE Records** y **KEEPISTFAST**.",
    paragraph4: "Su faceta colaborativa es igualmente sólida, destacando su trabajo constante con **TeeHC** en su propio sello, colaboraciones con **Jarod Beyzaga**, el lanzamiento **CCXXXIX** en **Obscur** junto a **Malisan**, y su reciente **Remix para el dúo francés Laddie** lanzado por **Lapsorecords**. Con una discografía en constante expansión, Croix garantiza una experiencia sónica cruda, técnica y de pura cultura de club."
  },
  galleryPhotos: [
    { src: "/PRESKIT MATERIAL/fotos croix/DJ/1.jpeg", alt: "CROIX DJ Set 1", featured: true },
    { src: "/PRESKIT MATERIAL/fotos croix/DJ/2.jpeg", alt: "CROIX DJ Set 2", featured: true },
    { src: "/PRESKIT MATERIAL/fotos croix/DJ/3.jpeg", alt: "CROIX DJ Set 3", featured: false },
    { src: "/PRESKIT MATERIAL/fotos croix/DJ/4.jpeg", alt: "CROIX DJ Set 4", featured: false },
    { src: "/PRESKIT MATERIAL/fotos croix/estudio/Fotos Croix _1.JPG", alt: "CROIX Estudio Portrait", featured: true },
    { src: "/PRESKIT MATERIAL/fotos croix/estudio/Fotos Croix _2.JPG", alt: "CROIX Estudio Session", featured: false },
    { src: "/PRESKIT MATERIAL/fotos croix/estudio/Fotos Croix _10.JPG", alt: "CROIX Studio Work", featured: false },
    { src: "/PRESKIT MATERIAL/fotos croix/estudio/Fotos Croix _18.JPG", alt: "CROIX Production", featured: false }
  ],
  socialLinks: [
    { platform: "Instagram", url: "https://www.instagram.com/croix__/" },
    { platform: "Spotify", url: "https://open.spotify.com/intl-es/artist/7H3B36EQXldij3pvfgeDQk?si=35otPVu3Tcu5DLp7fc0BzQ" },
    { platform: "SoundCloud", url: "https://soundcloud.com/c-roix" },
    { platform: "Beatport", url: "https://www.beatport.com/es/artist/croix/513368" },
    { platform: "Email", url: "mailto:tucroixdj@gmail.com" }
  ],
  videos: [
    {
      id: "hot-rhythms-ep",
      title: "CROIX - Hot Rhythms EP",
      embedUrl: "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/1736687936&color=%23ff00ff&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true",
      description: "Hot Rhythms EP • SpaceRecords"
    },
    {
      id: "calentando-ep", 
      title: "CROIX - Calentando EP",
      embedUrl: "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/1698160352&color=%23ff00ff&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true",
      description: "Calentando EP • Gruvalismo"
    }
  ],
  releases: [
    // Lanzamientos Propios
    { id: "1", title: "Calentando EP", coverImage: "/PRESKIT MATERIAL/LANZAMIENTOS MIOS/CALENTANDO EP IMAGEN.jpg", category: "own", label: "Gruvalismo", link: "" },
    { id: "2", title: "Calmao Noma", coverImage: "/PRESKIT MATERIAL/LANZAMIENTOS MIOS/CALMAO NOMA.jpg", category: "own", label: "", link: "" },
    { id: "3", title: "Corte Gostoso EP", coverImage: "/PRESKIT MATERIAL/LANZAMIENTOS MIOS/CORTE GOSTOSO EP.jpg", category: "own", label: "", link: "" },
    { id: "4", title: "Cover", coverImage: "/PRESKIT MATERIAL/LANZAMIENTOS MIOS/cover.png", category: "own", label: "", link: "" },
    { id: "5", title: "Baila Conmigo", coverImage: "/PRESKIT MATERIAL/LANZAMIENTOS MIOS/CROIX BAILA CONMIGO.jpg", category: "own", label: "", link: "" },
    { id: "6", title: "Hot Tools", coverImage: "/PRESKIT MATERIAL/LANZAMIENTOS MIOS/HOT TOOLS.jpg", category: "own", label: "", link: "" },
    { id: "7", title: "Sustancia EP", coverImage: "/PRESKIT MATERIAL/LANZAMIENTOS MIOS/sustancia.jpg", category: "own", label: "KRAFT.rec", link: "" },
    { id: "8", title: "Worker", coverImage: "/PRESKIT MATERIAL/LANZAMIENTOS MIOS/WORKER.webp", category: "own", label: "[One:Thirty]", link: "" },
    // Remixes
    { id: "9", title: "Laddie Remix", coverImage: "/PRESKIT MATERIAL/REMIX/laddie remix.jpg", category: "remix", label: "Lapsorecords", link: "" },
    // VA (Varios Artistas)
    { id: "10", title: "Keep It Fast", coverImage: "/PRESKIT MATERIAL/VA/keep it fast.jpeg", category: "va", label: "KEEPISTFAST", link: "" },
    { id: "11", title: "Nasty Trax Vol.6", coverImage: "/PRESKIT MATERIAL/VA/NASTY TRAX.jpg", category: "va", label: "Nasty Trax", link: "" },
    { id: "12", title: "Phantasos 03", coverImage: "/PRESKIT MATERIAL/VA/ONEIROS  VA.jpg", category: "va", label: "Oneiros Records", link: "" },
    { id: "13", title: "Sum VA", coverImage: "/PRESKIT MATERIAL/VA/PORTADA SUM VA.jpg", category: "va", label: "", link: "" },
    { id: "14", title: "One Thirty Vol. 2", coverImage: "/PRESKIT MATERIAL/VA/VA ONE THRITY.webp", category: "va", label: "[One:Thirty]", link: "" },
  ]
};

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const ContentProvider = ({ children }: { children: ReactNode }) => {
  const [content, setContent] = useState<ContentData>(defaultContent);
  const [isLoading, setIsLoading] = useState(true);

  // Load content from Supabase on mount
  useEffect(() => {
    const loadContentFromSupabase = async () => {
      console.log('🔄 Cargando contenido desde Supabase...');
      setIsLoading(true);
      
      try {
        const config = await presskitService.getConfig();
        
        if (config) {
          console.log('✅ Contenido cargado desde Supabase');
          
          // Convertir formato Supabase a formato ContentContext
          // IMPORTANTE: Hero y Bio images SIEMPRE usan valores fijos de defaultContent
          const loadedContent: ContentData = {
            heroData: {
              title: config.hero_data.title,
              subtitle: config.hero_data.subtitle,
              description1: config.hero_data.description1,
              description2: config.hero_data.description2,
              backgroundImage: defaultContent.heroData.backgroundImage // SIEMPRE usa imagen fija
            },
            bioData: {
              title: config.bio_data.title,
              image: defaultContent.bioData.image, // SIEMPRE usa imagen fija
              paragraph1: config.bio_data.paragraph1,
              paragraph2: config.bio_data.paragraph2,
              paragraph3: config.bio_data.paragraph3,
              paragraph4: config.bio_data.paragraph4
            },
            galleryPhotos: config.gallery_photos?.map(photo => ({
              src: photo.src,
              alt: photo.alt,
              featured: photo.featured
            })) || defaultContent.galleryPhotos,
            socialLinks: config.social_links || defaultContent.socialLinks,
            videos: config.videos || defaultContent.videos,
            releases: config.releases || defaultContent.releases
          };
          
          setContent(loadedContent);
        } else {
          console.log('⚠️ No hay datos en Supabase, usando defaults');
          setContent(defaultContent);
        }
      } catch (error) {
        console.error('❌ Error cargando desde Supabase:', error);
        setContent(defaultContent);
      } finally {
        setIsLoading(false);
      }
    };

    loadContentFromSupabase();

    // Escuchar eventos de actualización del admin
    const handleAdminUpdate = () => {
      console.log('🔄 Admin actualizó contenido, recargando...');
      loadContentFromSupabase();
    };

    window.addEventListener('adminContentUpdated', handleAdminUpdate);

    return () => {
      window.removeEventListener('adminContentUpdated', handleAdminUpdate);
    };
  }, []);

  const updateContent = (newContent: Partial<ContentData>) => {
    setContent(prev => {
      const updated = { ...prev, ...newContent };
      console.log('📝 Actualizando contenido local:', newContent);
      
      // Disparar evento para que otros componentes se actualicen
      window.dispatchEvent(new Event('adminContentUpdated'));
      
      return updated;
    });
  };

  return (
    <ContentContext.Provider value={{ content, updateContent, isLoading }}>
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};
