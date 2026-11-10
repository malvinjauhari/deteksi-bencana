# Current State

**Terakhir diperbarui:** 2026-11-10

- **Fase:** Fase 2 local data layer dan deterministic scoring selesai; berikutnya Fase 3 dashboard/feed/map.
- **Fondasi:** React 19 + Vite 7 + TypeScript strict, Tailwind CSS 4, shadcn/ui/Radix, React Router, Dexie, Zod, Leaflet, dan Motion.
- **UI:** Semantic light/dark tokens, self-hosted DM Sans/Playfair Display, floating glass header, responsive mobile dialog, footer, theme toggle, landing page dengan hero jumbotron beranimasi, serta dashboard dan detail berbasis data lokal sebenarnya.
- **Motion:** Library `motion` (framer-motion) via `LazyMotion`/`domAnimation` dengan komponen `m`. Detail: parallax gambar hero, stagger masuk, garis radar berputar lambat, scroll reveal per seksi, dan indikator scroll. Semua animasi non-esensial dinonaktifkan pada `prefers-reduced-motion: reduce`.
- **Komponen:** Button, Card, Badge, Dialog, Input, Select, Loading/Empty/Error StatusState, SeverityBadge, ScoreBreakdown, dan DisasterCard tersedia sebagai modul reusable.
- **Tema:** `system` menjadi default; `light`, `dark`, dan `system` tersimpan aman di `siaga.theme`. Perubahan tema OS diikuti, meta `theme-color` disesuaikan, dan kegagalan storage tidak merusak UI.
- **Routing:** `/`, `/dashboard`, `/disasters/:id`, 404, hash navigation, dan scroll restoration tersedia. Dashboard dan detail dimuat secara lazy dengan fallback memuat.
- **Data lokal:** Dexie database `siaga-nusantara` schema v1 dengan store `disasters`, `analyses`, `demoUsers`, `votes`, dan `metadata`. Enam fixture simulasi bencana dan empat profil demo terseed otomatis saat halaman data dibuka. Seed idempoten berbasis ID stabil dan metadata versi.
- **Scoring:** Mesin bobot 25/25/20/15/15 dengan renormalisasi bobot saat faktor `null`, `data_completeness`, `is_provisional`, severity 0–39/40–69/70–100, dan narasi template. Tidak ada LLM dan tidak ada faktor yang direkayasa.
- **Dashboard:** Empat summary card dari data aktual, pencarian, filter jenis, filter urutan, dan status sementara. Menyediakan state loading, empty, error, dan "penyimpanan lokal tidak tersedia".
- **Detail Pageable:** Ringkasan analisis, rincian lima faktor beserta bobot dan kontribusi, label skor sementara/belum dinilai, langkah mitigasi, koordinat, dan versi mesin skor.
- **Preferensi:** `siaga.filters` menyimpan query, jenis, dan urutan tervalidasi Zod; `siaga.demo.activeProfileId` disiapkan untuk Fase 4.
- **Aksesibilitas implementasi:** Semantic landmarks/headings, skip link, focus indicators, touch targets, Radix focus management, Escape-to-close, reduced motion, alt kosong pada foto dekoratif, label simulasi, tabel ringkasan semantik, dan status yang diumumkan lewat `role="status"`/`role="alert"`. Audit manual lintas browser/screen reader tetap masuk Fase 5.
- **Kualitas:** Lint dan strict type-check lulus; 53 unit tests (scoring, narasi, severity, validator Zod, seed idempoten, adapter storage, routing) dan 14 Playwright e2e tests (hero, animasi, reduced motion, dark mode, 320 px, seed dashboard, filter, skor sementara, detail, not-found) lulus. Production build lulus tanpa peringatan ukuran chunk; npm audit 0 vulnerability.
- **Aset:** `public/images/hero-unsplash.webp` (foto Unsplash `photo-1581059686229-de26e6ae5dc4`, dekoratif, disimpan lokal).
- **Bundle:** `motion`, `leaflet`, `dexie`, dan `zod` dipisah lewat `manualChunks` Vite plus lazy route. Bundle utama ±407 kB, motion 106 kB, dexie 100 kB, dan zod 88 kB dimuat terpisah; landing page tidak melakukan preload Dexie maupun Zod.
- **Penyimpanan:** Safe adapter `localStorage` dengan validasi saat baca dan laporan kegagalan saat tulis. Kegagalan IndexedDB diterjemahkan menjadi `StorageUnavailableError` dan state eksplisit, bukan state kosong.
- **Batasan:** Client-only, tanpa live AI/backend/payment. Font disajikan lokal; aplikasi belum memiliki service worker/PWA offline setelah kunjungan pertama. Peta Leaflet belum diintegrasikan.

## Menjalankan Aplikasi

Node 20.19+/22.12+, `npm ci`, lalu `npm run dev`. Jalankan `npm run check` untuk lint, type-check, tests, dan build, serta `npx playwright test` untuk e2e.

## Langkah Berikutnya

Fase 3: integrasi Leaflet dengan marker aksesibel dan fallback daftar teks/koordinat, panel filter status campaign, audit responsif 320 px/tablet/desktop, dan penyempurnaan halaman detail.
