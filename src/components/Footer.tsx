import { useState } from "react";
import AdminPanel from "./AdminPanel";
import { SocialLinks } from "@/components/ui/social-icons";
import { useContent } from "@/contexts/ContentContext";

const Footer = () => {
  const [showAdmin, setShowAdmin] = useState(false);
  const { content } = useContent();

  return (
    <>
      <AdminPanel isOpen={showAdmin} onClose={() => setShowAdmin(false)} />
    <footer className="bg-brand-darker py-12 border-t border-border">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-8 text-center md:text-left">
          {/* Brand */}
          <div className="space-y-4">
            <div className="font-display font-bold text-2xl">
              <span className="text-brand-teal">CROIX</span>
            </div>
            <p className="text-text-muted">
              DJ y Productor Chileno
              <br />
              Underground Techno • Oetraxxrecords
            </p>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-display font-semibold text-foreground">Contacto</h3>
            <div className="space-y-2 text-text-secondary">
              <p>Reservas y Management</p>
              <a 
                href="mailto:tucroixdj@gmail.com"
                className="text-brand-teal hover:text-brand-teal-dark transition-colors"
              >
                tucroixdj@gmail.com
              </a>
            </div>
            <div className="mt-4">
              <SocialLinks 
                links={content.socialLinks} 
                size="sm"
                className="justify-center md:justify-start"
              />
            </div>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h3 className="font-display font-semibold text-foreground">Press Kit</h3>
            <div className="space-y-2 text-text-secondary text-sm">
              <p>Todos los materiales de prensa disponibles para uso editorial</p>
              <p>© 2024 CROIX. Todos los derechos reservados.</p>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border text-center">
          <p className="text-text-muted text-sm">
            Kit de Prensa Electrónico • Diseñado para Profesionales de Medios e Industria
          </p>
          <div className="mt-4 opacity-30 hover:opacity-100 transition-opacity">
            <button 
              onClick={() => setShowAdmin(true)}
              className="text-xs text-text-muted hover:text-brand-teal transition-colors"
              title="Panel de Administración"
            >
              •
            </button>
          </div>
        </div>
      </div>
    </footer>
    </>
  );
};

export default Footer;