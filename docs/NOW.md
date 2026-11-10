# Now (Current Focus)

## Fase 1 Selesai

Design tokens, light/dark/system theme, floating navigation, mobile dialog, komponen UI inti, landing page, status states, hash scrolling, serta sembilan routing/theme tests telah tersedia dan tervalidasi. Dashboard/detail tetap empty states yang jujur.

## Unit Kerja Berikutnya: Fase 2 — Local Data & Scoring

1. Lengkapi tipe `Analysis`, `DemoUser`, `Vote`, dan validator runtime sesuai `CONTRACT.md`.
2. Implementasikan Dexie database `siaga-nusantara` schema v1, index unik vote, dan repository.
3. Buat fixture bencana/profil demo dengan `is_simulation`/`is_demo` serta waktu fixture yang tidak berubah setiap reload.
4. Implementasikan seed idempoten berbasis ID stabil dan metadata versi.
5. Implementasikan weighted scoring, missing-factor renormalization, severity, data completeness, dan template narasi.
6. Unit test batas skor, bobot, pembulatan, invalid/non-finite input, faktor null, severity, dan narasi.
7. Generalisasi safe localStorage adapter untuk filter/sesi pada fase berikutnya tanpa menduplikasi data domain.
8. Jalankan `npm run check`, perbarui dokumentasi domain/status, lalu commit dan push.

Jangan menghubungkan kartu dashboard ke angka hardcoded; gunakan repository setelah persistence dan scoring siap.
