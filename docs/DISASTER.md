# Disaster & Local Analysis Processing

## Sumber Data

MVP menggunakan fixture lokal berlabel simulasi. Tidak ada cron atau pengambilan langsung dari BMKG, INARISK, atau NASA FIRMS. `source_name` pada fixture menunjukkan konteks simulasi dan tidak boleh diklaim sebagai data terkini dari lembaga tersebut.

## Normalisasi Input

- Koordinat disimpan sebagai angka `lat` dan `lng`.
- Waktu disimpan sebagai ISO 8601 UTC dan diformat ke zona pengguna di UI.
- Setiap faktor scoring dinormalisasi ke `0..100` atau `null` bila tidak tersedia.
- Jenis bencana MVP: `earthquake`, `flood`, `forest_fire`, dan `landslide`.

## Parameter Urgency Score

| Faktor | Bobot |
|---|---:|
| `scale` — skala bencana | 0.25 |
| `population_density` — kepadatan penduduk | 0.25 |
| `vital_infrastructure` — dampak fasilitas vital | 0.20 |
| `weather_risk` — risiko cuaca susulan | 0.15 |
| `community_reports` — laporan awal | 0.15 |

## Kalkulasi Data Lengkap

```text
score = round(
  scale * 0.25 +
  population_density * 0.25 +
  vital_infrastructure * 0.20 +
  weather_risk * 0.15 +
  community_reports * 0.15
)
```

Hasil dibatasi ke rentang 0–100. Input non-finite atau di luar rentang ditolak, bukan diam-diam dikonversi.

## Data Tidak Lengkap

Faktor `null` tidak direkayasa. Skor sementara menggunakan renormalisasi bobot faktor yang tersedia:

```text
provisional_score = round(sum(available_value * weight) / sum(available_weight))
```

`data_completeness` adalah persentase bobot yang tersedia (0–100), dan `is_provisional` bernilai `true` jika ada faktor yang hilang. UI wajib menampilkan status **Skor Sementara** dan kelengkapannya. Jika semua faktor hilang, `urgency_score` bernilai `null` dan event tidak dapat menjadi campaign otomatis.

## Severity & Narasi

- 0–39: `rendah`
- 40–69: `waspada`
- 70–100: `kritis`
- Tanpa skor: `belum_dinilai`

Narasi dibuat dengan template yang menyebut jenis bencana, severity, faktor tertinggi yang tersedia, dan keterbatasan data. Tidak ada LLM, AI provider, atau klaim prediksi.
