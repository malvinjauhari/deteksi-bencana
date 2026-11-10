# Local Service Interface

Tidak ada HTTP API atau backend internal pada MVP. Integrasi BMKG, INARISK, NASA FIRMS, LLM, dan payment gateway tidak aktif.

## Repository/Service yang Direncanakan

Nama berikut adalah kontrak modul TypeScript, bukan endpoint jaringan.

| Modul | Operasi | Status |
|---|---|---|
| `disasterRepository` | `list(filters)`, `getById(id)`, `seed(fixtures)` | repository selesai; list/filter di service |
| `analysisRepository` | `getByDisasterId(id)`, `save(analysis)` | selesai |
| `scoringEngine` | `calculate(factors)`, `buildNarrative(disaster, result)` | selesai |
| `demoUserRepository` | `list()`, `getById(id)` | selesai |
| `votingService` | `castVote({ disasterId, demoUserId })` | Fase 4 |
| `campaignService` | `evaluate(disasterId)` dalam transaksi voting | Fase 4 |
| `backupService` | `exportJson()`, `resetDemoData()` | reset selesai, ekspor Fase 4 |
| `preferencesStorage` | `get/set` tema, filter, dan profil demo aktif | selesai |

## Service Aktif

`src/features/disasters/disaster-service.ts` adalah satu-satunya pintu masuk data yang dipakai UI.

| Fungsi | Perilaku |
|---|---|
| `ensureSeeded()` | Menjalankan seed bila metadata versi belum cocok. Idempoten. |
| `listDisasters(filters)` | Membaca store, memetakan analysis per disaster, lalu menerapkan pencarian, filter jenis/status, dan sort. |
| `getDisasterDetail(id)` | Mengembalikan disaster beserta analysis, atau `null` bila ID tidak dikenal. |
| `DisasterMapPanel` | Lazy boundary untuk peta; menerima hasil `listDisasters` atau satu hasil detail tanpa akses storage tambahan. |

Kontrak penting:

- Tidak ada payload jaringan. Semua operasi bersifat lokal dan sinkron terhadap IndexedDB.
- Analysis dihitung ulang saat dibaca sehingga kenaikan versi mesin skor tidak menampilkan skor lama.
- Kegagalan storage dipetakan ke `StorageUnavailableError`; kegagalan lain diteruskan apa adanya.
- `listDisasters` menerima `DisasterFilters` yang sudah divalidasi Zod di lapisan storage.
- `readTheme`, `readFilters`, dan `readActiveDemoProfileId` menggunakan `safeStorage` browser secara default; adapter eksplisit tetap tersedia untuk test.
- `DisasterMapPanel` tidak melakukan fetch data domain. Hanya tile OpenStreetMap yang memerlukan jaringan; koordinat dan analisis berasal dari item yang diberikan.

## Aturan Operasi

- Operasi baca mengembalikan kontrak di `CONTRACT.md`.
- `castVote` menolak role `AWAM`, profil tidak dikenal, event tidak ditemukan, dan vote duplikat.
- Service menentukan bobot dari role lokal; UI tidak mengirim `weight`.
- Voting, agregat, dan evaluasi campaign berjalan dalam satu transaksi.
- Error storage diterjemahkan menjadi state UI yang dapat dipahami, bukan ditelan.
- Ekspor/reset dan impor masa depan harus memvalidasi versi serta kontrak data.
- Sorting default dashboard adalah `urgency_desc`; kejadian tanpa skor (`null`) selalu berada di urutan paling akhir pada pengurutan urgensi.
- Pencarian mencocokkan judul, deskripsi lokasi, dan nama sumber secara case-insensitive.

## Referensi Eksternal (Tidak Digunakan MVP)

- BMKG: `https://data.bmkg.go.id/gempabumi/`
- INARISK: `https://inarisk.bnpb.go.id/`
- NASA FIRMS: `https://firms.modaps.eosdis.nasa.gov/api/`

Integrasi langsung memerlukan ADR baru, evaluasi CORS/rate limit/lisensi, dan pemisahan jelas antara data simulasi serta data resmi.
