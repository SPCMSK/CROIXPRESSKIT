import React, { useState, useRef, useEffect } from 'react'
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  Link,
  Type,
  Palette
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover'

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  label?: string
  maxLength?: number
  showPreview?: boolean
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Escribe aquí...",
  label,
  maxLength,
  showPreview = true
}) => {
  const [isPreview, setIsPreview] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')
  const [showLinkInput, setShowLinkInput] = useState(false)
  const editorRef = useRef<HTMLDivElement>(null)

  // Available colors for text
  const colors = [
    '#000000', '#333333', '#666666', '#999999',
    '#FF0066', '#FF3366', '#FF6600', '#FFCC00',
    '#66FF00', '#00FF66', '#00CCFF', '#6600FF'
  ]

  useEffect(() => {
    if (editorRef.current && !isPreview) {
      editorRef.current.innerHTML = value
    }
  }, [value, isPreview])

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value)
    updateContent()
  }

  const updateContent = () => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML
      onChange(content)
    }
  }

  const insertLink = () => {
    if (linkUrl) {
      execCommand('createLink', linkUrl)
      setLinkUrl('')
      setShowLinkInput(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Handle keyboard shortcuts
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'b':
          e.preventDefault()
          execCommand('bold')
          break
        case 'i':
          e.preventDefault()
          execCommand('italic')
          break
        case 'u':
          e.preventDefault()
          execCommand('underline')
          break
      }
    }
  }

  const getPlainText = (html: string) => {
    const temp = document.createElement('div')
    temp.innerHTML = html
    return temp.textContent || temp.innerText || ''
  }

  const currentLength = getPlainText(value).length

  return (
    <div className="space-y-4">
      {label && <Label className="text-sm font-medium">{label}</Label>}
      
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              {/* Formatting Tools */}
              <Button
                size="sm"
                variant="ghost"
                onClick={() => execCommand('bold')}
                className="h-8 w-8"
                title="Negrita (Ctrl+B)"
              >
                <Bold className="w-4 h-4" />
              </Button>
              
              <Button
                size="sm"
                variant="ghost"
                onClick={() => execCommand('italic')}
                className="h-8 w-8"
                title="Cursiva (Ctrl+I)"
              >
                <Italic className="w-4 h-4" />
              </Button>
              
              <Button
                size="sm"
                variant="ghost"
                onClick={() => execCommand('underline')}
                className="h-8 w-8"
                title="Subrayado (Ctrl+U)"
              >
                <Underline className="w-4 h-4" />
              </Button>

              <div className="w-px h-4 bg-border mx-1" />

              {/* Text Size */}
              <Button
                size="sm"
                variant="ghost"
                onClick={() => execCommand('fontSize', '4')}
                className="h-8"
                title="Texto grande"
              >
                <Type className="w-4 h-4" />
              </Button>

              {/* Text Color */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8"
                    title="Color de texto"
                  >
                    <Palette className="w-4 h-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-48">
                  <div className="grid grid-cols-4 gap-2">
                    {colors.map((color) => (
                      <button
                        key={color}
                        className="w-8 h-8 rounded border-2 border-transparent hover:border-primary"
                        style={{ backgroundColor: color }}
                        onClick={() => execCommand('foreColor', color)}
                        title={color}
                      />
                    ))}
                  </div>
                </PopoverContent>
              </Popover>

              <div className="w-px h-4 bg-border mx-1" />

              {/* List */}
              <Button
                size="sm"
                variant="ghost"
                onClick={() => execCommand('insertUnorderedList')}
                className="h-8 w-8"
                title="Lista"
              >
                <List className="w-4 h-4" />
              </Button>

              {/* Link */}
              <Popover open={showLinkInput} onOpenChange={setShowLinkInput}>
                <PopoverTrigger asChild>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8"
                    title="Insertar enlace"
                  >
                    <Link className="w-4 h-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="space-y-3">
                    <Label>URL del enlace</Label>
                    <div className="flex gap-2">
                      <Input
                        value={linkUrl}
                        onChange={(e) => setLinkUrl(e.target.value)}
                        placeholder="https://..."
                        onKeyDown={(e) => e.key === 'Enter' && insertLink()}
                      />
                      <Button onClick={insertLink} size="sm">
                        Insertar
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            {/* Preview Toggle */}
            {showPreview && (
              <div className="flex items-center gap-2">
                {maxLength && (
                  <span className={`text-xs ${currentLength > maxLength ? 'text-destructive' : 'text-muted-foreground'}`}>
                    {currentLength}/{maxLength}
                  </span>
                )}
                <Button
                  size="sm"
                  variant={isPreview ? "default" : "outline"}
                  onClick={() => setIsPreview(!isPreview)}
                >
                  {isPreview ? 'Editar' : 'Vista previa'}
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="p-4">
          {isPreview ? (
            <div 
              className="min-h-32 p-4 bg-muted/30 rounded border prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: value }}
            />
          ) : (
            <div
              ref={editorRef}
              contentEditable
              className="min-h-32 p-4 border rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              onInput={updateContent}
              onKeyDown={handleKeyDown}
              style={{ whiteSpace: 'pre-wrap' }}
              data-placeholder={placeholder}
            />
          )}
        </CardContent>
      </Card>

      {/* Shortcuts Help */}
      <div className="text-xs text-muted-foreground">
        <p><strong>Atajos de teclado:</strong> Ctrl+B (negrita), Ctrl+I (cursiva), Ctrl+U (subrayado)</p>
      </div>
    </div>
  )
}

export default RichTextEditor