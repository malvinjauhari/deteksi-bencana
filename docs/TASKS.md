# Task Plan & Roadmap

**Legend:** `[ ]` belum dikerjakan · `[x]` selesai dan tervalidasi.

## Fase 0 — Documentation & Setup

- [x] Samakan blueprint dengan keputusan client-only, local storage, no live AI, dan no payment.
- [x] Tetapkan arsitektur React/Vite/TypeScript, Dexie, serta kontrak domain.
- [x] Dokumentasikan scoring, role demo, voting, campaign, fallback, dan batasan privasi.
- [ ] Inisialisasi Vite React TypeScript dan `package.json` dengan pinned lockfile.
- [ ] Tambahkan Tailwind, shadcn/ui/Radix, React Router, Dexie, dan Leaflet.
- [ ] Tambahkan ESLint, Vitest, React Testing Library, script `lint`, `typecheck`, `test`, dan `build`.
- [ ] Tambahkan `.gitignore`, `.env.example` bila diperlukan, README setup, dan CI GitHub Actions.
- [ ] Buat struktur folder modular sesuai `PROJECT_BLUEPRINT.md`.

## Fase 1 — Design System & Application Shell

- [ ] Definisikan color/typography/spacing tokens untuk light/dark mode.
- [ ] Buat komponen Button, Card, Badge, Dialog, Input/Select, Empty/Error State.
- [ ] Buat floating navigation, footer, mobile menu, dan theme toggle.
- [ ] Tambahkan router: `/`, `/dashboard`, `/disasters/:id`, dan not-found.
- [ ] Bangun landing page: hero, key features, alur, dan batasan simulasi.
- [ ] Pastikan landmark, heading, focus state, keyboard, dan reduced motion.

## Fase 2 — Local Data & Scoring

- [ ] Buat tipe kontrak dan validator input sesuai `CONTRACT.md`.
- [ ] Implementasikan Dexie schema v1, index unik vote, dan repository.
- [ ] Buat fixture bencana serta profil demo berlabel simulasi.
- [ ] Implementasikan seed idempoten dan metadata schema/seed.
- [ ] Implementasikan weighted scoring, missing-factor handling, severity, dan template narasi.
- [ ] Unit test: skor minimum/maksimum, bobot, pembulatan, input invalid, data null, dan narasi.
- [ ] Tambahkan adapter `localStorage` aman untuk preferensi dan sesi demo.

## Fase 3 — Dashboard, Feed & Map

- [ ] Buat dashboard summary berdasarkan data lokal aktual.
- [ ] Buat feed dengan search, filter, sort, loading, empty, dan error states.
- [ ] Buat detail bencana dengan rincian faktor, kelengkapan data, dan mitigasi.
- [ ] Integrasikan Leaflet marker dan popover yang aksesibel.
- [ ] Sediakan fallback daftar teks/koordinat saat peta atau tile gagal.
- [ ] Persist serta validasi filter/sort pilihan pengguna.

## Fase 4 — Demo Voting, Campaign & Data Controls

- [ ] Buat pemilih profil demo dan label Mode Demo.
- [ ] Implementasikan satu vote per profil/bencana dan role `AWAM` tanpa hak vote.
- [ ] Terapkan bobot 3/2/1 dari service, bukan payload UI.
- [ ] Jalankan vote, agregat, dan campaign evaluation dalam transaksi.
- [ ] Terapkan threshold campaign: bobot ≥5 dan skor ≥70.
- [ ] Tampilkan status vote/campaign dan informasi mitigasi tanpa donasi.
- [ ] Implementasikan ekspor JSON serta reset data dengan konfirmasi.
- [ ] Integration test duplikat, role invalid, transaksi gagal, threshold, dan persistence.

## Fase 5 — Quality & Deployment

- [ ] Uji reload persistence, reset, seed ulang, dan storage unavailable.
- [ ] Audit mobile/tablet/desktop, keyboard, screen reader semantics, contrast, dan reduced motion.
- [ ] Pastikan tidak ada klaim live data/AI, afiliasi validator, atau fungsi pembayaran.
- [ ] Jalankan seluruh lint, type-check, tests, dan production build.
- [ ] Tambahkan deployment configuration dan smoke test static hosting.
- [ ] Sinkronkan seluruh dokumen status dan deployment.

## Aturan Penyelesaian

Checklist hanya ditandai selesai setelah implementasi dan pengujian terkait lulus. Setiap unit logis disertai pembaruan dokumen terkait, `CURRENT_STATE.md`, `NOW.md`, dan commit Conventional Commits.
