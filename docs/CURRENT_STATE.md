# Current State

**Terakhir diperbarui:** 2026-11-10

- **Fase:** Fase 1 design system dan application shell selesai; siap memulai Fase 2 local data/scoring.
- **Fondasi:** React 19 + Vite 7 + TypeScript strict, Tailwind CSS 4, shadcn/ui/Radix, React Router, Dexie, dan Leaflet.
- **UI:** Semantic light/dark tokens, self-hosted DM Sans/Playfair Display, floating glass header, responsive mobile dialog, footer, theme toggle, polished landing page, dan dashboard empty state.
- **Komponen:** Button, Card, Badge, Dialog, Input, Select, serta Loading/Empty/Error StatusState tersedia sebagai modul reusable.
- **Tema:** `system` menjadi default; `light`, `dark`, dan `system` tersimpan aman di `siaga.theme`. Perubahan tema OS diikuti, meta `theme-color` disesuaikan, dan kegagalan storage tidak merusak UI.
- **Routing:** `/`, `/dashboard`, `/disasters/:id`, 404, hash navigation, dan scroll restoration tersedia. Dashboard/detail masih menunjukkan data belum tersedia; tidak ada metrik atau peta palsu.
- **Aksesibilitas implementasi:** Semantic landmarks/headings, skip link, focus indicators, touch targets, Radix focus management, Escape-to-close, reduced motion, dan label simulasi. Audit manual lintas browser/screen reader tetap masuk Fase 5.
- **Kualitas:** Lint dan strict type-check lulus; 9 tests mencakup routes, mobile navigation, keyboard dismissal, theme persistence/validation, storage failure, dan perubahan tema OS. Production build dan dev-server HTTP smoke test lulus; npm audit 0 vulnerability.
- **Penyimpanan:** Adapter tema localStorage sudah digunakan. Dexie/Leaflet baru dependency; database, fixture, scoring, filter persistence, vote, dan campaign belum diimplementasikan.
- **Batasan:** Client-only, tanpa live AI/backend/payment. Font disajikan lokal; aplikasi belum memiliki service worker/PWA offline setelah kunjungan pertama.

## Menjalankan Aplikasi

Node 20.19+/22.12+, `npm ci`, lalu `npm run dev`. Jalankan `npm run check` untuk lint, type-check, tests, dan build.

## Langkah Berikutnya

Fase 2: kontrak dan validator runtime, Dexie schema v1, fixture simulasi, seed idempoten, weighted scoring/narasi, unit tests, dan generalisasi safe localStorage adapter.
