# Local Database Schema

## Penyimpanan

Database IndexedDB: `siaga-nusantara`, diakses melalui Dexie. Versi awal schema: **1**. Database dibuat otomatis saat halaman dashboard atau detail dibuka.

| Object store | Primary key | Index utama |
|---|---|---|
| `disasters` | `id` | `type`, `status`, `occurred_at`, `[status+type]` |
| `analyses` | `disaster_id` | `urgency_score`, `severity` |
| `demoUsers` | `id` | `role` |
| `votes` | `id` | `disaster_id`, `demo_user_id`, `[disaster_id+demo_user_id]` (unik) |
| `metadata` | `key` | — |

`votes` menyimpan bobot snapshot untuk audit lokal; service tetap menentukan bobot berdasarkan role saat transaksi.

## `disasters`

`id`, `type`, `title`, `location { lat, lng, description }`, `source_name`, `source_reference`, `occurred_at`, `status`, `total_vote_weight`, `voter_count`, `scoring_factors`, `mitigation_steps[]`, `is_simulation`, `created_at`, `updated_at`.

`status`: `monitoring | campaign`. `scoring_factors` memuat lima faktor bernilai 0–100 atau `null`.

## `analyses`

`disaster_id`, `urgency_score` (0–100 atau `null`), `severity`, `factor_breakdown[]`, `human_readable_analysis`, `data_completeness`, `is_provisional`, `calculated_at`, `engine_version`.

## `demoUsers`

`id`, `display_name`, `role`, `weight`, `is_demo`. Role mengikuti `AUTH.md`; semua record harus `is_demo: true`.

## `votes`

`id`, `disaster_id`, `demo_user_id`, `weight`, `created_at`. Pasangan bencana/profil unik.

## `metadata`

Record `{ key: "seed", value: 1, updated_at }` untuk memastikan seed idempoten. `isSeeded()` membandingkan `value` dengan `SCHEMA_VERSION` saat ini.

## localStorage

Namespace `siaga.*` hanya untuk:
- `siaga.theme`: `light | dark | system`.
- `siaga.filters`: filter/sort non-sensitif yang divalidasi saat dibaca.
- `siaga.demo.activeProfileId`: ID profil demo aktif.

Jangan menyimpan salinan penuh database, KTP, kredensial, atau data sensitif di localStorage.

Kunci lokalisasi berada di `src/lib/storage/storage-keys.ts` dan bebas dependency. Preferensi tema berada di `theme-preferences.ts` (tanpa Zod), sedangkan preferensi filter berada di `filter-preferences.ts` (memakai Zod). Pemisahan ini menjaga bundle halaman landing tetap ringan.

## Seed, Migrasi, Ekspor & Reset

- Seed menggunakan ID stabil dan metadata versi sehingga aman dijalankan ulang.
- Perubahan schema memakai Dexie version/upgrade; jangan mengubah versi lama setelah rilis.
- Ekspor JSON memuat versi schema, waktu ekspor, dan seluruh store domain tanpa preferensi sensitif.
- Reset menghapus data lokal aplikasi setelah konfirmasi lalu memasukkan fixture awal kembali.
- Kegagalan quota/private browsing ditampilkan sebagai keadaan penyimpanan tidak tersedia; jangan mengklaim data telah tersimpan.

## Implementasi

| Modul | Tanggung jawab |
|---|---|
| `src/lib/db/database.ts` | Definisi `SiagaDatabase`, nama database, dan `SCHEMA_VERSION`. |
| `src/lib/db/fixtures/disasters.ts` | Enam fixture bencana (`occurred_offset_minutes` relatif terhadap waktu seed). |
| `src/lib/db/fixtures/demo-users.ts` | Empat profil demo dengan bobot 3/2/1/0. |
| `src/lib/db/repositories/` | Repository tipis per store: `DisasterRepository`, `AnalysisRepository`, `DemoUserRepository`. |
| `src/lib/db/seed.ts` | `seedDatabase`, `isSeeded`, dan `resetDemoData`. Semua menerima instance database opsional agar dapat diuji terisolasi. |

Aturan implementasi:

- Seed berjalan dalam satu transaksi `rw` atas `disasters`, `analyses`, `demoUsers`, dan `metadata`.
- `occurred_at` diturunkan dari `referenceDate` dikurangi `occurred_offset_minutes`, sehingga data simulasi selalu tampak baru tanpa mengubah ID.
- Fixture yang dipakai ulang tidak menggandakan record karena kunci utamanya `id` dan `disaster_id`.
- Repository tidak melakukan pemetaan domain; filtering, sorting, dan pembentukan view model dilakukan di `src/features/disasters/disaster-service.ts`.
- Kegagalan membuka IndexedDB diterjemahkan menjadi `StorageUnavailableError` oleh service, lalu menjadi state "penyimpanan lokal tidak tersedia" di UI.
