import { useRef } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useContent } from '@/contexts/ContentContext';

interface PDFGeneratorProps {
  className?: string;
}

// Función auxiliar para obtener colores de plataformas sociales
const getSocialColor = (platform: string): string => {
  const platformLower = platform.toLowerCase();
  switch (platformLower) {
    case 'instagram': return '#E4405F';
    case 'spotify': return '#1DB954';
    case 'soundcloud': return '#FF5500';
    case 'youtube': return '#FF0000';
    case 'bandcamp': return '#629AA0';
    case 'beatport': return '#01FF95';
    case 'apple music': return '#000000';
    case 'tidal': return '#0094FF';
    case 'facebook': return '#1877F2';
    case 'twitter': return '#1DA1F2';
    case 'tiktok': return '#000000';
    case 'linkedin': return '#0077B5';
    default: return '#6B7280';
  }
};

export const PDFGenerator = ({ className }: PDFGeneratorProps) => {
  const { content } = useContent();
  const pdfRef = useRef<HTMLDivElement>(null);

  const generatePDF = async () => {
    if (!pdfRef.current) return;

    try {
      // Crear el canvas desde el HTML
      const canvas = await html2canvas(pdfRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: 800,
        height: pdfRef.current.scrollHeight
      });

      // Configurar el PDF
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      // Agregar la primera página
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Agregar páginas adicionales si es necesario
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Descargar el PDF
      pdf.save('CROIX_Press_Kit.pdf');
    } catch (error) {
      console.error('Error generando PDF:', error);
    }
  };

  return (
    <>
      {/* Botón para generar PDF */}
      <Button
        onClick={generatePDF}
        className={`flex items-center gap-2 ${className}`}
        variant="outline"
      >
        <Download className="w-4 h-4" />
        Descargar Press Kit PDF
      </Button>

      {/* Contenido oculto para generar el PDF */}
      <div
        ref={pdfRef}
        className="fixed -left-[9999px] top-0 w-[800px] bg-white text-black p-8 font-sans"
        style={{ fontFamily: 'Arial, sans-serif' }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 text-gray-900">
            {content.heroData.title}
          </h1>
          <h2 className="text-xl text-gray-600 mb-1">
            {content.heroData.subtitle}
          </h2>
          <p className="text-lg text-gray-700">
            {content.heroData.description1}
          </p>
          <p className="text-base text-gray-600">
            {content.heroData.description2}
          </p>
        </div>

        {/* Biografía */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold mb-4 text-gray-900 border-b-2 border-gray-300 pb-2">
            {content.bioData.title}
          </h3>
          <div className="space-y-4 text-sm leading-relaxed text-gray-800">
            <p>{content.bioData.paragraph1}</p>
            <p>{content.bioData.paragraph2}</p>
            <p>{content.bioData.paragraph3}</p>
            <p>{content.bioData.paragraph4}</p>
          </div>
        </div>

        {/* Fotos de Prensa */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold mb-4 text-gray-900 border-b-2 border-gray-300 pb-2">
            Fotos de Prensa
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {content.galleryPhotos.slice(0, 4).map((photo, index) => (
              <div key={index} className="text-center">
                <img
                  src={photo.src}
                  alt={photo.alt}
                  className="w-full h-48 object-cover rounded border shadow-sm"
                  style={{ maxWidth: '100%', height: 'auto' }}
                />
                <p className="text-xs text-gray-600 mt-1">{photo.alt}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-4 text-center">
            Fotos en alta resolución disponibles para descarga en: [URL del sitio web]
          </p>
        </div>

        {/* Videos */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold mb-4 text-gray-900 border-b-2 border-gray-300 pb-2">
            Videos en Vivo
          </h3>
          <div className="space-y-3">
            {content.videos.map((video, index) => (
              <div key={index} className="border-l-4 border-gray-400 pl-4">
                <h4 className="font-semibold text-gray-900">{video.title}</h4>
                <p className="text-sm text-gray-600">{video.description}</p>
                <p className="text-xs text-blue-600">
                  https://youtube.com/watch?v={video.id}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Redes Sociales */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold mb-4 text-gray-900 border-b-2 border-gray-300 pb-2">
            Redes Sociales y Links
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {content.socialLinks.map((link, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <div 
                  className="w-5 h-5 rounded"
                  style={{ backgroundColor: getSocialColor(link.platform) }}
                >
                  <span className="text-white text-xs font-bold flex items-center justify-center h-full">
                    {link.platform.charAt(0)}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-900">{link.platform}:</span>
                  <br />
                  <span className="text-blue-600 text-xs break-all">{link.url}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center pt-4 border-t border-gray-300">
          <p className="text-sm text-gray-600">
            Press Kit generado el {new Date().toLocaleDateString('es-ES')}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Para más información y contenido actualizado, visita nuestro sitio web oficial
          </p>
        </div>
      </div>
    </>
  );
};
