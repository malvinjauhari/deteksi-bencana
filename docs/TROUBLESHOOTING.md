# Troubleshooting & Fallbacks

1. **API Eksternal Down (BMKG/NASA):** Pastikan ada *try-catch*, sistem berjalan dengan data caching terakhir, tampilkan banner "Data terhambat" di UI.
2. **AI Provider Limit/Error:** *Fallback* ke kalkulasi statis darurat jika LLM gagal merespon.
3. **CORS Error:** Pastikan origin *frontend* sudah di-*whitelist* di Express `app.use(cors({...}))`.