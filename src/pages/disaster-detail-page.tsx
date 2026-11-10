import { Link, useParams } from "react-router-dom";

export function DisasterDetailPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <section aria-labelledby="detail-title">
      <Link to="/dashboard" className="text-sm font-medium underline underline-offset-4">
        Kembali ke dashboard
      </Link>
      <h1 id="detail-title" className="mt-6 font-serif text-4xl font-bold">
        Detail bencana
      </h1>
      <p className="mt-4 text-slate-600">
        Data untuk ID <code>{id}</code> belum tersedia. Penyimpanan lokal akan
        ditambahkan pada Fase 2.
      </p>
    </section>
  );
}
