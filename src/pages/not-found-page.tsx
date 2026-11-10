import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function NotFoundPage() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-40 text-center sm:px-6">
      <p className="text-sm font-semibold text-muted-foreground">404</p>
      <h1 className="mt-3 font-serif text-4xl font-semibold sm:text-5xl">Halaman tidak ditemukan</h1>
      <p className="mt-4 text-muted-foreground">Alamat yang Anda buka tidak tersedia.</p>
      <Button asChild className="mt-7"><Link to="/">Kembali ke beranda</Link></Button>
    </section>
  );
}
