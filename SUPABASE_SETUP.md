# Configuración de Supabase para CROIX Presskit

## 🚀 Pasos de Configuración

### 1. Crear Proyecto en Supabase
1. Ve a [supabase.com](https://supabase.com)
2. Crea una nueva organización y proyecto
3. Copia tu `Project URL` y `anon public key`
4. Reemplaza los valores en `.env.local`

### 2. Configurar Storage Buckets

Ejecuta esto en el SQL Editor de Supabase:

```sql
-- Crear bucket para imágenes del presskit
INSERT INTO storage.buckets (id, name, public)
VALUES ('presskit-images', 'presskit-images', true);

-- Crear bucket para videos (futuro)
INSERT INTO storage.buckets (id, name, public)  
VALUES ('presskit-videos', 'presskit-videos', true);

-- Crear bucket para assets generales
INSERT INTO storage.buckets (id, name, public)
VALUES ('presskit-assets', 'presskit-assets', true);

-- Política de acceso público para lectura de imágenes
CREATE POLICY "Public access for presskit images" ON storage.objects
FOR SELECT USING (bucket_id = 'presskit-images');

-- Política para subir imágenes (solo autenticados)
CREATE POLICY "Authenticated users can upload images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'presskit-images' AND auth.role() = 'authenticated');

-- Política para eliminar imágenes (solo autenticados)
CREATE POLICY "Authenticated users can delete images" ON storage.objects
FOR DELETE USING (bucket_id = 'presskit-images' AND auth.role() = 'authenticated');
```

### 3. Crear Tablas de Base de Datos

```sql
-- Tabla principal de configuración del presskit
CREATE TABLE presskit_config (
  id TEXT PRIMARY KEY DEFAULT 'main',
  hero_data JSONB NOT NULL DEFAULT '{}',
  bio_data JSONB NOT NULL DEFAULT '{}',
  social_links JSONB NOT NULL DEFAULT '[]',
  videos JSONB NOT NULL DEFAULT '[]',
  gallery_photos JSONB NOT NULL DEFAULT '[]',
  theme_colors JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla para gestión de imágenes subidas
CREATE TABLE uploaded_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filename TEXT NOT NULL,
  url TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('dj', 'studio', 'press', 'colabs', 'releases')),
  alt_text TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para mejorar rendimiento
CREATE INDEX idx_images_category ON uploaded_images(category);
CREATE INDEX idx_images_created ON uploaded_images(created_at DESC);

-- Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_presskit_config_updated_at 
  BEFORE UPDATE ON presskit_config 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insertar configuración inicial
INSERT INTO presskit_config (id, hero_data, bio_data, social_links, theme_colors)
VALUES (
  'main',
  '{"title": "CROIX", "subtitle": "Electronic Press Kit", "description1": "DJ y Productor Chileno", "description2": "Underground Techno • Oetraxxrecords", "background_image": ""}',
  '{"title": "Acerca de CROIX", "image": "", "paragraph1": "Croix es un DJ y productor chileno que se ha convertido en una figura esencial del techno underground e irreverente.", "paragraph2": "Su prolífica carrera en el estudio cuenta con lanzamientos en sellos internacionales y nacionales de renombre.", "paragraph3": "Más allá de sus lanzamientos en solitario, Croix ha dejado su marca en importantes compilados.", "paragraph4": "Su faceta colaborativa es igualmente sólida, destacando su trabajo constante."}',
  '[{"platform": "Instagram", "url": "https://www.instagram.com/croix__/"}, {"platform": "Spotify", "url": "https://open.spotify.com/intl-es/artist/7H3B36EQXldij3pvfgeDQk"}]',
  '{"primary": "320 100% 65%", "secondary": "0 100% 60%", "background": "0 0% 1%", "foreground": "0 0% 98%"}'
);
```

### 4. Configurar Row Level Security (RLS)

```sql
-- Habilitar RLS en las tablas
ALTER TABLE presskit_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE uploaded_images ENABLE ROW LEVEL SECURITY;

-- Política para lectura pública de configuración
CREATE POLICY "Public read access to presskit config" ON presskit_config
FOR SELECT USING (true);

-- Política para lectura pública de imágenes
CREATE POLICY "Public read access to images" ON uploaded_images
FOR SELECT USING (true);

-- Para desarrollo: permitir todas las operaciones sin autenticación
-- NOTA: En producción deberías usar autenticación real
CREATE POLICY "Allow all operations on presskit config" ON presskit_config
FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on images" ON uploaded_images
FOR ALL USING (true) WITH CHECK (true);
```

## 🔧 Variables de Entorno

Actualiza tu archivo `.env.local`:

```env
# Reemplaza con tus valores reales de Supabase
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key-aqui

# Credenciales de administrador
VITE_ADMIN_EMAIL=admin@croix.com
VITE_ADMIN_PASSWORD=croix2024
```

## 📝 Próximos Pasos

1. **Ejecutar las consultas SQL** en el SQL Editor de Supabase
2. **Actualizar las variables de entorno** con tus valores reales
3. **Instalar dependencias**: `npm install @supabase/supabase-js react-dropzone`
4. **Reiniciar el servidor de desarrollo**
5. **Acceder al panel admin** con las credenciales configuradas

## 🎯 Funcionalidades del Panel Admin

### ✅ Completadas:
- 🔐 **Autenticación** de administrador
- 📝 **Editor de contenido** con texto enriquecido
- 📸 **Gestión de imágenes** con drag & drop
- 🎨 **Categorización** automática de fotos
- 🔗 **Gestión de redes sociales**
- 💾 **Guardado automático** en Supabase

### 🚧 En desarrollo:
- 🎵 **Gestión de música** y embeds de SoundCloud
- 🎨 **Personalización de colores** del tema
- 📱 **Vista previa** en tiempo real
- 📊 **Analytics** básicos

## 🆘 Troubleshooting

### Error: "Failed to fetch"
- Verifica que las URLs de Supabase sean correctas
- Asegúrate de que las políticas RLS estén configuradas

### Error: "Storage bucket not found"
- Verifica que los buckets estén creados correctamente
- Revisa las políticas de storage

### Error: "Table doesn't exist"
- Ejecuta todas las consultas SQL en el orden correcto
- Verifica el nombre del proyecto en Supabase

¡Tu panel de administración completo está listo! 🚀