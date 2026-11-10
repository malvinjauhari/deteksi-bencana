# Project Documentation & Blueprint: SiagaNusantara

**Nama Platform:** SiagaNusantara (Sistem Analisis & Mitigasi Bencana Berbasis AI)
**Tujuan Utama:** Mempercepat mitigasi dan penanggulangan bencana dengan memangkas waktu dari terjadinya bencana hingga munculnya *campaign* tanggap darurat, menggunakan analisis AI untuk skoring urgensi dan sistem *voting* berbasis komunitas (Human-in-the-loop) untuk validasi akhir.

---

## 1. Definisi Konsep & Non-Teknis

### A. Urgensi Sistem & Jeda Waktu (SLA Mitigasi)
Sistem ini memecahkan masalah *delay* informasi. Alur jeda waktunya:
1. **Kejadian Bencana (T=0)**
2. **Penarikan Data API (T+1 hingga T+5 Menit):** Sistem otomatis menarik data dari BMKG/NASA.
3. **Analisis AI (T+6 Menit):** AI menghitung *Urgency Score* dan menyusun narasi dampak komprehensif.
4. **Voting & Validasi (T+10 hingga T+30 Menit):** *Alert* dipublikasikan ke *dashboard*. Validator manusia melakukan *voting*.
5. **Campaign/Tindakan Aktif (T+30 Menit):** Bencana dengan skor *vote* tertinggi otomatis dinaikkan menjadi *Campaign Tanggap Darurat*.

### B. Lapisan Masyarakat untuk Sistem *Voting*
Keputusan (*decision*) tetap berada di tangan manusia. Lapisan masyarakat yang memiliki hak *vote* (Validator):
1. **Pemerintah/Otoritas Lokal:** BPBD atau lembaga terkait (Bobot vote: Tinggi).
2. **NGO & Relawan Terverifikasi:** PMI, Basarnas, organisasi kemanusiaan lokal (Bobot vote: Sedang).
3. **Tokoh Masyarakat/Warga Lokal Terverifikasi:** Warga di radius 50km dari titik bencana yang akunnya sudah diverifikasi menggunakan KTP/Sistem *Civic* (Bobot vote: Standar).

---

## 2. Parameter Analisis AI & Pipeline (Teknis)

Analisis AI tidak menggunakan logika statis (`if korban > 100`), melainkan menggunakan **Weighted Scoring Model** (Skala 0-100).

### A. Parameter & Bobot Kalkulasi (*Urgency Score*)
1. **Jenis & Skala Bencana (Bobot 25%):** Magnitudo gempa, luas area kebakaran (NASA FIRMS), kedalaman banjir.
2. **Kepadatan Penduduk di Lokasi (Bobot 25%):** AI melakukan *cross-reference* koordinat bencana dengan data demografi BPS/OpenStreetMap. Bencana di area padat = skor eksponensial.
3. **Estimasi Dampak Infrastruktur (Bobot 20%):** Kedekatan titik bencana dengan fasilitas vital (RS, jalan utama, pembangkit listrik).
4. **Kondisi Cuaca Susulan (Bobot 15%):** Data curah hujan/angin susulan (nowcast BMKG) yang bisa memperparah kondisi.
5. **Estimasi Korban & Laporan Awal (Bobot 15%):** Data awal yang masuk dari media sosial atau laporan komunitas lokal.

### B. Pipeline AI
1. **Data Ingestion Layer:** `cron-job` menarik data dari API BMKG, BNPB, dan NASA FIRMS setiap 5 menit.
2. **Preprocessing:** Standardisasi format koordinat (Lat/Long) dan waktu (UTC ke WIB).
3. **Inference Engine (AI):** Memasukkan kelima parameter di atas ke model AI (bisa menggunakan integrasi LLM/Gemini API berbalut prompt terstruktur JSON atau model regresi kustom).
4. **Output Generation:** 
   - `urgency_score`: Integer 0-100.
   - `human_readable_analysis`: Paragraf ramah pengguna.
5. **Database Sink:** Menyimpan hasil ke Firestore/PostgreSQL, memicu WebSocket untuk *real-time update* di *dashboard* FE.

---

## 3. Fitur Utama & UI/UX

*   **Styling:** Minimalis, Elegan, Clean (TailwindCSS, Radix UI/shadcn, glassmorphism).
*   **Auth:** Login via Email (tersimpan di `localStorage` / Context untuk MVP).
*   **Interactive Map (Peta Visual):** Integrasi Leaflet/Mapbox. Render heatmap NASA atau episentrum BMKG.
*   **Disaster Feed & Voting Card:** Daftar bencana diurutkan berdasarkan *Urgency Score*. Tombol *Upvote/Validate* untuk user.
*   **User-Friendly Analysis Panel:** Bahasa teknis diterjemahkan otomatis oleh AI menjadi indikator visual (Merah/Kuning/Hijau).

---

## 4. Arsitektur Kode Modular

### Frontend (React/Next.js/Vite)
```text
src/
├── components/            # Komponen UI (Button, Card, MapVisualizer, UrgencyBadge)
├── config/                # Firebase, Mapbox/Leaflet tokens
├── features/              # Modul berbasis domain
│   ├── auth/              # Flow login, Role Context (Awam vs Validator)
│   ├── dashboard/         # Layout utama, summary metrik keseluruhan
│   ├── disaster-map/      # Logic peta interaktif, render titik koordinat
│   ├── feed-analysis/     # List bencana, kartu analisis AI ramah pengguna
│   ├── voting/            # Mekanisme upvote/validasi dari masyarakat
│   └── public/            # Landing page minimalis
├── lib/                   # Utils (format-date, urgency-color-mapper)
├── services/              # API Clients
│   ├── api-client.ts      # Axios/Fetch interceptors ke Backend kita
│   └── local-storage.ts   # Handler JWT/Session statis
├── types/                 # Interface (DisasterEvent, UrgencyScore, UserRole)
├── App.tsx                # Main Router
└── main.tsx               
```

### Backend (Node.js/Express/Hono - Modular)
```text
server/
├── app.ts                 # Entry point, middleware, mount routes
├── config/                # ENV loader
├── controllers/           # Logika bisnis per domain
├── services/              # Koneksi ke pihak ke-3
│   ├── ai-engine.ts       # Logic prompt & kalkulasi bobot ke LLM
│   ├── bmkg.ts            # Fetch & Parse Gempa/Cuaca (XML/JSON parser)
│   ├── inarisk.ts         # Fetch data banjir/longsor BNPB
│   └── nasa-firms.ts      # Fetch data kebakaran hutan
├── routes/
│   ├── auth.ts            # Login & JWT generator
│   ├── disasters.ts       # GET /disasters (termasuk filter & sort by urgency)
│   ├── maps.ts            # GET /maps/geojson (Data khusus untuk render peta FE)
│   └── votes.ts           # POST /votes/:id (Mencatat validasi manusia)
├── jobs/                  
│   └── fetch-cron.ts      # Scheduler untuk tarik API eksternal tiap 5 menit
└── api/index.ts           # Export Vercel / Serverless function
```

---

## 5. Task Plan & Roadmap (Project Manager View)

**Fase 1: Setup & Integrasi Data Dasar (Minggu 1)**
- Inisialisasi repo FE & BE dengan struktur modular di atas.
- Buat UI/UX Wireframe & Design System (Tailwind/Shadcn).
- BE: Implementasi `cron-job` untuk *pull* data dari BMKG, INARISK, dan NASA FIRMS.
- BE: Normalisasi semua data dari berbagai API tersebut menjadi satu *schema* JSON standar di database.

**Fase 2: AI Pipeline & Peta Interaktif (Minggu 2)**
- BE: Kembangkan `ai-engine.ts` untuk mengolah data mentah menjadi *Urgency Score* (0-100) dan teks analisis ramah awam.
- FE: Integrasi Mapbox/Leaflet. Buat komponen peta yang me-*render* koordinat berdasarkan data backend.
- FE: Buat halaman Dashboard dan *Disaster Feed* yang menampilkan hasil analisis AI.

**Fase 3: Autentikasi & Sistem Voting (Minggu 3)**
- FE/BE: Implementasi *Login statis* (Email/Localstorage -> JWT).
- BE: Buat endpoint untuk sistem *voting* dan perhitungan bobot berdasarkan *role* user.
- FE: Pasang UI *Voting* di tiap *Disaster Card*.

**Fase 4: Polishing & Deployment (Minggu 4)**
- Refactor kode, pastikan implementasi *glassmorphism* & *dark/light mode* rapi dan responsif.
- Testing ketepatan *Urgency Score* AI dari *dummy data* bencana ekstrem vs bencana kecil.
- Deploy BE (Vercel/Render) & FE (Vercel/Netlify).
