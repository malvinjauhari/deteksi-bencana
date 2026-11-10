# Project Documentation & Blueprint: SiagaNusantara

**Nama Platform:** SiagaNusantara (Sistem Analisis & Mitigasi Bencana)
**Status:** Fase 1 design system dan application shell selesai; dashboard/detail menampilkan empty state sampai data lokal tersedia.
**Tujuan:** Mendemonstrasikan alur pemantauan bencana, perhitungan urgensi, validasi komunitas, dan pembentukan campaign mitigasi dalam satu perangkat.

> **Batasan penting:** MVP menggunakan data simulasi lokal. Aplikasi bukan sistem peringatan dini, tidak terhubung ke AI langsung, tidak menyediakan verifikasi identitas nyata, dan tidak memproses donasi.

---

## 1. Konsep & Ruang Lingkup

### Alur MVP
1. Data simulasi bencana dimasukkan ke IndexedDB saat aplikasi pertama dijalankan.
2. Mesin aturan lokal menghitung `urgency_score` dan membuat analisis berbasis template.
3. Dashboard menampilkan ringkasan, peta, dan feed yang diurutkan berdasarkan urgensi.
4. Pengguna memilih profil demo untuk mensimulasikan validasi berbobot.
5. Event yang memenuhi ambang validasi berubah menjadi campaign mitigasi.
6. Data dapat diekspor sebagai JSON atau direset ke kondisi awal.

Semua perubahan hanya tersimpan pada browser/perangkat tersebut. Tidak ada sinkronisasi antarpengguna atau antarperangkat.

### Peran Demo
1. **Pemerintah/Otoritas:** bobot validasi 3.
2. **NGO/Relawan:** bobot validasi 2.
3. **Warga Lokal:** bobot validasi 1.
4. **Awam:** dapat melihat dashboard tanpa hak validasi.

Pemilihan peran adalah fitur demonstrasi, bukan autentikasi atau verifikasi identitas. Jangan memasukkan KTP atau data pribadi sensitif.

---

## 2. Mesin Analisis Lokal

Analisis menggunakan **Weighted Scoring Model** deterministik, bukan LLM atau AI langsung.

| Parameter | Bobot |
|---|---:|
| Jenis dan skala bencana | 25% |
| Kepadatan penduduk | 25% |
| Dampak terhadap fasilitas vital | 20% |
| Kondisi cuaca susulan | 15% |
| Laporan awal komunitas | 15% |

Setiap faktor dinormalisasi ke skala 0–100. Skor akhir adalah jumlah `nilai_faktor × bobot`, dibulatkan menjadi integer 0–100. Faktor yang tidak tersedia tidak boleh direkayasa; skor dan tingkat kelengkapan data ditampilkan sesuai kontrak di `docs/DISASTER.md`.

**Klasifikasi:** 0–39 `rendah`, 40–69 `waspada`, 70–100 `kritis`.

Narasi dibuat dari template berdasarkan jenis bencana dan faktor dominan. UI wajib menggunakan label **Analisis Otomatis** atau **Simulasi Skor Urgensi**, bukan klaim analisis AI.

---

## 3. Fitur Utama & UI/UX

- **Landing page:** hero, fitur, alur kerja, sumber data simulasi, dan batasan sistem.
- **Dashboard:** metrik ringkas, filter, feed, status kelengkapan data, dan waktu pembaruan lokal.
- **Peta interaktif:** Leaflet + OpenStreetMap dengan marker berdasarkan koordinat.
- **Detail bencana:** skor, faktor pembentuk skor, narasi template, lokasi, dan status.
- **Voting lokal:** satu suara per profil demo per bencana, disimpan di IndexedDB.
- **Campaign mitigasi:** dibentuk oleh ambang voting lokal; hanya berisi informasi tindakan.
- **Preferensi:** tema dan filter ringan di `localStorage`.
- **Portabilitas:** ekspor JSON dan reset data demo.
- **Desain:** minimalis, elegan, responsif, glassmorphism secukupnya, serta dark/light mode.

Tidak ada checkout, QRIS, payment gateway, webhook pembayaran, atau pencatatan transaksi donasi.

---

## 4. Arsitektur Kode Modular

**Stack:** React + Vite + TypeScript, Tailwind CSS, shadcn/ui/Radix, Leaflet, dan Dexie sebagai wrapper IndexedDB. Tidak ada backend untuk MVP.

```text
src/
├── app/                    # Router, providers, dan layout aplikasi
├── components/             # Komponen UI generik
│   ├── layout/
│   └── ui/
├── config/                 # Konfigurasi aplikasi dan environment
├── features/
│   ├── auth/               # Profil dan sesi demo lokal
│   ├── campaigns/          # Status campaign dan informasi mitigasi
│   ├── dashboard/          # Metrik dan layout dashboard
│   ├── disaster-map/       # Peta dan marker
│   ├── disasters/          # Feed, filter, dan detail
│   ├── scoring/            # Kalkulasi skor dan template analisis
│   ├── settings/           # Tema, ekspor, dan reset data
│   └── voting/             # Validasi lokal berbobot
├── lib/
│   ├── db/                 # Dexie schema, migrations, repositories, seed
│   ├── storage/            # Adapter localStorage yang aman
│   └── utils/
├── pages/                  # Landing, Dashboard, Detail, NotFound
├── test/                   # Setup dan utilitas pengujian
├── types/                  # Kontrak TypeScript bersama
├── App.tsx
└── main.tsx
```

Aturan arsitektur:
- Komponen UI tidak mengakses IndexedDB secara langsung; gunakan repository/service domain.
- Kontrak data divalidasi pada batas input seperti seed dan impor JSON.
- Fixture simulasi diberi label jelas dan tidak ditampilkan sebagai data langsung.
- Kegagalan penyimpanan atau peta tidak boleh merusak akses ke daftar bencana berbasis teks.

---

## 5. Penyimpanan Lokal

- **IndexedDB (`siaga-nusantara`):** `disasters`, `analyses`, `demoUsers`, `votes`, dan `metadata`.
- **localStorage:** tema, filter non-sensitif, dan ID sesi demo aktif.
- **Seed:** idempoten berdasarkan ID fixture yang stabil.
- **Migrasi:** gunakan versi schema Dexie; jangan menghapus data pengguna tanpa konfirmasi.
- **Privasi:** jangan simpan KTP, token pembayaran, kredensial, atau data pribadi sensitif.

Detail schema tersedia di `docs/DATABASE.md` dan `docs/CONTRACT.md`.

---

## 6. Task Plan & Roadmap

### Fase 0: Dokumentasi & Fondasi
- [x] Samakan seluruh dokumentasi dengan arsitektur client-only.
- [x] Inisialisasi React/Vite/TypeScript, struktur modular, tooling kualitas, dan CI.
- [x] Buat app shell sederhana, routing awal, dan komponen Button dasar.
- [x] Bangun design tokens lengkap, tema, responsive shell, komponen UI inti, dan polished landing pada Fase 1.

### Fase 1: Data & Analisis Lokal
- Implementasikan Dexie schema, repository, migrasi, dan seed idempoten.
- Implementasikan weighted scoring dan template narasi.
- Uji bencana ekstrem/kecil, data tidak lengkap, dan batas skor.

### Fase 2: Dashboard & Peta
- Bangun landing page, metrik, feed, filter, dan detail bencana.
- Integrasikan Leaflet dengan fallback daftar berbasis teks.
- Tambahkan responsive, empty, loading, error, dan storage-unavailable states.

### Fase 3: Validasi & Campaign Lokal
- Implementasikan pemilihan profil demo dan sesi lokal.
- Implementasikan satu vote unik dan transaksi pembentukan campaign.
- Tambahkan ekspor JSON dan reset data demo.

### Fase 4: Quality & Deployment
- Uji persistence, aksesibilitas, responsivitas, dan alur offline.
- Jalankan lint, type-check, test, dan production build.
- Deploy sebagai static site ke Vercel/Netlify.

---

## 7. Definition of Done

Setiap unit kerja harus:
1. Memiliki perilaku dan tampilan sesuai dokumen terkait.
2. Menyertakan pengujian yang relevan dan tidak menampilkan data simulasi sebagai data nyata.
3. Lulus lint, type-check, test, dan build yang berlaku.
4. Memperbarui `docs/CURRENT_STATE.md`, `docs/NOW.md`, `docs/TASKS.md`, dokumen domain terkait, dan `docs/CHANGELOG.md` bila diperlukan.
5. Dicommit dengan Conventional Commits dan didorong ke `origin/main` setelah validasi lokal.
