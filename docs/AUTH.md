# Local Demo Session & Roles

> Ini bukan sistem autentikasi nyata. Tidak ada password, JWT, Firebase Auth, verifikasi email, KTP, atau validasi identitas/lokasi.

## Alur

1. Pengunjung dapat melihat landing page, dashboard, peta, dan detail tanpa memilih profil.
2. Untuk simulasi validasi, pengguna memilih salah satu profil demo yang tersedia.
3. Hanya ID profil aktif yang disimpan di `localStorage` dengan key `siaga.demo.activeProfileId`.
4. Repository memeriksa keberadaan profil dan role di IndexedDB sebelum menerima vote.
5. Pengguna dapat keluar dari profil demo; data lokal lain tetap tersimpan.

## Roles

| Role | Akses | Bobot |
|---|---|---:|
| `AWAM` | Melihat data | 0 |
| `WARGA_LOKAL` | Melihat data dan simulasi vote | 1 |
| `NGO_RELAWAN` | Melihat data dan simulasi vote | 2 |
| `OTORITAS` | Melihat data dan simulasi vote | 3 |

## Profil Demo

Empat profil simulasi tersedia di `src/lib/db/fixtures/demo-users.ts` dan diseed bersama fixture bencana. Semua record membawa `is_demo: true`. Nama organisasi sengaja generik agar tidak mengesankan afiliasi instansi nyata.

| ID | Nama tampilan | Role | Bobot |
|---|---|---|---:|
| `demo-user-otoritas` | Unit Otoritas Simulasi | `OTORITAS` | 3 |
| `demo-user-relawan` | Relawan Kemanasan Simulasi | `NGO_RELAWAN` | 2 |
| `demo-user-warga` | Warga Setempat Simulasi | `WARGA_LOKAL` | 1 |
| `demo-user-awam` | Pengunjung Simulasi | `AWAM` | 0 |

Pemilihan profil aktif dan aksi voting akan diimplementasikan pada Fase 4. Kunci `siaga.demo.activeProfileId` sudah tersedia di lapisan storage.

## Batasan Keamanan

- Role dan bobot dapat dimanipulasi melalui developer tools; jangan gunakan sistem ini untuk keputusan nyata.
- Satu vote per profil/bencana adalah aturan aplikasi lokal, bukan pencegahan sybil yang aman.
- Jangan meminta atau menyimpan identitas, kredensial, KTP, maupun data pribadi sensitif.
- UI harus memberi label **Mode Demo** pada pemilihan profil dan aksi voting.
