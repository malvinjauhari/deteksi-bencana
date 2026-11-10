# Local Service Interface

Tidak ada HTTP API atau backend internal pada MVP. Integrasi BMKG, INARISK, NASA FIRMS, LLM, dan payment gateway tidak aktif.

## Repository/Service yang Direncanakan

Nama berikut adalah kontrak modul TypeScript, bukan endpoint jaringan.

| Modul | Operasi |
|---|---|
| `disasterRepository` | `list(filters)`, `getById(id)`, `seed(fixtures)` |
| `analysisRepository` | `getByDisasterId(id)`, `save(analysis)` |
| `scoringEngine` | `calculate(factors)`, `buildNarrative(disaster, result)` |
| `demoUserRepository` | `list()`, `getById(id)` |
| `votingService` | `castVote({ disasterId, demoUserId })` |
| `campaignService` | `evaluate(disasterId)` dalam transaksi voting |
| `backupService` | `exportJson()`, `resetDemoData()` |
| `preferencesStorage` | `get/set` tema, filter, dan profil demo aktif |

## Aturan Operasi

- Operasi baca mengembalikan kontrak di `CONTRACT.md`.
- `castVote` menolak role `AWAM`, profil tidak dikenal, event tidak ditemukan, dan vote duplikat.
- Service menentukan bobot dari role lokal; UI tidak mengirim `weight`.
- Voting, agregat, dan evaluasi campaign berjalan dalam satu transaksi.
- Error storage diterjemahkan menjadi state UI yang dapat dipahami, bukan ditelan.
- Ekspor/reset dan impor masa depan harus memvalidasi versi serta kontrak data.

## Referensi Eksternal (Tidak Digunakan MVP)

- BMKG: `https://data.bmkg.go.id/gempabumi/`
- INARISK: `https://inarisk.bnpb.go.id/`
- NASA FIRMS: `https://firms.modaps.eosdis.nasa.gov/api/`

Integrasi langsung memerlukan ADR baru, evaluasi CORS/rate limit/lisensi, dan pemisahan jelas antara data simulasi serta data resmi.
