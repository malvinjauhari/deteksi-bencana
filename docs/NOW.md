# Now (Current Focus)

## Fase 2 Selesai

Layer data lokal dan mesin skor deterministik sudah aktif. Dashboard kini menampilkan enam fixture simulasi yang nyata dari IndexedDB beserta skor, severity, kelengkapan data, dan status skor sementara. Detail Pageable menampilkan rincian faktor dan langkah mitigasi. 53 unit tests, 14 Playwright e2e tests, lint, strict type-check, dan production build lulus.

## Unit Kerja Berikutnya: Fase 3 — Dashboard, Feed & Map (lanjutan)

1. Integrasikan Leaflet dengan marker yang aksesibel dan padanan daftar teks.
2. Sediakan fallback daftar teks/koordinat saat peta atau tile gagal dimuat.
3. Terapkan panel filter yang lebih lengkap (status campaign) dan simpan sebagai preferensi tervalidasi.
4. Tambahkan tampilan peta pada detail bencana dengan ringkasan koordinat yang terbaca tanpa peta.
5. Uji halaman dashboard pada 320 px, tablet, dan desktop dengan audit keyboard serta contrast.
6. Jalankan `npm run check` dan `npx playwright test`, perbarui dokumentasi domain/status, lalu commit dan push.

## Catatan Arsitektur

- Modul scoring berada di `src/features/scoring/` dan tidak bergantung pada IndexedDB, sehingga tetap deterministik dan dapat diuji terpisah.
- Modul database berada di `src/lib/db/` (schema, fixture, repository, seed) dan hanya dipakai lewat `src/features/disasters/disaster-service.ts`.
- Rute dashboard dan detail dimuat secara lazy agar bundle landing page tetap ±407 kB dan tidak menarik Dexie maupun Zod.
- Preferensi tema dipisah dari preferensi filter agar validasi Zod tidak masuk ke bundle awal.
- `StorageUnavailableError` menerjemahkan kegagalan IndexedDB (private mode, storage dinonaktifkan) menjadi state "penyimpanan lokal tidak tersedia", bukan state kosong.
- Seed memakai ID stabil dan metadata versi sehingga aman dijalankan ulang; `occurred_at` diturunkan dari waktu seed agar simulasi selalu tampak baru.
