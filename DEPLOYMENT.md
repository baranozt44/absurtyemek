# Absurt Yemek Deployment

## Backend API - Render

1. Render'da **New Web Service** olustur.
2. Repository olarak bu projeyi sec.
3. Ayarlar:
   - Root Directory: `backend`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Health Check Path: `/api/health`
4. Environment variables:
   - `PORT=3001`
   - `CORS_ORIGINS=https://absurtyemek.com,https://www.absurtyemek.com`
   - `DATABASE_URL`
   - `DIRECT_URL`
   - `SUPABASE_URL`
   - `SUPABASE_PUBLISHABLE_KEY`
   - `HUGGINGFACE_API_KEY`
   - `ADMIN_API_KEY` optional
5. Deploy bitince Render URL'sini not et. Domain hazir olana kadar frontend'de `NEXT_PUBLIC_API_URL` olarak bunu kullanabilirsin.

## Frontend - Vercel

1. Vercel'de **Add New Project** ile repository'yi bagla.
2. Ayarlar:
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: bos birak
3. Environment variables:
   - `NEXT_PUBLIC_SITE_URL=https://absurtyemek.com`
   - `NEXT_PUBLIC_API_URL=https://api.absurtyemek.com/api`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
4. Deploy et.

## Domain

1. Vercel'de `absurtyemek.com` ve `www.absurtyemek.com` domainlerini ekle.
2. Domain aldigin yerde Vercel'in verdigi DNS kayitlarini gir.
3. Render'da backend icin `api.absurtyemek.com` custom domain ekle.
4. Domain aldigin yerde Render'in verdigi DNS kaydini gir.

## Supabase Auth

Supabase dashboard'da Authentication > URL Configuration:

- Site URL: `https://absurtyemek.com`
- Redirect URLs:
  - `https://absurtyemek.com`
  - `https://absurtyemek.com/login`
