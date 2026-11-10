import { useReducedMotion, useScroll, useTransform } from "motion/react";
import {
  ArrowDown,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Database,
  Laptop,
  Map,
  ShieldCheck,
  Users,
} from "lucide-react";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { m } from "@/components/motion/motion";
import { Reveal } from "@/components/motion/reveal";
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

const entrance = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export function HomePage() {
  const heroRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.04, 1.12]);

  return (
    <>
      <section
        ref={heroRef}
        aria-labelledby="hero-title"
        className="relative isolate flex min-h-[44rem] items-center overflow-hidden bg-[#102923] px-4 pb-24 pt-32 text-white sm:min-h-[48rem] sm:px-6 sm:pb-28 sm:pt-36"
      >
        <m.div
          className="absolute -inset-y-[12%] inset-x-0 -z-30"
          style={reduceMotion ? undefined : { y: imageY, scale: imageScale }}
        >
          <m.img
            src="/images/hero-unsplash.webp"
            alt=""
            width="1800"
            height="1197"
            fetchPriority="high"
            className="size-full object-cover object-center"
            initial={reduceMotion ? false : { opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.6, ease: "easeOut" }}
          />
        </m.div>
        <div
          className="absolute inset-0 -z-20 bg-[linear-gradient(180deg,rgba(8,25,22,.55)_0%,rgba(8,25,22,.72)_45%,rgba(8,25,22,.94)_100%)]"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_40%,transparent_0%,rgba(5,21,18,.4)_100%)]"
          aria-hidden="true"
        />

        <svg
          className="pointer-events-none absolute -right-36 top-28 -z-10 size-[32rem] text-white/15 sm:right-[-4rem]"
          viewBox="0 0 400 400"
          fill="none"
          aria-hidden="true"
        >
          <m.g
            style={{ transformOrigin: "200px 200px" }}
            animate={reduceMotion ? undefined : { rotate: 360 }}
            transition={{ duration: 70, repeat: Infinity, ease: "linear" }}
          >
            <circle cx="200" cy="200" r="190" stroke="currentColor" strokeDasharray="2 10" />
            <circle cx="200" cy="200" r="132" stroke="currentColor" />
            <circle cx="200" cy="200" r="72" stroke="currentColor" strokeDasharray="4 8" />
            <path d="M200 10v380M10 200h380" stroke="currentColor" strokeOpacity=".5" />
            <path d="M200 200 332 82A190 190 0 0 1 388 220Z" fill="url(#radar-fade)" />
          </m.g>
          <defs>
            <linearGradient id="radar-fade" x1="200" y1="200" x2="380" y2="120" gradientUnits="userSpaceOnUse">
              <stop stopColor="white" stopOpacity=".12" />
              <stop offset="1" stopColor="white" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>

        <div className="mx-auto w-full max-w-6xl">
          <m.div
            className="mx-auto max-w-4xl text-center"
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: {
                  staggerChildren: reduceMotion ? 0 : 0.12,
                  delayChildren: reduceMotion ? 0 : 0.2,
                },
              },
            }}
          >
            <m.div variants={reduceMotion ? undefined : entrance} transition={{ duration: 0.7 }}>
              <Badge className="border-white/25 bg-white/10 text-white backdrop-blur-md">
                <span className="size-1.5 rounded-full bg-emerald-300" />
                Prototipe mitigasi berbasis komunitas
              </Badge>
            </m.div>
            <m.h1
              id="hero-title"
              variants={reduceMotion ? undefined : entrance}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="mt-7 font-serif text-5xl font-semibold leading-[1.08] tracking-tight text-white sm:text-7xl lg:text-[5.25rem]"
            >
              Dari informasi
              <br className="hidden sm:block" /> menjadi{" "}
              <span className="text-emerald-200">tindakan.</span>
            </m.h1>
            <m.p
              variants={reduceMotion ? undefined : entrance}
              transition={{ duration: 0.7 }}
              className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-white/80 sm:text-xl"
            >
              Pahami urgensi bencana melalui analisis yang transparan, peta interaktif, dan validasi
              manusia—dalam satu ruang kerja yang tenang.
            </m.p>
            <m.div
              variants={reduceMotion ? undefined : entrance}
              transition={{ duration: 0.7 }}
              className="mt-9 flex flex-col justify-center gap-3 sm:flex-row"
            >
              <Button
                asChild
                className="border border-white/10 bg-white px-7 text-[#173d32] shadow-xl shadow-black/10 hover:bg-emerald-50"
              >
                <Link to="/dashboard">
                  Jelajahi dashboard
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button
                asChild
                variant="secondary"
                className="border-white/25 bg-white/10 px-7 text-white backdrop-blur-md hover:bg-white/20"
              >
                <Link to="/#cara-kerja">Pelajari cara kerja</Link>
              </Button>
            </m.div>
            <m.p variants={reduceMotion ? undefined : entrance} className="mt-6 text-sm text-white/65">
              Data simulasi · Tersimpan lokal · Tanpa live AI
            </m.p>
          </m.div>

          <m.div
            initial={reduceMotion ? false : { opacity: 0, y: 50, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: 0.9,
              delay: reduceMotion ? 0 : 0.8,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <Card className="mx-auto mt-14 max-w-5xl overflow-hidden border-white/20 bg-white/10 p-3 text-white shadow-2xl shadow-black/20 backdrop-blur-xl sm:mt-16 sm:p-4">
              <div className="rounded-[1.15rem] border border-white/10 bg-[#102923]/70 p-5 sm:p-7">
                <div className="flex flex-col justify-between gap-3 border-b border-white/15 pb-5 sm:flex-row sm:items-center">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-emerald-200">
                      Pratinjau konsep
                    </p>
                    <p className="mt-1 font-semibold">
                      Satu pandangan untuk pengambilan keputusan
                    </p>
                  </div>
                  <Badge className="border-white/20 bg-white/10 text-white">Bukan data langsung</Badge>
                </div>
                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                  {[
                    { icon: Map, label: "Peta interaktif", text: "Lokasi & konteks kejadian" },
                    { icon: BarChart3, label: "Analisis otomatis", text: "Skor 0–100 & faktor pembentuk" },
                    { icon: CheckCircle2, label: "Validasi manusia", text: "Keputusan berbasis komunitas" },
                  ].map(({ icon: Icon, label, text }) => (
                    <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.06] p-5">
                      <Icon className="size-6 text-emerald-200" aria-hidden="true" />
                      <p className="mt-5 font-semibold">{label}</p>
                      <p className="mt-1 text-sm text-white/65">{text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </m.div>

          <m.a
            href="#features-title"
            aria-label="Gulir ke fitur utama"
            className="mx-auto mt-10 hidden size-11 items-center justify-center rounded-full border border-white/20 text-white/70 hover:bg-white/10 sm:flex"
            animate={reduceMotion ? undefined : { y: [0, 6, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <ArrowDown className="size-4" aria-hidden="true" />
          </m.a>
        </div>
      </section>

      <section aria-labelledby="features-title" className="border-y bg-surface px-4 py-20 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <Reveal className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-info">Fitur utama</p>
            <h2 id="features-title" className="mt-3 scroll-mt-28 font-serif text-4xl font-semibold sm:text-5xl">
              Jelas saat informasi paling dibutuhkan.
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {features.map(({ icon: Icon, title, description }, index) => (
              <Reveal key={title} delay={reduceMotion ? 0 : index * 0.1}>
                <Card className="h-full shadow-none transition-transform duration-500 hover:-translate-y-1 hover:shadow-soft">
                  <CardContent>
                    <div className="flex size-11 items-center justify-center rounded-full bg-accent">
                      <Icon className="size-5 text-info" aria-hidden="true" />
                    </div>
                    <h3 className="mt-6 text-xl font-semibold">{title}</h3>
                    <p className="mt-3 leading-7 text-muted-foreground">{description}</p>
                  </CardContent>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="cara-kerja" aria-labelledby="workflow-title" className="scroll-mt-28 px-4 py-20 sm:px-6 sm:py-24">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <Reveal>
            <p className="text-sm font-semibold uppercase tracking-widest text-info">Cara kerja</p>
            <h2 id="workflow-title" className="mt-3 font-serif text-4xl font-semibold sm:text-5xl">
              Sederhana, lokal, dan dapat diaudit.
            </h2>
            <p className="mt-5 leading-7 text-muted-foreground">
              Setiap hasil dapat ditelusuri kembali ke data dan aturan pembentuknya. Tidak ada
              keputusan otomatis yang disamarkan sebagai kecerdasan buatan.
            </p>
          </Reveal>
          <ol className="space-y-8">
            {steps.map(([number, title, description], index) => (
              <li key={number}>
                <Reveal
                  delay={reduceMotion ? 0 : index * 0.08}
                  className="grid grid-cols-[3rem_1fr] gap-4 border-b pb-8 last:border-0"
                >
                  <span className="font-serif text-2xl text-info">{number}</span>
                  <div>
                    <h3 className="text-lg font-semibold">{title}</h3>
                    <p className="mt-2 leading-7 text-muted-foreground">{description}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="batasan" aria-labelledby="limitations-title" className="scroll-mt-28 px-4 pb-20 sm:px-6 sm:pb-24">
        <Reveal>
          <Card className="mx-auto max-w-6xl overflow-hidden bg-primary text-primary-foreground">
            <CardContent className="grid gap-8 p-7 sm:p-10 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <ShieldCheck className="size-7" aria-hidden="true" />
                <h2 id="limitations-title" className="mt-5 font-serif text-3xl font-semibold sm:text-4xl">
                  Teknologi membantu. Manusia memutuskan.
                </h2>
                <p className="mt-4 max-w-3xl leading-7 opacity-80">
                  Ini adalah simulasi satu perangkat, bukan sumber peringatan resmi. Data tidak
                  tersinkronisasi, profil tidak terverifikasi, dan campaign tidak memproses donasi.
                  Untuk keadaan darurat, ikuti arahan BPBD, BNPB, BMKG, dan otoritas setempat.
                </p>
                <div className="mt-6 flex flex-wrap gap-2 text-xs font-medium">
                  <span className="inline-flex items-center gap-2 rounded-full border border-current/25 px-3 py-1.5">
                    <Database className="size-3.5" />Penyimpanan lokal
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full border border-current/25 px-3 py-1.5">
                    <Laptop className="size-3.5" />Satu perangkat
                  </span>
                </div>
              </div>
              <Button
                asChild
                variant="secondary"
                className="border-transparent bg-surface text-foreground hover:bg-surface-muted lg:self-end"
              >
                <Link to="/dashboard">
                  Lihat prototipe
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </Reveal>
      </section>
    </>
  );
}
