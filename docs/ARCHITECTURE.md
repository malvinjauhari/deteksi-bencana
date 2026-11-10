# Architecture

## Keputusan MVP

- **Aplikasi:** Single-page application client-side; tanpa backend, cron, WebSocket, atau server database.
- **Frontend:** React + Vite + TypeScript.
- **Styling:** Tailwind CSS + shadcn/ui/Radix; minimalis dengan glassmorphism terbatas.
- **Peta:** Leaflet + OpenStreetMap; feed teks tetap tersedia jika tile/gagal peta.
- **Penyimpanan terstruktur:** IndexedDB melalui Dexie.
- **Preferensi ringan:** `localStorage` untuk tema, filter, dan ID profil demo aktif.
- **Analisis:** fungsi TypeScript deterministik; tidak ada pemanggilan LLM/AI provider.
- **Deployment:** static hosting (Vercel/Netlify).

## Struktur Modul

Struktur kanonis berada di `PROJECT_BLUEPRINT.md`. Pemisahan dilakukan berdasarkan domain (`disasters`, `scoring`, `voting`, `campaigns`, dan lainnya), bukan berdasarkan halaman saja.

## Status Bootstrap

Fondasi React/Vite/TypeScript, Tailwind, shadcn/ui config, router, dan folder domain telah tersedia. Entry point menggunakan `src/main.tsx` → `App.tsx` → `app/router.tsx` → `components/layout/app-shell.tsx`. Route awal tersedia tetapi dashboard/detail masih placeholder. Dexie dan Leaflet sudah menjadi dependency, belum dipakai hingga fase implementasinya.

Path alias `@/*` menunjuk ke `src/*` dan dikonfigurasi pada Vite serta TypeScript. Testing memakai Vitest + jsdom; CI menjalankan `npm ci`, lint, type-check, test, dan build dengan Node 22.

Fase 1 menambahkan `ThemeProvider` melalui `components/providers/`, safe theme adapter di `lib/storage/preferences.ts`, Radix Dialog, semantic CSS tokens, dan komponen UI inti. Font DM Sans/Playfair Display dibundel melalui Fontsource sehingga tidak membutuhkan Google Fonts saat runtime. Root layout menangani hash scroll dan scroll restoration. Database dan peta tetap belum diimplementasikan.

Motion memakai `motion` (framer-motion) melalui `MotionProvider` berbasis `LazyMotion`/`domAnimation`; komponen animasi memakai `m` agar runtime di-code-split. `Reveal` di `components/motion/reveal.tsx` menangani scroll reveal generik. Vite memisahkan `motion` dan `leaflet` melalui `manualChunks`.

Fase 2 menambahkan lapisan data lokal. Entry point data tetap `src/main.tsx` → `App.tsx` → `app/router.tsx`, tetapi `app/routes.tsx` mendefinisikan rute dan `app/route-elements.tsx` memuat dashboard serta detail secara lazy. Modul scoring di `src/features/scoring/` tidak bergantung pada IndexedDB maupun DOM. Modul database di `src/lib/db/` (schema, fixture, repository, seed) hanya diakses lewat `src/features/disasters/disaster-service.ts`. Validasi runtime memakai Zod di `src/lib/validation/schemas.ts`. Preferensi dipecah menjadi `lib/storage/storage-keys.ts` (kunci), `theme-preferences.ts` (tanpa Zod), dan `filter-preferences.ts` (dengan Zod) agar bundle landing page tidak menarik pustaka validasi. Vite memisahkan `dexie` dan `zod` melalui `manualChunks`.

## Aliran Data

```text
Fixture JSON / impor lokal
        ↓ validasi + normalisasi
IndexedDB repositories
        ↓
Mesin scoring lokal → analyses
        ↓
Dashboard / Map / Feed / Detail
        ↓ aksi profil demo
Votes (transaksi lokal) → status campaign
```

- Repository menjadi satu-satunya lapisan yang berkomunikasi dengan Dexie.
- Service domain menangani scoring, voting, campaign, ekspor, dan reset.
- Data dari IndexedDB diperlakukan sebagai tidak tepercaya dan selalu divalidasi sebelum dipakai.
- Komponen menerima data melalui hook/query domain dan tidak menyimpan duplikat state persisten.
- Data simulasi memiliki `is_simulation: true` dan label yang terlihat di UI.

## Ketahanan & Privasi

- Deteksi IndexedDB tidak tersedia dan tampilkan status penyimpanan gagal/non-persisten. Implementasi saat ini memakai `StorageUnavailableError` pada service, yang diterjemahkan UI menjadi state "penyimpanan lokal tidak tersedia" dan tetap menyediakan tombol coba lagi.
- Seed dan reset harus idempoten; reset memerlukan konfirmasi.
- Impor JSON divalidasi sebelum ditulis dan dibatasi pada kontrak aplikasi.
- Jangan menyimpan data pribadi sensitif, kredensial, atau rahasia API.
- Aplikasi inti dan fixture bekerja tanpa jaringan setelah dimuat; tile peta memerlukan jaringan dan memiliki fallback.

## Di Luar Ruang Lingkup MVP

Backend/API internal, autentikasi nyata, sinkronisasi multi-perangkat, ingest BMKG/BNPB/NASA langsung, AI/LLM, payment gateway, donasi, serta verifikasi KTP/lokasi.
