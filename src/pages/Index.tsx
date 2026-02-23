import { useState } from "react";
import Navigation from "../components/Navigation";
import Hero from "../components/Hero";
import Bio from "../components/Bio";
import PhotoGallery from "../components/PhotoGallery";
import VideoSets from "../components/VideoSets";
import TechnicalRider from "../components/TechnicalRider";
import Footer from "../components/Footer";
import AdminPanel from "../components/AdminPanel";

const Index = () => {
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation onOpenAdmin={() => setIsAdminOpen(true)} />
      
      <main>
        <section id="hero">
          <Hero />
        </section>
        
        <section id="bio">
          <Bio />
        </section>
        
        <section id="photos">
          <PhotoGallery />
        </section>
        
        <section id="video-sets">
          <VideoSets />
        </section>
        
        <section id="contact">
          <TechnicalRider />
        </section>
      </main>
      
      <Footer />
      
      {/* Admin Panel */}
      <AdminPanel 
        isOpen={isAdminOpen} 
        onClose={() => setIsAdminOpen(false)} 
      />
    </div>
  );
};

export default Index;
