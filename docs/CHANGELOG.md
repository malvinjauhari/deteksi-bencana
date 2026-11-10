# Changelog

## [Unreleased] — Phase 0 Application Setup

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
