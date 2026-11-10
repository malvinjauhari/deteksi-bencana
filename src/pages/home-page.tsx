import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function HomePage() {
  return (
    <section className="mx-auto max-w-3xl py-12 text-center sm:py-20">
      <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-slate-600">
        Fondasi aplikasi · Data simulasi lokal
      </p>
      <h1 className="font-serif text-4xl font-bold tracking-tight sm:text-6xl">
        Memahami urgensi, merencanakan mitigasi.
      </h1>
      <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">
        SiagaNusantara adalah prototipe untuk mensimulasikan analisis bencana,
        validasi komunitas, dan campaign mitigasi dalam satu perangkat.
      </p>
      <Button asChild className="mt-8">
        <Link to="/dashboard">Buka dashboard</Link>
      </Button>
      <p className="mt-8 text-sm text-slate-500">
        Tanpa live AI, backend, payment gateway, atau sinkronisasi daring.
      </p>
    </section>
  );
}
