# Local Database Schema

## Penyimpanan

Database IndexedDB: `siaga-nusantara`, diakses melalui Dexie. Versi awal schema: **1**. Belum ada database yang dibuat sampai aplikasi dijalankan.

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

Record seperti `{ key: "seed", version: 1, seeded_at }` untuk memastikan seed idempoten.

## localStorage

Namespace `siaga.*` hanya untuk:
- `siaga.theme`: `light | dark | system`.
- `siaga.filters`: filter/sort non-sensitif yang divalidasi saat dibaca.
- `siaga.demo.activeProfileId`: ID profil demo aktif.

Jangan menyimpan salinan penuh database, KTP, kredensial, atau data sensitif di localStorage.

## Seed, Migrasi, Ekspor & Reset

- Seed menggunakan ID stabil dan metadata versi sehingga aman dijalankan ulang.
- Perubahan schema memakai Dexie version/upgrade; jangan mengubah versi lama setelah dirilis.
- Ekspor JSON memuat versi schema, waktu ekspor, dan seluruh store domain tanpa preferensi sensitif.
- Reset menghapus data lokal aplikasi setelah konfirmasi lalu memasukkan fixture awal kembali.
- Kegagalan quota/private browsing ditampilkan sebagai keadaan penyimpanan tidak tersedia; jangan mengklaim data telah tersimpan.
