# Current State

**Terakhir diperbarui:** 2026-11-10

- **Fase:** Fase 3 dashboard, feed, dan peta selesai; berikutnya Fase 4 demo voting, campaign, dan data controls.
- **Fondasi:** React 19 + Vite 7 + TypeScript strict, Tailwind CSS 4, shadcn/ui/Radix, React Router, Dexie, Zod, Leaflet, dan Motion.
- **UI:** Semantic light/dark tokens, self-hosted DM Sans/Playfair Display, floating glass header, responsive mobile dialog, footer, theme toggle, landing page dengan hero jumbotron beranimasi, serta dashboard dan detail berbasis data lokal sebenarnya.
- **Motion:** Library `motion` (framer-motion) via `LazyMotion`/`domAnimation` dengan komponen `m`. Semua animasi non-esensial dinonaktifkan pada `prefers-reduced-motion: reduce`.
- **Komponen:** Button, Card, Badge, Dialog, Input, Select, StatusState, SeverityBadge, ScoreBreakdown, DisasterCard, dan DisasterMap tersedia sebagai modul reusable.
- **Tema:** `system` menjadi default; `light`, `dark`, dan `system` tersimpan aman di `siaga.theme`. Perubahan tema OS diikuti, meta `theme-color` disesuaikan, dan kegagalan storage tidak merusak UI.
- **Routing:** `/`, `/dashboard`, `/disasters/:id`, 404, hash navigation, dan scroll restoration tersedia. Dashboard dan detail dimuat secara lazy dengan fallback memuat.
- **Data lokal:** Dexie database `siaga-nusantara` schema v1 dengan store `disasters`, `analyses`, `demoUsers`, `votes`, dan `metadata`. Enam fixture simulasi bencana dan empat profil demo terseed otomatis saat halaman data dibuka. Seed idempoten berbasis ID stabil dan metadata versi.
- **Scoring:** Mesin bobot 25/25/20/15/15 dengan renormalisasi bobot saat faktor `null`, `data_completeness`, `is_provisional`, severity 0–39/40–69/70–100, dan narasi template. Tidak ada LLM dan tidak ada faktor yang direkayasa.
- **Dashboard:** Empat summary card dari data aktual, pencarian, filter jenis/status campaign, pengurutan, feed, dan peta. Menyediakan state loading, empty, error, dan "penyimpanan lokal tidak tersedia". Kejadian tanpa skor selalu berada di akhir pengurutan urgensi.
- **Peta:** Dashboard dan detail memakai Leaflet + OpenStreetMap. Marker severity dapat difokuskan dan dibuka dengan keyboard; popup dibangun melalui DOM `textContent`, scroll-wheel zoom dinonaktifkan, dan modul peta dimuat lazy. Daftar lokasi/koordinat selalu tersedia. Kegagalan tile menampilkan alert tanpa menyembunyikan analisis.
- **Detail:** Ringkasan analisis, rincian lima faktor beserta bobot dan kontribusi, label skor sementara/belum dinilai, langkah mitigasi, peta satu lokasi, koordinat, dan versi mesin skor.
- **Preferensi:** `siaga.filters` menyimpan query, jenis, status, dan urutan tervalidasi Zod; `siaga.demo.activeProfileId` disiapkan untuk Fase 4. Pembacaan tanpa adapter eksplisit menggunakan `safeStorage` browser.
- **Aksesibilitas implementasi:** Semantic landmarks/headings, skip link, focus indicators, touch targets, Radix focus management, Escape-to-close, reduced motion, marker keyboard, alternatif koordinat, label simulasi, dan status melalui `role="status"`/`role="alert"`. Audit manual lintas browser/screen reader tetap masuk Fase 5.
- **Kualitas:** Lint dan strict type-check lulus; 60 unit tests (scoring, narasi, severity, validator Zod, seed, storage, service/filter/sort/detail, routing) dan 20 Playwright e2e tests lulus. Browser tests mencakup popup keyboard, tile gagal, sinkronisasi filter, persistence, detail, screenshot, serta overflow pada 320/768/1440 px. Production build lulus tanpa peringatan ukuran chunk.
- **Aset:** `public/images/hero-unsplash.webp` (foto Unsplash `photo-1581059686229-de26e6ae5dc4`, dekoratif, disimpan lokal).
- **Bundle:** `motion`, `leaflet`, `dexie`, dan `zod` dipisah lewat `manualChunks` Vite; rute dan peta juga dimuat lazy. Landing page tidak melakukan preload Dexie, Zod, maupun Leaflet.
- **Penyimpanan:** Safe adapter `localStorage` dengan validasi saat baca dan laporan kegagalan saat tulis. Kegagalan IndexedDB diterjemahkan menjadi `StorageUnavailableError` dan state eksplisit, bukan state kosong.
- **Batasan:** Client-only, tanpa live AI/backend/payment. Font disajikan lokal; aplikasi belum memiliki service worker/PWA offline setelah kunjungan pertama. Tile OpenStreetMap memerlukan jaringan, sedangkan analisis dan daftar koordinat tetap tersedia jika tile gagal.

## Menjalankan Aplikasi

Node 20.19+/22.12+, `npm ci`, lalu `npm run dev`. Jalankan `npm run check` untuk lint, type-check, tests, dan build, serta `npx playwright test` untuk e2e.

## Langkah Berikutnya

Fase 4: pemilih profil demo, voting lokal berbobot role, evaluasi campaign transaksional, ekspor JSON, dan reset data dengan konfirmasi beserta integration/e2e tests.
