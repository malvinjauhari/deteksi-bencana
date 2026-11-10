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

## 5. Implementasi Teknis (TailwindCSS - Rekomendasi)
*   **Glassmorphism:** `backdrop-blur-md bg-white/50` (atau variasi opasitas yang sesuai).
*   **Pill Buttons:** `rounded-full bg-black text-white shadow-lg`.
*   **Serif Fonts:** Konfigurasi `font-serif` di Tailwind dengan font pilihan (misal: Playfair Display).