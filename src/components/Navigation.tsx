import { useState, useEffect } from "react";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavigationProps {
  onOpenAdmin: () => void;
}

const Navigation = ({ onOpenAdmin }: NavigationProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
      
      // Update active section based on scroll position
      const sections = ["hero", "bio", "photos", "video-sets", "contact"];
      const current = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 200 && rect.bottom >= 200;
        }
        return false;
      });
      
      if (current) {
        setActiveSection(current);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const navItems = [
    { id: "hero", label: "Inicio" },
    { id: "bio", label: "Bio" },
    { id: "photos", label: "Fotos" },
    { id: "video-sets", label: "Sets" },
    { id: "contact", label: "Contacto" }
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? "bg-background/95 backdrop-blur-md border-b border-border/50" 
        : "bg-transparent"
    }`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="font-display font-bold text-xl cursor-pointer"
            onClick={() => scrollToSection("hero")}
          >
            <span className="text-brand-teal">CROIX</span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`font-medium transition-colors duration-200 ${
                  activeSection === item.id
                    ? "text-brand-teal"
                    : "text-text-secondary hover:text-foreground"
                }`}
              >
                {item.label}
              </button>
            ))}
            
            {/* Admin Button - Discreto */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onOpenAdmin}
              className="opacity-50 hover:opacity-100 transition-opacity"
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-foreground">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;