# Authentication Flow

- **Metode:** Login via Email statis (sementara untuk MVP) -> Disimpan ke `localStorage` (JWT).
- **Roles:**
  1. `AWAM`: Warga biasa, dapat melihat feed, map, dan melakukan donasi.
  2. `VALIDATOR`: Warga terverifikasi, NGO, atau Pemerintah yang berhak menekan tombol *Upvote/Validate*.