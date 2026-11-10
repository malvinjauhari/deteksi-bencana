# Design System & Styling Reference (SiagaNusantara)

Berdasarkan referensi visual dari `image_e3b45e.jpg` dan pendekatan desain minimalis yang elegan, berikut adalah panduan styling utama untuk antarmuka SiagaNusantara:

## 1. Konsep Visual Utama
*   **Minimalis, Elegan, & Clean:** Antarmuka yang lega dengan ruang kosong (*white space*) yang proporsional untuk fokus pada konten penting.
*   **Glassmorphism (Efek Kaca):** Diterapkan secara halus pada elemen melayang seperti *Navigation Bar* (Header) dan *pop-over* peta. Latar belakang semi-transparan dengan efek *blur* latar belakang.
*   **Structured Cards:** Konten (seperti daftar bencana dan analisis) dibungkus dalam *card* bersudut membulat (*rounded corners*) dengan *shadow* yang sangat lembut.

## 2. Tipografi
*   **Headings (Judul & Subjudul):** Menggunakan font **Serif** yang elegan (seperti pada referensi gambar) untuk memberikan kesan berwibawa, terpercaya, dan editorial.
*   **Body Text & UI Elements:** Menggunakan font **Sans-Serif** modern (seperti Inter, SF Pro, atau Roboto) untuk memastikan keterbacaan tinggi pada teks paragraf dan data analisis.

## 3. Komponen UI Spesifik (Berdasarkan Referensi)
*   **Navigation Bar:** *Floating header* (melayang di atas konten/background) dengan efek *backdrop-blur*. Menampilkan logo di kiri, menu navigasi (*Home, Features, dll.*) di tengah, dan tombol aksi di kanan.
*   **Tombol (Buttons):** Berbentuk *pill* (sudut membulat penuh / `rounded-full`). Tombol utama menggunakan warna gelap pekat (hitam/dark grey) dengan *drop shadow* melingkar (*glow* halus) agar terlihat menonjol dan dapat diklik.
*   **Hero Section:** Tata letak teks terpusat (*center-aligned*) di atas *background* visual yang dominan (peta/ilustrasi). Tajuk besar di atas, diikuti sub-tajuk deskriptif yang lebih kecil, dan diakhiri dengan tombol *Call to Action* (CTA).

## 4. Palet Warna (Color Palette)
*   **Background Utama:** Terang, bersih (*off-white*) dengan opsi *Dark Mode* yang menggunakan warna abu-abu sangat gelap (bukan hitam murni).
*   **Aksi Utama (Primary):** Gelap pekat (Hitam atau Slate-900) untuk tombol dan teks utama.
*   **Indikator Urgensi (Urgency Score):**
    *   **Kritis (Tinggi):** Merah lembut (*Soft Rose / Crimson*).
    *   **Waspada (Sedang):** Kuning/Oranye hangat (*Amber*).
    *   **Informasi (Rendah):** Biru pastel atau hijau redup (*Slate Blue / Emerald*).

## 5. Implementasi Teknis (TailwindCSS)
*   **Glassmorphism:** `backdrop-blur-md bg-white/50` atau varian dark dengan contrast yang lolos; sediakan fallback opaque bila blur tidak didukung.
*   **Pill Buttons:** `rounded-full bg-slate-900 text-white shadow-lg` dengan hover, active, disabled, dan `focus-visible` yang jelas.
*   **Serif Fonts:** gunakan Playfair Display untuk heading dan Inter untuk body/UI, dengan system-font fallback dan tanpa blocking render.
*   **Layout:** mobile-first, container konsisten, target sentuh minimal 44×44 px, dan tanpa horizontal overflow pada lebar 320 px.
*   **Motion:** transisi singkat dan fungsional; hormati `prefers-reduced-motion`.

## 6. Komponen & Status Sistem

* **Landing:** hero, key features, alur kerja, dan CTA menuju dashboard.
* **Dashboard:** summary cards, filter/search, disaster feed, dan peta. Pada mobile, feed dan peta tidak saling menutupi.
* **Disaster Card:** jenis, lokasi, waktu, skor/severity, kelengkapan data, status campaign, dan aksi detail.
* **Score Breakdown:** nilai dan bobot tiap faktor; tampilkan **Skor Sementara** bila data tidak lengkap dan **Belum Dinilai** bila skor `null`.
* **Voting Panel:** label **Mode Demo**, profil aktif, bobot, total bobot, dan status vote. Warna bukan satu-satunya penyampai status.
* **Campaign:** informasi mitigasi saja; tidak ada CTA donasi atau pembayaran.
* **System States:** loading, empty, error, storage unavailable, map/tile failure, dan reset confirmation harus dirancang sejak awal.
* **Simulation Notice:** badge/banner **Data Simulasi** tampil pada dashboard/detail; jangan gunakan label Live, AI Analysis, atau sumber resmi untuk fixture.

## 7. Accessibility & Content

* Gunakan landmark, satu `h1` per halaman, struktur heading berurutan, label form, dan semantic buttons/links.
* Semua fungsi dapat digunakan dengan keyboard; dialog memiliki focus management dan navigasi mobile memiliki accessible name.
* Teks normal menargetkan contrast WCAG AA 4.5:1; komponen/focus indicator minimal 3:1.
* Marker peta memiliki padanan informasi dalam daftar teks; koordinat dapat dibaca tanpa peta.
* Tema mengikuti preferensi sistem secara default dan pilihan pengguna disimpan di localStorage.
* Bahasa utama UI adalah Bahasa Indonesia yang ringkas; istilah teknis diberi konteks dan tidak membuat klaim prediksi/peringatan resmi.

## 8. Acceptance Checklist

- [x] Shell menggunakan mobile-first layout, mobile dialog, desktop navigation, dan brand compact di bawah 380 px.
- [x] Semantic light/dark tokens dan tiga mode tema diimplementasikan; audit contrast manual lintas browser tetap bagian Fase 5.
- [x] Focus indicators, keyboard dialog/Escape, reduced motion, dan touch targets tersedia pada komponen Fase 1.
- [x] Loading/empty/error component dan safe theme-storage fallback tersedia; offline/PWA serta IndexedDB-unavailable state diimplementasikan pada fase terkait.
- [x] Landing/dashboard memberi label simulasi dan tidak mengklaim analisis AI atau data langsung.
- [x] Tidak ada elemen donasi, payment, live AI, atau verifikasi identitas nyata.
- [ ] Audit manual responsif 320 px/tablet/desktop, contrast, dan screen reader pada Fase 5.