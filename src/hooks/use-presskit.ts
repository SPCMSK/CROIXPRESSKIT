import { useContent } from "@/contexts/ContentContext";

export const usePressKit = () => {
  const { content } = useContent();

  const generatePressKitData = () => {
    const pressKitData = {
      artist: content.heroData.title,
      subtitle: content.heroData.subtitle,
      bio: {
        title: content.bioData.title,
        text: [
          content.bioData.paragraph1,
          content.bioData.paragraph2,
          content.bioData.paragraph3,
          content.bioData.paragraph4
        ].filter(p => p.trim()).join('\n\n')
      },
      images: content.galleryPhotos.map((photo, index) => ({
        id: index + 1,
        url: photo.src,
        description: photo.alt,
        featured: photo.featured
      })),
      videos: content.videos.map((video, index) => ({
        id: index + 1,
        title: video.title,
        youtubeId: video.id,
        url: `https://youtube.com/watch?v=${video.id}`,
        description: video.description || ''
      })),
      socialMedia: content.socialLinks.map((link, index) => ({
        id: index + 1,
        platform: link.platform,
        url: link.url
      })),
      generatedAt: new Date().toISOString(),
      websiteUrl: window.location.origin
    };

    return pressKitData;
  };

  const downloadPressKitJSON = () => {
    const data = generatePressKitData();
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `${content.heroData.title.replace(/\s+/g, '_')}_PressKit.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadPressKitText = () => {
    const data = generatePressKitData();
    
    const textContent = `
ELECTRONIC PRESS KIT
${data.artist.toUpperCase()}
${data.subtitle}

BIOGRAPHY
${data.bio.title}
${data.bio.text}

PRESS PHOTOS
${data.images.map(img => 
  `${img.id}. ${img.description}${img.featured ? ' (FEATURED)' : ''}\n   URL: ${img.url}`
).join('\n')}

VIDEOS
${data.videos.map(video => 
  `${video.id}. ${video.title}\n   YouTube: ${video.url}\n   ${video.description}`
).join('\n\n')}

SOCIAL MEDIA
${data.socialMedia.map(social => 
  `${social.platform}: ${social.url}`
).join('\n')}

CONTACT
For booking inquiries: tucroixdj@gmail.com
Website: ${data.websiteUrl}

Generated: ${new Date(data.generatedAt).toLocaleString()}
    `.trim();

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `${content.heroData.title.replace(/\s+/g, '_')}_PressKit.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return {
    generatePressKitData,
    downloadPressKitJSON,
    downloadPressKitText
  };
};
