# Troubleshooting & Fallbacks

## IndexedDB Tidak Tersedia / Quota Penuh

Tangkap error Dexie/IndexedDB dan tampilkan status **Data tidak dapat disimpan**. Jangan menyatakan vote/reset berhasil. Sediakan fixture read-only bila memungkinkan dan sarankan pengguna memeriksa mode privat, izin penyimpanan, atau ruang perangkat.

## localStorage Gagal atau Data Rusak

Bungkus baca/tulis dengan `try/catch`, validasi nilai, dan gunakan preferensi default. Preferensi rusak dapat dihapus tanpa menghapus IndexedDB. Jangan biarkan kegagalan tema/filter merusak dashboard.

## Data Demo Tidak Muncul

Periksa metadata seed dan console error, lalu gunakan **Reset Data Demo** setelah konfirmasi. Seed harus idempoten; jangan membuat fixture duplikat setiap reload.

## Skor Tidak Tersedia

Jika seluruh faktor bernilai `null`, tampilkan **Belum Dinilai**, bukan skor 0. Jika hanya sebagian tersedia, tampilkan **Skor Sementara** beserta `data_completeness`. Tidak ada fallback ke AI karena AI tidak digunakan.

## Peta atau Tile Gagal

Pertahankan feed dan detail berbasis teks. Tampilkan pesan bahwa peta/tile tidak dapat dimuat dan sediakan koordinat lokasi. Aplikasi inti tidak bergantung pada keberhasilan OpenStreetMap.

## Vote Duplikat / Profil Tidak Valid

Tolak operasi melalui service dan tampilkan pesan non-teknis. Jangan menambah agregat jika transaksi gagal. Pengguna dapat keluar lalu memilih profil demo lain untuk menguji skenario, dengan tetap memahami bahwa ini bukan kontrol keamanan.

## Data Perlu Dipindahkan

Gunakan ekspor JSON sebelum reset atau membersihkan site data. Tidak ada sinkronisasi cloud; membersihkan data browser dapat menghapus perubahan secara permanen.

## Masalah Build

Jalankan `npm ci`, `npm run lint`, `npm run typecheck`, `npm run test -- --run`, dan `npm run build` setelah tooling tersedia. Periksa versi Node pada `package.json`/dokumentasi setup yang akan dibuat saat inisialisasi aplikasi.
