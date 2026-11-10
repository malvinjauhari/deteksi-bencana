import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function NotFoundPage() {
  return (
    <section className="py-12 text-center">
      <p className="text-sm font-semibold text-slate-600">404</p>
      <h1 className="mt-2 font-serif text-4xl font-bold">Halaman tidak ditemukan</h1>
      <p className="mt-4 text-slate-600">Alamat yang Anda buka tidak tersedia.</p>
      <Button asChild className="mt-6">
        <Link to="/">Kembali ke beranda</Link>
      </Button>
    </section>
  );
}
