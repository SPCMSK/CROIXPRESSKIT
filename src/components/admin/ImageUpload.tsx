import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, X, Image as ImageIcon, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'

interface ImageUploadProps {
  onUpload: (file: File, category: string) => Promise<any>
  category: string
  maxFiles?: number
  maxSize?: number // in bytes
  acceptedTypes?: string[]
  uploading?: boolean
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  onUpload,
  category,
  maxFiles = 10,
  maxSize = 5 * 1024 * 1024, // 5MB
  acceptedTypes = ['image/jpeg', 'image/png', 'image/webp'],
  uploading = false
}) => {
  const [uploadQueue, setUploadQueue] = useState<File[]>([])
  const [previews, setPreviews] = useState<{ [key: string]: string }>({})
  const [uploadStatus, setUploadStatus] = useState<{ [key: string]: 'pending' | 'uploading' | 'success' | 'error' }>({})
  
  const { toast } = useToast()

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    // Handle rejected files
    rejectedFiles.forEach(({ file, errors }) => {
      errors.forEach((error: any) => {
        if (error.code === 'file-too-large') {
          toast({
            title: 'Archivo muy grande',
            description: `${file.name} es demasiado grande. Máximo ${maxSize / 1024 / 1024}MB`,
            variant: 'destructive'
          })
        } else if (error.code === 'file-invalid-type') {
          toast({
            title: 'Tipo de archivo no válido',
            description: `${file.name} no es un tipo de imagen válido`,
            variant: 'destructive'
          })
        }
      })
    })

    // Handle accepted files
    const validFiles = acceptedFiles.slice(0, maxFiles)
    setUploadQueue(prev => [...prev, ...validFiles])

    // Create previews
    validFiles.forEach(file => {
      const reader = new FileReader()
      reader.onload = () => {
        setPreviews(prev => ({
          ...prev,
          [file.name]: reader.result as string
        }))
        setUploadStatus(prev => ({
          ...prev,
          [file.name]: 'pending'
        }))
      }
      reader.readAsDataURL(file)
    })
  }, [maxFiles, maxSize, toast])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedTypes.reduce((acc, type) => {
      acc[type] = []
      return acc
    }, {} as Record<string, string[]>),
    maxSize,
    maxFiles,
    multiple: true
  })

  const uploadFile = async (file: File) => {
    setUploadStatus(prev => ({ ...prev, [file.name]: 'uploading' }))
    
    try {
      await onUpload(file, category)
      setUploadStatus(prev => ({ ...prev, [file.name]: 'success' }))
      
      // Remove from queue after successful upload
      setTimeout(() => {
        removeFromQueue(file.name)
      }, 2000)
    } catch (error) {
      setUploadStatus(prev => ({ ...prev, [file.name]: 'error' }))
      toast({
        title: 'Error al subir',
        description: `No se pudo subir ${file.name}`,
        variant: 'destructive'
      })
    }
  }

  const uploadAll = async () => {
    const pendingFiles = uploadQueue.filter(file => 
      uploadStatus[file.name] === 'pending' || !uploadStatus[file.name]
    )
    
    for (const file of pendingFiles) {
      await uploadFile(file)
    }
  }

  const removeFromQueue = (fileName: string) => {
    setUploadQueue(prev => prev.filter(file => file.name !== fileName))
    setPreviews(prev => {
      const newPreviews = { ...prev }
      delete newPreviews[fileName]
      return newPreviews
    })
    setUploadStatus(prev => {
      const newStatus = { ...prev }
      delete newStatus[fileName]
      return newStatus
    })
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'uploading':
        return <div className="w-4 h-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      case 'success':
        return <Check className="w-4 h-4 text-green-500" />
      case 'error':
        return <X className="w-4 h-4 text-red-500" />
      default:
        return <Upload className="w-4 h-4" />
    }
  }

  const pendingCount = uploadQueue.filter(file => 
    uploadStatus[file.name] === 'pending' || !uploadStatus[file.name]
  ).length

  return (
    <div className="space-y-4">
      {/* Dropzone */}
      <Card>
        <CardContent className="p-6">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive 
                ? 'border-primary bg-primary/5' 
                : 'border-muted-foreground/25 hover:border-primary/50'
            }`}
          >
            <input {...getInputProps()} />
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
                <ImageIcon className="w-8 h-8 text-muted-foreground" />
              </div>
              
              {isDragActive ? (
                <div>
                  <p className="text-lg font-medium">¡Suelta las imágenes aquí!</p>
                  <p className="text-sm text-muted-foreground">Se subirán automáticamente</p>
                </div>
              ) : (
                <div>
                  <p className="text-lg font-medium">Arrastra y suelta imágenes aquí</p>
                  <p className="text-sm text-muted-foreground">
                    o <span className="text-primary underline">haz clic para seleccionar</span>
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center mt-2">
                    <Badge variant="outline">JPG</Badge>
                    <Badge variant="outline">PNG</Badge>
                    <Badge variant="outline">WEBP</Badge>
                    <Badge variant="outline">Máx. {maxSize / 1024 / 1024}MB</Badge>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upload Queue */}
      {uploadQueue.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">Cola de subida ({uploadQueue.length})</h3>
              {pendingCount > 0 && (
                <Button onClick={uploadAll} disabled={uploading}>
                  Subir todas ({pendingCount})
                </Button>
              )}
            </div>
            
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {uploadQueue.map((file) => (
                <div key={file.name} className="flex items-center gap-3 p-3 bg-card rounded-lg border">
                  {/* Preview */}
                  <div className="w-12 h-12 rounded-md overflow-hidden bg-muted flex-shrink-0">
                    {previews[file.name] ? (
                      <img 
                        src={previews[file.name]} 
                        alt={file.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ImageIcon className="w-full h-full p-2" />
                    )}
                  </div>
                  
                  {/* File Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{file.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  
                  {/* Status */}
                  <div className="flex items-center gap-2">
                    {getStatusIcon(uploadStatus[file.name])}
                    <Badge variant={
                      uploadStatus[file.name] === 'success' ? 'default' :
                      uploadStatus[file.name] === 'error' ? 'destructive' :
                      uploadStatus[file.name] === 'uploading' ? 'secondary' : 'outline'
                    }>
                      {uploadStatus[file.name] === 'success' ? 'Listo' :
                       uploadStatus[file.name] === 'error' ? 'Error' :
                       uploadStatus[file.name] === 'uploading' ? 'Subiendo...' : 'Pendiente'}
                    </Badge>
                  </div>
                  
                  {/* Actions */}
                  {uploadStatus[file.name] !== 'uploading' && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeFromQueue(file.name)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default ImageUpload