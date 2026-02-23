import { useContent } from "@/contexts/ContentContext";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ExternalLink } from "lucide-react";

const Releases = () => {
  const { content, isLoading } = useContent();

  if (isLoading) {
    return (
      <section className="py-20 bg-background-subtle">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="animate-pulse text-brand-teal text-xl">Cargando lanzamientos...</div>
        </div>
      </section>
    );
  }

  // Agrupar releases por categoría
  const ownReleases = content.releases.filter(r => r.category === 'own');
  const remixes = content.releases.filter(r => r.category === 'remix');
  const vaReleases = content.releases.filter(r => r.category === 'va');

  return (
    <section className="py-20 bg-background-subtle">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="font-display font-bold text-4xl md:text-5xl text-foreground mb-4">
            Lanzamientos
          </h2>
          <div className="w-20 h-1 bg-brand-teal rounded-full mx-auto"></div>
        </div>

        {/* Lanzamientos Propios */}
        {ownReleases.length > 0 && (
          <div className="mb-16">
            <h3 className="font-display font-bold text-2xl md:text-3xl text-foreground mb-8 text-center">
              Lanzamientos Propios
            </h3>
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                {ownReleases.map((release, index) => (
                  <CarouselItem key={index} className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                    <Card className="bg-background-dark border-border hover:border-brand-teal transition-all duration-300 group">
                      <CardContent className="p-4">
                        <div className="aspect-square relative overflow-hidden rounded-lg mb-4">
                          <img
                            src={release.coverImage}
                            alt={release.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-display font-bold text-lg text-foreground group-hover:text-brand-teal transition-colors">
                            {release.title}
                          </h4>
                          {release.label && (
                            <p className="text-sm text-text-muted">{release.label}</p>
                          )}
                          {release.link && (
                            <a
                              href={release.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 text-sm text-brand-teal hover:underline"
                            >
                              Escuchar <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex" />
              <CarouselNext className="hidden md:flex" />
            </Carousel>
          </div>
        )}

        {/* Remixes */}
        {remixes.length > 0 && (
          <div className="mb-16">
            <h3 className="font-display font-bold text-2xl md:text-3xl text-foreground mb-8 text-center">
              Remixes
            </h3>
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                {remixes.map((release, index) => (
                  <CarouselItem key={index} className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                    <Card className="bg-background-dark border-border hover:border-brand-teal transition-all duration-300 group">
                      <CardContent className="p-4">
                        <div className="aspect-square relative overflow-hidden rounded-lg mb-4">
                          <img
                            src={release.coverImage}
                            alt={release.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-display font-bold text-lg text-foreground group-hover:text-brand-teal transition-colors">
                            {release.title}
                          </h4>
                          {release.label && (
                            <p className="text-sm text-text-muted">{release.label}</p>
                          )}
                          {release.link && (
                            <a
                              href={release.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 text-sm text-brand-teal hover:underline"
                            >
                              Escuchar <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex" />
              <CarouselNext className="hidden md:flex" />
            </Carousel>
          </div>
        )}

        {/* VA (Varios Artistas) */}
        {vaReleases.length > 0 && (
          <div>
            <h3 className="font-display font-bold text-2xl md:text-3xl text-foreground mb-8 text-center">
              Compilados VA
            </h3>
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                {vaReleases.map((release, index) => (
                  <CarouselItem key={index} className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                    <Card className="bg-background-dark border-border hover:border-brand-teal transition-all duration-300 group">
                      <CardContent className="p-4">
                        <div className="aspect-square relative overflow-hidden rounded-lg mb-4">
                          <img
                            src={release.coverImage}
                            alt={release.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-display font-bold text-lg text-foreground group-hover:text-brand-teal transition-colors">
                            {release.title}
                          </h4>
                          {release.label && (
                            <p className="text-sm text-text-muted">{release.label}</p>
                          )}
                          {release.link && (
                            <a
                              href={release.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 text-sm text-brand-teal hover:underline"
                            >
                              Escuchar <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex" />
              <CarouselNext className="hidden md:flex" />
            </Carousel>
          </div>
        )}
      </div>
    </section>
  );
};

export default Releases;
