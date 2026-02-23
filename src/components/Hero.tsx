import { Button } from "@/components/ui/button";
import { useContent } from "@/contexts/ContentContext";

const Hero = () => {
  const { content } = useContent();
  
  return (
    <section className="min-h-screen relative flex items-center justify-center bg-gradient-dark overflow-hidden">
      {/* Background Image */}
      <div 
        key={content.heroData.backgroundImage}
        className="absolute inset-0 bg-cover bg-no-repeat opacity-40"
        style={{
          backgroundImage: `url('${content.heroData.backgroundImage}')`,
          backgroundPosition: '50% 30%'
        }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-overlay" />
      
      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
        <div className="space-y-8">
          <div className="space-y-4">
            <h1 className="font-display font-black text-6xl md:text-8xl lg:text-9xl leading-none">
              <span className="text-brand-teal">{content.heroData.title}</span>
            </h1>
            <div className="text-brand-teal font-display font-medium text-xl md:text-2xl tracking-widest uppercase">
              {content.heroData.subtitle}
            </div>
          </div>
          
          <div className="space-y-2">
            <p className="text-text-secondary font-medium text-lg md:text-xl">
              {content.heroData.description1}
            </p>
            <p className="text-text-muted text-base md:text-lg">
              {content.heroData.description2}
            </p>
          </div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-brand-teal animate-bounce">
        <div className="w-6 h-10 border-2 border-brand-teal rounded-full flex justify-center">
          <div className="w-1 h-3 bg-brand-teal rounded-full mt-2"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;