# SiagaNusantara — Deteksi Bencana

Prototipe client-side untuk simulasi analisis urgensi, validasi komunitas, dan mitigasi bencana. **Bukan sistem peringatan dini resmi.**

## Status

Fase 1 tersedia: fondasi React/Vite/TypeScript, responsive application shell, design system, light/dark/system theme, polished landing page, routing, testing, linting, dan CI. Dashboard/detail masih empty state; IndexedDB, scoring, peta, dan voting belum diimplementasikan.

## Prasyarat

- Node.js 20.19+ atau 22.12+ (CI menggunakan Node 22).
- npm 10+.

## Menjalankan Proyek

```bash
npm ci
npm run dev
```

Buka URL yang ditampilkan Vite. Tidak ada API key atau environment variable yang diperlukan; `.env.example` hanya berisi panduan.

## Perintah Kualitas

```bash
npm run lint       # ESLint
npm run typecheck  # TypeScript project references
npm run test:run   # Vitest, satu kali
npm run build      # Type-check + production build
npm run check      # Seluruh validasi di atas
npm run preview    # Pratinjau hasil build
npm run test:e2e   # Playwright (butuh `npx playwright install chromium`)
```

CI GitHub Actions menjalankan install, lint, type-check, test, build, dan e2e untuk `main` serta pull request.

## Aset Gambar

`public/images/hero-unsplash.webp` adalah foto Unsplash (`photo-1581059686229-de26e6ae5dc4`) yang dioptimalkan menjadi WebP dan disimpan lokal. Foto bersifat dekoratif (`alt=""`) dan tidak menyatakan lokasi atau kejadian nyata.

## Batasan MVP

- Data simulasi lokal, tanpa ingest BMKG/BNPB/NASA langsung.
- Analisis deterministik, tanpa live AI/LLM.
- IndexedDB/Dexie untuk data domain dan localStorage untuk preferensi/sesi demo (dijadwalkan Fase 2).
- Voting lokal satu perangkat, bukan autentikasi atau verifikasi identitas nyata.
- Tanpa backend, payment gateway, donasi, atau sinkronisasi cloud.

## Dokumentasi

Mulai dari [`PROJECT_BLUEPRINT.md`](./PROJECT_BLUEPRINT.md), kemudian [`docs/NOW.md`](./docs/NOW.md) untuk pekerjaan berikutnya dan [`docs/TASKS.md`](./docs/TASKS.md) untuk roadmap. Setiap perubahan perilaku harus disertai sinkronisasi dokumentasi terkait.
