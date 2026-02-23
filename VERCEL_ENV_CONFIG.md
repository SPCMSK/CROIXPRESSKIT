# Configuración de Variables de Entorno en Vercel

## 🚀 Pasos para configurar en Vercel

### 1. Accede a tu proyecto en Vercel
- Ve a [vercel.com](https://vercel.com)
- Entra a tu proyecto CROIX

### 2. Configurar Variables de Entorno
1. Ve a **Settings** > **Environment Variables**
2. Agrega estas variables una por una:

```
VITE_SUPABASE_URL = https://kvucckpnuiuodiswmjpx.supabase.co
VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt2dWNja3BudWl1b2Rpc3dtanB4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE4Njc1MjgsImV4cCI6MjA4NzQ0MzUyOH0.imOZSmqyUQ4kG8EH19Az2xP0VAaKUQoVD9fHVprIhHE
VITE_ADMIN_EMAIL = admin@croix.com
VITE_ADMIN_PASSWORD = croix2024
```

### 3. Configurar para todos los entornos
- **Production**: ✅ (para el sitio en vivo)
- **Preview**: ✅ (para branches y PRs)
- **Development**: ✅ (opcional, para desarrollo)

### 4. Redeployar
Después de agregar las variables:
1. Ve a la pestaña **Deployments**
2. Haz clic en **Redeploy** en el último deployment
3. O haz un nuevo push al repositorio

## 📝 Importante

### Variables de Entorno: Local vs Producción
- **Local (.env.local)**: Para desarrollo en tu computadora
- **Vercel**: Para el sitio web en producción
- **Ambas necesarias**: Cada una funciona en su entorno

### Seguridad
- Las variables `VITE_*` son **públicas** (se incluyen en el bundle)
- Esto está bien para Supabase (anon key está diseñada para ser pública)
- Las credenciales de admin son solo para autenticación básica

## ✅ Verificación
Después de configurar en Vercel:
1. Visita tu sitio en producción
2. Entra al panel admin (⚙️)
3. Inicia sesión con: admin@croix.com / croix2024
4. Deberías ver "✅ Supabase configurado correctamente"

¡Tu presskit funcionará completamente tanto en local como en producción! 🚀

> **Nota**: Después de agregar las variables, es necesario hacer un redeploy para que tomen efecto.