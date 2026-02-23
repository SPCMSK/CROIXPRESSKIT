# 🎛️ CROIX PRESSKIT - Electronic Press Kit

Un presskit profesional y completamente editable para CROIX - DJ y Productor de techno underground chileno.

## ✨ Características

- **🔐 Panel de Administración Completo**: Edita todo sin código
- **📸 Gestión de Imágenes**: Drag & drop con categorías automáticas  
- **📝 Editor de Texto Enriquecido**: Biografía con formato visual
- **🔗 Redes Sociales Dinámicas**: Agrega/elimina redes fácilmente
- **🎨 Tema Underground**: Colores neón y estética de club
- **📱 Responsive**: Perfecto en todos los dispositivos
- **💾 Supabase Backend**: Storage profesional y base de datos

## 🚀 Tecnologías

- **React 18** + **TypeScript**
- **Vite** - Build ultra rápido
- **Tailwind CSS** - Styling moderno  
- **Supabase** - Backend como servicio
- **Radix UI** - Componentes accesibles
- **React Dropzone** - Upload de archivos

## 🎯 Para CROIX

Este presskit está específicamente diseñado para mostrar:

- **Discografía**: Hot Rhythms EP, Calentando EP, Sustancia EP, Worker
- **Colaboraciones**: TeeHC, Jarod Beyzaga, Malisan, Remix Laddie
- **Sellos**: SpaceRecords, Gruvalismo, KRAFT.rec, One:Thirty, Oetraxxrecords
- **Estilo Underground**: Techno irreverente y energía de club

## 🔧 Instalación

```bash
# Clonar repositorio
git clone https://github.com/SPCMSK/CROIXPRESSKIT.git
cd CROIXPRESSKIT

# Instalar dependencias
npm install

# Configurar Supabase (ver SUPABASE_SETUP.md)
cp .env.local.example .env.local
# Editar .env.local con tus credenciales de Supabase

# Iniciar desarrollo
npm run dev
```

## 🎮 Panel de Administración

### Acceso
1. Haz clic en ⚙️ en la navegación
2. **Email**: admin@croix.com
3. **Password**: croix2024

### Funciones Disponibles
- **✍️ Editar Biografía**: Párrafos con formato visual
- **📷 Gestionar Fotos**: Categorías DJ, Estudio, Prensa, Colaboraciones
- **🔗 Redes Sociales**: Instagram, Spotify, SoundCloud, Beatport
- **🎨 Personalización**: Colores y temas (próximamente)

## 📋 Configuración

### Supabase (Requerido)
1. Lee `SUPABASE_SETUP.md` para instrucciones completas
2. Crea proyecto en [supabase.com](https://supabase.com)
3. Ejecuta las queries SQL proporcionadas
4. Configura variables de entorno

### Variables de Entorno
```env
VITE_SUPABASE_URL=tu-url-supabase
VITE_SUPABASE_ANON_KEY=tu-anon-key
VITE_ADMIN_EMAIL=admin@croix.com
VITE_ADMIN_PASSWORD=croix2024
```

## 🚀 Deploy

### Vercel (Recomendado)
```bash
npm run build
vercel --prod
```

### Netlify 
```bash
npm run build
netlify deploy --prod --dir=dist
```

## 📚 Documentación

- `ADMIN_GUIDE.md` - Guía completa del panel admin
- `SUPABASE_SETUP.md` - Configuración paso a paso de Supabase
- `PDF_PRESSKIT.md` - Generación de PDF del presskit

## 🎛️ CROIX

**Underground Techno • Oetraxxrecords**

- 📧 **Booking**: tucroixdj@gmail.com
- 📷 **Instagram**: [@croix__](https://instagram.com/croix__)
- 🎵 **Spotify**: [CROIX](https://open.spotify.com/artist/7H3B36EQXldij3pvfgeDQk)

---

**Energía inagotable • Sampling audaz • Pura cultura de club** 🔊
