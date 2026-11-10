# Architecture Decisions (ADR)

## ADR-001: Client-only untuk MVP

**Status:** Accepted

Gunakan React SPA tanpa backend. IndexedDB menyimpan data domain dan `localStorage` hanya menyimpan preferensi/sesi demo. Keputusan ini mengurangi kompleksitas deployment dan memenuhi kebutuhan prototipe satu perangkat, dengan konsekuensi tidak ada sinkronisasi atau otoritas server.

## ADR-002: Dexie di atas IndexedDB

**Status:** Accepted

Dexie digunakan untuk schema versioning, index, transaksi, dan API yang lebih mudah diuji. Akses database dibungkus repository agar implementasi dapat diganti tanpa mengubah komponen UI.

## ADR-003: Scoring deterministik, bukan live AI

**Status:** Accepted

Skor dihitung dengan weighted scoring 0–100 dan narasi berbasis template. Tidak ada Gemini/LLM/API inference. Pendekatan ini dapat diaudit, direproduksi, dan diuji. UI tidak boleh menyebut hasil sebagai analisis AI.

## ADR-004: Human-in-the-loop sebagai simulasi

**Status:** Accepted

Profil otoritas, NGO, dan warga memberi bobot 3, 2, dan 1. Validasi hanya demonstrasi lokal; pemilihan role bukan bukti identitas. Satu profil hanya dapat memberi satu vote per bencana.

## ADR-005: React + Vite + TypeScript

**Status:** Accepted

Vite dipilih untuk SPA statis yang modular dan sederhana. React menyediakan model komponen reusable; TypeScript memperjelas kontrak domain. SSR tidak dibutuhkan pada MVP.

## ADR-006: Payment dan donasi dikeluarkan

**Status:** Accepted

Duitku, QRIS, webhook, transaksi, dan administrasi pencairan tidak diimplementasikan. Campaign hanya menyajikan status dan informasi mitigasi.

## ADR-007: Data simulasi sebagai sumber awal

**Status:** Accepted

Fixture lokal menjadi sumber utama agar aplikasi berfungsi tanpa kredensial/API eksternal. Integrasi BMKG/INARISK/NASA bukan bagian MVP dan hanya dapat ditambahkan melalui keputusan arsitektur baru.

## ADR-008: Struktur domain-driven

**Status:** Accepted

Kode dipisahkan berdasarkan fitur/domain. UI generik berada di `components/`, kontrak bersama di `types/`, dan persistence di `lib/db/`. Dokumentasi diperbarui bersama setiap perubahan perilaku.
