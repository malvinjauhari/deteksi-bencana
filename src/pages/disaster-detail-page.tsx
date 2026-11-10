import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { StatusState } from "@/components/ui/status-state";

export function DisasterDetailPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <section aria-labelledby="detail-title" className="mx-auto max-w-4xl px-4 pb-20 pt-32 sm:px-6 sm:pt-40">
      <Button asChild variant="ghost" className="-ml-4"><Link to="/dashboard">← Kembali ke dashboard</Link></Button>
      <h1 id="detail-title" className="mt-6 font-serif text-4xl font-semibold sm:text-5xl">Detail bencana</h1>
      <StatusState
        className="mt-8 text-left"
        status="empty"
        title="Data belum tersedia"
        description={`ID ${id ?? "tidak diketahui"} belum dapat dicari karena penyimpanan lokal baru diimplementasikan pada Fase 2.`}
      />
    </section>
  );
}
