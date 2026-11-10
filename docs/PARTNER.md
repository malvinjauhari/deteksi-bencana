# Demo Validator & Campaign Rules

## Validator Lokal

| Profil | Role | Bobot |
|---|---|---:|
| Otoritas/BPBD demo | `OTORITAS` | 3 |
| NGO/Relawan demo | `NGO_RELAWAN` | 2 |
| Warga lokal demo | `WARGA_LOKAL` | 1 |

Nama organisasi pada fixture bersifat fiktif/simulasi. Tidak ada afiliasi, verifikasi KTP, atau validasi radius lokasi.

## Aturan Vote

- Role `AWAM` tidak dapat melakukan vote.
- Kombinasi `disaster_id + demo_user_id` harus unik.
- Bobot ditentukan oleh service berdasarkan role profil, bukan payload UI.
- Perubahan vote dan campaign dijalankan dalam satu transaksi IndexedDB.
- Vote tidak dapat dibatalkan pada MVP agar perilaku sistem sederhana dan dapat diprediksi.

## Ambang Campaign

- Event berawal dengan status `monitoring`.
- Campaign terbentuk ketika `total_vote_weight >= 5` **dan** `urgency_score >= 70`.
- Setelah menjadi `campaign`, status tidak turun otomatis pada MVP.
- Campaign berisi informasi mitigasi dan tidak memiliki fitur donasi/pembayaran.

Ambang ini adalah konfigurasi simulasi, bukan prosedur resmi penanganan bencana.
