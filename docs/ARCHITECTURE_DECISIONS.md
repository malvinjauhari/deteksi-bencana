# Architecture Decisions (ADR)

1. **AI vs Static Logic:** Menggunakan LLM/AI untuk *Weighted Scoring* alih-alih if-else agar bisa memproses parameter kompleks (kerapatan penduduk, letak fasilitas umum).
2. **Human-in-the-Loop:** AI bertugas sebagai asisten penilai cepat. Keputusan validasi bencana tetap dilakukan oleh Validator Manusia melalui sistem *voting*.
3. **Modular Domain-Driven Structure:** Folder dipisah berdasarkan fitur (`auth`, `disaster`, `partner`, `finance`) agar mudah di-scale.