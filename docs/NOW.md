# Now (Current Focus)

## Fase 3 Selesai

Dashboard dan detail kini memiliki peta Leaflet/OpenStreetMap, marker severity yang dapat dioperasikan dengan keyboard, popup aman, serta daftar lokasi/koordinat yang selalu tersedia. Kegagalan tile menampilkan peringatan eksplisit tanpa menyembunyikan analisis. Filter status campaign tersimpan bersama pencarian, jenis, dan urutan. Kejadian tanpa skor selalu berada di akhir pengurutan urgensi. 60 unit tests, 20 Playwright e2e tests, lint, strict type-check, dan production build lulus.

## Unit Kerja Berikutnya: Fase 4 — Demo Voting, Campaign & Data Controls

1. Buat pemilih profil demo dengan label Mode Demo dan kelola `siaga.demo.activeProfileId`.
2. Implementasikan satu vote per profil/bencana, tolak role `AWAM`, dan tentukan bobot 3/2/1 di service.
3. Jalankan vote, pembaruan agregat, dan evaluasi campaign dalam satu transaksi dengan threshold bobot ≥5 serta skor ≥70.
4. Tampilkan status vote/campaign dan informasi mitigasi tanpa donasi atau pembayaran.
5. Implementasikan ekspor JSON serta reset data dengan konfirmasi.
6. Tambahkan integration test duplikat, role invalid, transaksi gagal, threshold, dan persistence.
7. Jalankan `npm run check` dan `npx playwright test`, sinkronkan dokumentasi, lalu commit dan push.

## Catatan Arsitektur

- Modul scoring berada di `src/features/scoring/` dan tidak bergantung pada IndexedDB, sehingga tetap deterministik dan dapat diuji terpisah.
- Modul database berada di `src/lib/db/` dan hanya dipakai lewat `src/features/disasters/disaster-service.ts`.
- Rute dashboard/detail dan modul peta dimuat secara lazy. `motion`, `dexie`, `zod`, dan `leaflet` dipisah menjadi chunk tersendiri.
- `src/features/disaster-map/disaster-map-panel.tsx` menjadi lazy boundary; komponen Leaflet hanya dimuat ketika peta ditampilkan.
- Preferensi tema dipisah dari preferensi filter agar validasi Zod tidak masuk ke bundle awal. Pembacaan preferensi tanpa adapter eksplisit menggunakan `safeStorage` browser.
- `StorageUnavailableError` menerjemahkan kegagalan IndexedDB menjadi state "penyimpanan lokal tidak tersedia", bukan state kosong.
- Tile OpenStreetMap memerlukan jaringan; daftar teks/koordinat dan analisis tidak bergantung pada keberhasilan tile.
- Seed memakai ID stabil dan metadata versi sehingga aman dijalankan ulang; `occurred_at` diturunkan dari waktu seed agar simulasi selalu tampak baru.
