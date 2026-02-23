import React, { useState } from 'react'
import { Trash2, Eye, Download, Star, Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from '@/components/ui/alert-dialog'
import { useToast } from '@/hooks/use-toast'
import { UploadedImage } from '@/lib/supabase'

interface ImageGalleryProps {
  images: UploadedImage[]
  onDelete: (imageId: string) => Promise<boolean>
  onSelect?: (image: UploadedImage) => void
  selectedImages?: UploadedImage[]
  selectable?: boolean
  category?: string
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({
  images,
  onDelete,
  onSelect,
  selectedImages = [],
  selectable = false,
  category
}) => {
  const [deleteImageId, setDeleteImageId] = useState<string | null>(null)
  const [previewImage, setPreviewImage] = useState<UploadedImage | null>(null)
  const { toast } = useToast()

  const filteredImages = category 
    ? images.filter(img => img.category === category)
    : images

  const isSelected = (image: UploadedImage) => 
    selectedImages.some(selected => selected.id === image.id)

  const handleDelete = async () => {
    if (!deleteImageId) return
    
    const success = await onDelete(deleteImageId)
    if (success) {
      setDeleteImageId(null)
    }
  }

  const copyImageUrl = (url: string) => {
    navigator.clipboard.writeText(url)
    toast({
      title: 'URL copiada',
      description: 'La URL de la imagen se ha copiado al portapapeles'
    })
  }

  const downloadImage = async (url: string, filename: string) => {
    try {
      const response = await fetch(url)
      const blob = await response.blob()
      const downloadUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(downloadUrl)
    } catch (error) {
      toast({
        title: 'Error al descargar',
        description: 'No se pudo descargar la imagen',
        variant: 'destructive'
      })
    }
  }

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'dj': return 'bg-purple-100 text-purple-800'
      case 'studio': return 'bg-blue-100 text-blue-800'
      case 'press': return 'bg-green-100 text-green-800'
      case 'colabs': return 'bg-orange-100 text-orange-800'
      case 'releases': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (filteredImages.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
              <Eye className="w-8 h-8 text-muted-foreground" />
            </div>
            <div>
              <h3 className="font-medium text-lg">No hay imágenes</h3>
              <p className="text-muted-foreground">
                {category ? `No hay imágenes en la categoría "${category}"` : 'Sube algunas imágenes para empezar'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredImages.map((image) => (
          <Card 
            key={image.id} 
            className={`overflow-hidden transition-all duration-200 hover:shadow-lg ${
              selectable && isSelected(image) ? 'ring-2 ring-primary' : ''
            }`}
          >
            <CardContent className="p-0">
              {/* Image */}
              <div className="relative aspect-square overflow-hidden group">
                <img 
                  src={image.url} 
                  alt={image.alt_text}
                  className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                />
                
                {/* Overlay Actions */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => setPreviewImage(image)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => copyImageUrl(image.url)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => downloadImage(image.url, image.filename)}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => setDeleteImageId(image.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Selection Indicator */}
                {selectable && isSelected(image) && (
                  <div className="absolute top-2 right-2">
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                      <Star className="w-4 h-4 text-primary-foreground" />
                    </div>
                  </div>
                )}

                {/* Category Badge */}
                <div className="absolute top-2 left-2">
                  <Badge className={getCategoryColor(image.category)}>
                    {image.category}
                  </Badge>
                </div>
              </div>
              
              {/* Image Info */}
              <div className="p-3">
                <h4 className="font-medium text-sm truncate">
                  {image.alt_text}
                </h4>
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(image.created_at).toLocaleDateString()}
                </p>
                
                {/* Select Button */}
                {selectable && (
                  <Button
                    size="sm"
                    variant={isSelected(image) ? "default" : "outline"}
                    className="w-full mt-2"
                    onClick={() => onSelect?.(image)}
                  >
                    {isSelected(image) ? 'Seleccionada' : 'Seleccionar'}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Preview Modal */}
      {previewImage && (
        <div 
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div className="max-w-4xl max-h-full">
            <img 
              src={previewImage.url} 
              alt={previewImage.alt_text}
              className="max-w-full max-h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <Button
            variant="secondary"
            size="sm"
            className="absolute top-4 right-4"
            onClick={() => setPreviewImage(null)}
          >
            Cerrar
          </Button>
        </div>
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteImageId} onOpenChange={() => setDeleteImageId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar imagen?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. La imagen se eliminará permanentemente del servidor.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export default ImageGallery