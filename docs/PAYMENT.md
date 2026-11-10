# Payments & Donations — Out of Scope

Payment gateway dan donasi **tidak diimplementasikan** pada SiagaNusantara MVP.

Cakupan yang dihapus dari blueprint lama:
- Duitku dan QRIS checkout.
- Endpoint pembayaran dan webhook/callback.
- Penyimpanan donasi, referensi pembayaran, atau data pembayar.
- Monitoring uang masuk dan administrasi pencairan.

Campaign pada aplikasi hanya menampilkan status validasi lokal serta langkah mitigasi. Jangan menambahkan tombol yang menyiratkan pengguna dapat membayar atau berdonasi. Penambahan fitur ini di masa depan memerlukan perubahan ruang lingkup, ADR, model keamanan, dan dokumentasi baru.
