import { useContent } from "@/contexts/ContentContext";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

const PhotoGallery = () => {
  const { content } = useContent();

  const handleDownload = async (imageUrl: string, imageName: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${imageName.replace(/\s+/g, '_')}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      // Fallback: open image in new tab
      window.open(imageUrl, '_blank');
    }
  };

  return (
    <section className="py-20 bg-card">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-display font-bold text-4xl md:text-5xl text-foreground mb-4">
            Press <span className="text-brand-teal">Photos</span>
          </h2>
          <div className="w-20 h-1 bg-brand-teal rounded-full mx-auto mb-6"></div>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Fotos de prensa en alta resolución disponibles para descarga. Todas las imágenes están autorizadas para uso editorial.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {content.galleryPhotos.map((photo, index) => (
            <div 
              key={index}
              className={`relative group overflow-hidden rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-glow ${
                photo.featured ? 'md:col-span-2 lg:col-span-1' : ''
              }`}
            >
              <div className="aspect-[4/5] relative overflow-hidden">
                <img 
                  src={photo.src}
                  alt={photo.alt}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Download overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button
                    onClick={() => handleDownload(photo.src, photo.alt)}
                    className="bg-brand-teal/90 hover:bg-brand-teal text-brand-darker rounded-full p-3 backdrop-blur-sm"
                    size="icon"
                  >
                    <Download className="w-5 h-5" />
                  </Button>
                </div>
              </div>
              
              {photo.featured && (
                <div className="absolute top-4 left-4">
                  <span className="bg-brand-teal text-brand-darker px-3 py-1 rounded-full text-sm font-medium">
                    Destacada
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-text-muted text-sm">
            Haz clic en cualquier imagen para descargar la versión en alta resolución • Todas las fotos por CROIX Press Team
          </p>
        </div>
      </div>
    </section>
  );
};

export default PhotoGallery;