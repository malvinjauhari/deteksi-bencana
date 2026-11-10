# Payment & Donation Integration

- **Provider:** Duitku (Fokus pada metode QRIS).
- **Flow:** 
  1. Campaign Terbentuk -> User Klik Donasi -> Form Checkout.
  2. Hit API `/api/payments/create` -> *Response* URL/QR Code Duitku.
  3. Webhook/Callback Duitku ke backend -> Update tabel `donations` ke status `SUCCESS`.
- **Pencairan (Finance):** Admin dapat memantau uang masuk dan proses distribusi penyaluran.