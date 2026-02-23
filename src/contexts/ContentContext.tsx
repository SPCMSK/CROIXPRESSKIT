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
    backgroundImage: "/PRESKIT MATERIAL/fotos croix/DJ/1.jpeg"
  },
  bioData: {
    title: "Acerca de CROIX",
    image: "/PRESKIT MATERIAL/fotos croix/DJ/2.jpeg",
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
          const loadedContent: ContentData = {
            heroData: {
              title: config.hero_data.title,
              subtitle: config.hero_data.subtitle,
              description1: config.hero_data.description1,
              description2: config.hero_data.description2,
              backgroundImage: config.hero_data.background_image || defaultContent.heroData.backgroundImage
            },
            bioData: {
              title: config.bio_data.title,
              image: config.bio_data.image || defaultContent.bioData.image,
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
            videos: config.videos || defaultContent.videos
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