# Changelog

## [Unreleased] — Phase 2 Local Data & Deterministic Scoring

- Menambahkan tipe domain lengkap (`Disaster`, `Analysis`, `DemoUser`, `Vote`, `FactorBreakdown`, filter) di `src/types/disaster.ts` beserta validator runtime Zod di `src/lib/validation/schemas.ts`.
- Menambahkan Dexie database `siaga-nusantara` schema v1 dengan store `disasters`, `analyses`, `demoUsers`, `votes`, dan `metadata`, termasuk index unik `[disaster_id+demo_user_id]`.
- Menambahkan repository per store di `src/lib/db/repositories/` dan seed idempoten di `src/lib/db/seed.ts` (`seedDatabase`, `isSeeded`, `resetDemoData`) berbasis ID stabil serta metadata versi.
- Menambahkan enam fixture simulasi bencana (satu data parsial, satu tanpa data) dan empat profil demo berbobot 3/2/1/0 di `src/lib/db/fixtures/`.
- Menambahkan mesin skor deterministik di `src/features/scoring/` dengan bobot 25/25/20/15/15, renormalisasi bobot saat faktor `null`, `data_completeness`, `is_provisional`, severity 0–39/40–69/70–100, dan narasi template tanpa LLM. Faktor yang hilang tidak pernah direkayasa.
- Menambahkan generalisasi safe localStorage adapter di `src/lib/storage/safe-storage.ts` serta lapisan preferensi tema dan filter yang tervalidasi.
- Menambahkan `disaster-service.ts` sebagai satu-satunya pintu masuk data dengan filtering, sorting, dan penerjemahan kegagalan IndexedDB menjadi `StorageUnavailableError`.
- Dashboard kini menampilkan summary card dari data aktual, pencarian, filter jenis, filter urutan, dan state loading/empty/error/"penyimpanan lokal tidak tersedia".
- Halaman detail bencana menampilkan ringkasan analisis, rincian lima faktor beserta bobot dan kontribusi, label skor sementara dan belum dinilai, langkah mitigasi, serta koordinat.
- Rute dashboard dan detail dimuat secara lazy dan Dexie/Zod dipisah lewat `manualChunks`; bundle utama turun ke ±407 kB dan landing page tidak melakukan preload Dexie maupun Zod.
- Menambahkan 44 unit test baru (scoring, narasi, severity, validator Zod, seed idempoten, adapter storage) dan 7 Playwright e2e tests (seed dashboard, filter, skor sementara, detail, belum dinilai, not-found, screenshot review).
- Validasi: lint, strict type-check, 53 unit tests, 14 e2e tests, production build tanpa peringatan ukuran chunk, screenshot review dashboard/detail/mobile, dan npm audit 0 vulnerability.

## Hero Motion & Image Backdrop

- Menambahkan hero jumbotron dengan foto Unsplash lokal (WebP, dekoratif `alt=""`) plus overlay gradien berlapis untuk menjaga contrast teks.
- Menambahkan animasi halus: parallax gambar saat scroll, stagger masuk, garis radar berputar lambat, scroll reveal per seksi, hover lift pada feature card, dan indikatorscroll.
- Menambahkan `MotionProvider` berbasis `LazyMotion`/`domAnimation` dengan komponen `m` agar runtime animasi di-code-split; bundle utama turun dari 560 kB ke 404 kB dan motion terpecah menjadi chunk 106 kB.
- Menambahkan `manualChunks` Vite untuk `motion` dan `leaflet`; peringatan ukuran bundle hilang.
- Menonaktifkan semua animasi dekoratif pada `prefers-reduced-motion: reduce` dengan konten tetap tampil pada kondisi akhir.
- Menambahkan Playwright + 6 e2e tests: hero image load, animasi visible, reduced motion, scroll reveal, dark mode, dan 320 px tanpa horizontal overflow; CI kini menjalankan e2e.
- Validasi: lint, strict type-check, 9 unit tests, 6 e2e tests, production build, screenshot review light/dark/mobile, dan npm audit 0 vulnerability.

## Phase 1 Design System & Shell

- Menambahkan semantic color/radius/shadow tokens, dark mode, DM Sans/Playfair Display self-hosted, dan reduced-motion behavior.
- Menambahkan ThemeProvider, safe theme storage, system-theme subscription, theme-color sync, dan anti-theme-flash bootstrap.
- Membangun floating glass header, responsive mobile Radix Dialog, footer, hash scrolling, dan scroll restoration.
- Menambahkan komponen reusable Button, Card, Badge, Dialog, Input, Select, dan Loading/Empty/Error StatusState.
- Membangun polished landing page dengan hero, feature cards, alur kerja, batasan simulasi, dan CTA tanpa metrik palsu.
- Memperbarui dashboard/detail menjadi empty states informatif hingga Fase 2 tersedia.
- Menambahkan tests mobile navigation, Escape/focus restoration, theme validation/persistence, storage failure, dan OS theme changes; total 9 tests lulus.
- Validasi lint, strict type-check, production build, HTTP smoke test, dan npm audit 0 vulnerability. Audit manual browser/screen reader tetap dijadwalkan pada Fase 5.

## Phase 0 Application Setup

- Menginisialisasi React 19, Vite 7, TypeScript strict, dan Tailwind CSS 4 dengan lockfile.
- Menambahkan konfigurasi shadcn/ui, Radix Slot, React Router, Dexie, Leaflet, serta utilitas komponen.
- Membuat struktur folder domain-driven, app shell awal, landing awal, dan route `/`, `/dashboard`, `/disasters/:id`, serta 404.
- Menambahkan placeholder eksplisit agar dashboard/detail tidak dianggap fitur selesai.
- Menambahkan ESLint, Vitest/jsdom, React Testing Library, coverage, tiga routing tests, dan GitHub Actions CI.
- Menambahkan `.gitignore`, `.env.example`, README setup, script `check`, dan konfigurasi build production.
- Validasi: lint, type-check, 3 tests, build, dev-server smoke test, dan npm audit 0 vulnerability.

## Documentation Setup

- Menyelaraskan blueprint menjadi MVP client-side React + Vite + TypeScript.
- Menetapkan IndexedDB/Dexie untuk data domain dan localStorage untuk preferensi/sesi demo.
- Mengganti live AI dengan weighted scoring deterministik, missing-data handling, dan narasi template.
- Mendokumentasikan kontrak TypeScript, schema IndexedDB v1, seed, migrasi, ekspor, dan reset.
- Menetapkan role demo, bobot vote, aturan unik, dan threshold campaign lokal.
- Menghapus payment gateway, Duitku/QRIS, donasi, dan webhook dari ruang lingkup.
- Menambahkan roadmap setup/implementasi, acceptance criteria, troubleshooting, dan batasan keamanan.
- Memperbarui design system dengan aksesibilitas, responsivitas, dan aturan penyajian data simulasi.

## [v0.1.0] — Initial

- Inisialisasi blueprint proyek SiagaNusantara.
- Pembuatan standar dokumentasi dan pedoman styling awal.
