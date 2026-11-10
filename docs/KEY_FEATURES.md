# Key Features

1. **Landing Page Informatif:** Hero, fitur, alur kerja, dan penjelasan eksplisit bahwa aplikasi adalah simulasi lokal.
2. **Peta Visual Interaktif:** Marker koordinat, detail lokasi, warna/status urgensi, dan fallback daftar teks.
3. **Disaster Feed:** Daftar bencana dengan pencarian, filter jenis/status, dan pengurutan berdasarkan urgensi atau waktu.
4. **Analisis Otomatis Lokal:** Weighted scoring 0–100, rincian faktor, tingkat kelengkapan data, dan narasi template yang mudah dipahami. Bukan live AI.
5. **Validasi Komunitas Lokal:** Profil demo berbobot, satu vote per profil/bencana, dan pembentukan campaign berdasarkan ambang lokal.
6. **Campaign Mitigasi:** Informasi tindakan tanpa checkout, donasi, atau payment gateway.
7. **Persistensi Satu Perangkat:** IndexedDB untuk data domain; `localStorage` untuk tema, filter, dan profil demo aktif.
8. **Kontrol Data:** Ekspor JSON dan reset fixture dengan konfirmasi.
9. **UI Adaptif & Aksesibel:** Dark/light mode, layout responsif, navigasi keyboard, status non-warna, dan reduced motion.

Semua fitur beroperasi pada data lokal dan tidak menyediakan peringatan bencana resmi atau sinkronisasi antarpengguna.
