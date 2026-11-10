import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Database,
  Laptop,
  Map,
  ShieldCheck,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Map,
    title: "Peta yang mudah dipahami",
    description: "Lihat lokasi kejadian, tingkat urgensi, dan informasi penting dalam tampilan yang terarah.",
  },
  {
    icon: BarChart3,
    title: "Skor yang transparan",
    description: "Lima faktor pembentuk skor ditampilkan jelas, termasuk saat data belum lengkap.",
  },
  {
    icon: Users,
    title: "Validasi tetap oleh manusia",
    description: "Simulasikan peran otoritas, relawan, dan warga dalam pengambilan keputusan mitigasi.",
  },
];

const steps = [
  ["01", "Data lokal disiapkan", "Fixture simulasi tersimpan di perangkat melalui IndexedDB, tanpa ketergantungan pada layanan AI."],
  ["02", "Urgensi dihitung", "Mesin aturan menimbang skala kejadian, populasi, infrastruktur, cuaca, dan laporan komunitas."],
  ["03", "Manusia memvalidasi", "Profil demo memberikan validasi berbobot untuk membentuk campaign mitigasi lokal."],
];

export function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden px-4 pb-20 pt-36 sm:px-6 sm:pb-28 sm:pt-44">
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[42rem] bg-[radial-gradient(circle_at_50%_20%,var(--accent),transparent_62%)]" aria-hidden="true" />
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-4xl text-center">
            <Badge variant="outline"><span className="size-1.5 rounded-full bg-info" />Prototipe mitigasi berbasis komunitas</Badge>
            <h1 className="mt-7 font-serif text-5xl font-semibold leading-[1.08] tracking-tight sm:text-7xl">
              Dari informasi menjadi <span className="text-info">tindakan.</span>
            </h1>
            <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">
              Pahami urgensi bencana melalui analisis yang transparan, peta interaktif, dan validasi manusia—dalam satu ruang kerja yang tenang.
            </p>
            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <Button asChild className="px-7">
                <Link to="/dashboard">Jelajahi dashboard<ArrowRight className="size-4" aria-hidden="true" /></Link>
              </Button>
              <Button asChild variant="secondary" className="px-7">
                <Link to="/#cara-kerja">Pelajari cara kerja</Link>
              </Button>
            </div>
            <p className="mt-6 text-sm text-muted-foreground">Data simulasi · Tersimpan lokal · Tanpa live AI</p>
          </div>

          <Card className="relative mx-auto mt-16 max-w-5xl overflow-hidden p-3 sm:mt-20 sm:p-4">
            <div className="rounded-[1.15rem] bg-surface-muted p-5 sm:p-8">
              <div className="flex flex-col justify-between gap-3 border-b pb-5 sm:flex-row sm:items-center">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Pratinjau konsep</p>
                  <p className="mt-1 font-semibold">Satu pandangan untuk pengambilan keputusan</p>
                </div>
                <Badge variant="outline">Bukan data langsung</Badge>
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {[
                  { icon: Map, label: "Peta interaktif", text: "Lokasi & konteks kejadian" },
                  { icon: BarChart3, label: "Analisis otomatis", text: "Skor 0–100 & faktor pembentuk" },
                  { icon: CheckCircle2, label: "Validasi manusia", text: "Keputusan berbasis komunitas" },
                ].map(({ icon: Icon, label, text }) => (
                  <div key={label} className="rounded-2xl border bg-surface p-5">
                    <Icon className="size-6 text-info" aria-hidden="true" />
                    <p className="mt-5 font-semibold">{label}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{text}</p>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </section>

      <section aria-labelledby="features-title" className="border-y bg-surface px-4 py-20 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-info">Fitur utama</p>
            <h2 id="features-title" className="mt-3 font-serif text-4xl font-semibold sm:text-5xl">Jelas saat informasi paling dibutuhkan.</h2>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {features.map(({ icon: Icon, title, description }) => (
              <Card key={title} className="shadow-none">
                <CardContent>
                  <div className="flex size-11 items-center justify-center rounded-full bg-accent">
                    <Icon className="size-5 text-info" aria-hidden="true" />
                  </div>
                  <h3 className="mt-6 text-xl font-semibold">{title}</h3>
                  <p className="mt-3 leading-7 text-muted-foreground">{description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="cara-kerja" aria-labelledby="workflow-title" className="scroll-mt-28 px-4 py-20 sm:px-6 sm:py-24">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-info">Cara kerja</p>
            <h2 id="workflow-title" className="mt-3 font-serif text-4xl font-semibold sm:text-5xl">Sederhana, lokal, dan dapat diaudit.</h2>
            <p className="mt-5 leading-7 text-muted-foreground">Setiap hasil dapat ditelusuri kembali ke data dan aturan pembentuknya. Tidak ada keputusan otomatis yang disamarkan sebagai kecerdasan buatan.</p>
          </div>
          <ol className="space-y-8">
            {steps.map(([number, title, description]) => (
              <li key={number} className="grid grid-cols-[3rem_1fr] gap-4 border-b pb-8 last:border-0">
                <span className="font-serif text-2xl text-info">{number}</span>
                <div><h3 className="text-lg font-semibold">{title}</h3><p className="mt-2 leading-7 text-muted-foreground">{description}</p></div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="batasan" aria-labelledby="limitations-title" className="scroll-mt-28 px-4 pb-20 sm:px-6 sm:pb-24">
        <Card className="mx-auto max-w-6xl bg-primary text-primary-foreground">
          <CardContent className="grid gap-8 p-7 sm:p-10 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <ShieldCheck className="size-7" aria-hidden="true" />
              <h2 id="limitations-title" className="mt-5 font-serif text-3xl font-semibold sm:text-4xl">Teknologi membantu. Manusia memutuskan.</h2>
              <p className="mt-4 max-w-3xl leading-7 opacity-80">Ini adalah simulasi satu perangkat, bukan sumber peringatan resmi. Data tidak tersinkronisasi, profil tidak terverifikasi, dan campaign tidak memproses donasi. Untuk keadaan darurat, ikuti arahan BPBD, BNPB, BMKG, dan otoritas setempat.</p>
              <div className="mt-6 flex flex-wrap gap-2 text-xs font-medium">
                <span className="inline-flex items-center gap-2 rounded-full border border-current/25 px-3 py-1.5"><Database className="size-3.5" />Penyimpanan lokal</span>
                <span className="inline-flex items-center gap-2 rounded-full border border-current/25 px-3 py-1.5"><Laptop className="size-3.5" />Satu perangkat</span>
              </div>
            </div>
            <Button asChild variant="secondary" className="border-transparent bg-surface text-foreground hover:bg-surface-muted lg:self-end">
              <Link to="/dashboard">Lihat prototipe<ArrowRight className="size-4" aria-hidden="true" /></Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </>
  );
}
