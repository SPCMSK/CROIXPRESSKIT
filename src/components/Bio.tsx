import { useContent } from "@/contexts/ContentContext";

const Bio = () => {
  const { content, isLoading } = useContent();
  
  if (isLoading) {
    return (
      <section className="py-20 bg-background">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="animate-pulse text-brand-teal text-xl">Cargando biografía...</div>
        </div>
      </section>
    );
  }
  
  return (
    <section className="py-20 bg-background">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Bio Text */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="font-display font-bold text-4xl md:text-5xl text-foreground">
                {content.bioData.title}
              </h2>
              <div className="w-20 h-1 bg-brand-teal rounded-full"></div>
            </div>
            
            <div className="space-y-6 text-text-secondary leading-relaxed">
              <p className="text-lg" dangerouslySetInnerHTML={{ 
                __html: content.bioData.paragraph1.replace(/\*\*(.*?)\*\*/g, '<strong class="text-brand-teal">$1</strong>') 
              }} />
              
              <p dangerouslySetInnerHTML={{ 
                __html: content.bioData.paragraph2.replace(/\*\*(.*?)\*\*/g, '<strong class="text-brand-teal">$1</strong>') 
              }} />
              
              <p dangerouslySetInnerHTML={{ 
                __html: content.bioData.paragraph3.replace(/\*\*(.*?)\*\*/g, '<strong class="text-brand-teal">$1</strong>') 
              }} />
              
              <p dangerouslySetInnerHTML={{ 
                __html: content.bioData.paragraph4.replace(/\*\*(.*?)\*\*/g, '<strong class="text-brand-teal">$1</strong>') 
              }} />
            </div>
          </div>
          
          {/* Bio Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-card">
              <img 
                src={content.bioData.image}
                alt="CROIX Portrait"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent"></div>
            </div>
          </div>
        </div>
        
        {/* Achievements */}
        <div className="mt-16 pt-16 border-t border-border">
          <div className="space-y-8">
            <h3 className="font-display font-bold text-2xl md:text-3xl text-foreground">
              Escena & Colaboraciones
            </h3>
            
            <div className="space-y-4 text-text-secondary">
              <p>
                Su presencia en la escena underground se extiende por festivales y eventos en el **norte de Chile** durante años nuevos, participando en **Nebula** y diversos eventos en la zona norte, mientras que en Santiago ha marcado territorio en **Matrix** y otros espacios emblemáticos de la cultura de club.
              </p>
              
              <p>
                Su catálogo discográfico abarca colaboraciones con sellos de renombre como <strong className="text-brand-teal">SpaceRecords, Gruvalismo, KRAFT.rec, One:Thirty, Oneiros Records, IMPCORE Records, KEEPISTFAST, Obscur y Lapsorecords</strong>, consolidando su presencia tanto nacional como internacional.
              </p>
              
              <p>
                Como **fundador de Oetraxxrecords**, Croix no solo impulsa su propia música sino que también se dedica a promover nuevos talentos del underground, manteniendo vivo el espíritu irreverente y la energía cruda que define la auténtica cultura de club.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Bio;