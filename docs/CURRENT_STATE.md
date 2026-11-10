# Current State

**Terakhir diperbarui:** 2026-11-10

- **Fase:** Fase 0 setup aplikasi selesai; siap memulai Fase 1 design system/application shell.
- **Fondasi:** React 19 + Vite 7 + TypeScript strict, Tailwind CSS 4, konfigurasi shadcn/ui, Radix Slot, React Router, Dexie, dan Leaflet telah dipasang dengan lockfile.
- **Routing:** `/`, `/dashboard`, `/disasters/:id`, dan fallback 404 tersedia. Dashboard/detail masih placeholder eksplisit, bukan fitur selesai.
- **Struktur:** Folder domain, layout/UI components, config, pages, types, storage, dan test telah dibuat sesuai blueprint. Modul database/scoring/map belum memiliki implementasi.
- **UI saat ini:** App shell sederhana, navigasi, skip link, landing awal, dan tombol reusable. Design tokens lengkap, dark mode, mobile menu, serta polished landing belum dikerjakan.
- **Kualitas:** ESLint, TypeScript project references, Vitest/jsdom, React Testing Library, coverage provider, dan GitHub Actions CI tersedia.
- **Validasi lokal:** lint lulus, type-check lulus, 3 routing tests lulus, production build lulus, npm audit 0 vulnerability, dan Vite dev server merespons route `/` serta `/dashboard`.
- **Penyimpanan:** Dexie dan Leaflet terinstal tetapi belum digunakan; belum ada database, fixture, scoring, vote, atau preferensi persisten.
- **Arsitektur:** SPA client-only tanpa backend, live AI, API bencana langsung, payment gateway, atau sinkronisasi cloud.

## Menjalankan Aplikasi

Lihat `README.md`. Node 20.19+/22.12+, lalu `npm ci` dan `npm run dev`. Gunakan `npm run check` untuk seluruh validasi.

## Langkah Berikutnya

Fase 1: design tokens light/dark, komponen UI inti, responsive floating navigation/mobile menu/theme toggle, polished landing, dan pengujian aksesibilitas shell.
