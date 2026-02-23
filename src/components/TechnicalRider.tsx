import { useContent } from "@/contexts/ContentContext";
import { SocialLinks } from "@/components/ui/social-icons";

const TechnicalRider = () => {
  const { content } = useContent();
  const equipment = [
    {
      category: "CDJ Units",
      items: [
        "Mínimo 2 Pioneer CDJ-1000MK2",
        "Compatible con CDJ-3000/2000NX2/XDJ-1000"
      ]
    },
    {
      category: "Mixer",
      items: [
        "Pioneer DJM-750 (mínimo)",
        "Compatible: DJM-900NX2/V10/A9",
        "Xone 92/96",
        "RMX Pioneer (opcional)"
      ]
    },
    {
      category: "Monitoring",
      items: [
        "Sistema de Monitoreo de cabina",
        "Headphones output dedicado"
      ]
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Technical Rider */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="font-display font-bold text-4xl md:text-5xl text-foreground">
                Technical <span className="text-brand-teal">Rider</span>
              </h2>
              <div className="w-20 h-1 bg-brand-teal rounded-full"></div>
            </div>

            <div className="space-y-8">
              {equipment.map((section, index) => (
                <div key={index} className="space-y-4">
                  <h3 className="font-display font-semibold text-xl text-brand-teal uppercase tracking-wide">
                    {section.category}
                  </h3>
                  <div className="space-y-2">
                    {section.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-brand-teal rounded-full"></div>
                        <span className="text-text-secondary font-medium">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 bg-card rounded-xl border border-border">
              <h4 className="font-display font-semibold text-lg text-foreground mb-4">
                Requerimientos Adicionales
              </h4>
              <ul className="space-y-2 text-text-secondary">
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-brand-teal rounded-full"></div>
                  <span>Sistema de sonido profesional con potencia adecuada</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-brand-teal rounded-full"></div>
                  <span>Cabina de DJ dedicada con iluminación adecuada</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-brand-teal rounded-full"></div>
                  <span>Área segura para instalación de equipos</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Contact & Social */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="font-display font-bold text-4xl md:text-5xl text-foreground">
                Ponte en <span className="text-brand-teal">Contacto</span>
              </h2>
              <div className="w-20 h-1 bg-brand-teal rounded-full"></div>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <div className="p-6 bg-card rounded-xl border border-border">
              <h3 className="font-display font-semibold text-xl text-brand-teal mb-4">
                Reservas y Management
              </h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-brand-teal/20 rounded-full flex items-center justify-center">
                      <span className="text-brand-teal">📧</span>
                    </div>
                    <a 
                      href="mailto:tucroixdj@gmail.com"
                      className="text-foreground hover:text-brand-teal transition-colors font-medium"
                    >
                      tucroixdj@gmail.com
                    </a>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="p-6 bg-card rounded-xl border border-border">
                <h3 className="font-display font-semibold text-xl text-brand-teal mb-4">
                  Sígueme en Redes
                </h3>
                <SocialLinks 
                  links={content.socialLinks} 
                  size="md"
                  className="justify-center"
                />
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-card rounded-xl border border-border text-center">
                  <div className="text-2xl font-display font-bold text-brand-teal">🎛️</div>
                  <div className="text-text-muted text-sm">Underground</div>
                </div>
                <div className="p-4 bg-card rounded-xl border border-border text-center">
                  <div className="text-2xl font-display font-bold text-brand-teal">🔊</div>
                  <div className="text-text-muted text-sm">Techno</div>
                </div>
              </div>
            </div>

            {/* Performance Image */}
            <div className="relative rounded-xl overflow-hidden shadow-card">
              <img 
                src="/PRESKIT MATERIAL/fotos croix/DJ/3.jpeg"
                alt="CROIX Performance"
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent"></div>
              <div className="absolute bottom-4 left-4">
                <span className="bg-brand-teal text-brand-darker px-3 py-1 rounded-full text-sm font-medium">
                  Underground Vibes
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechnicalRider;