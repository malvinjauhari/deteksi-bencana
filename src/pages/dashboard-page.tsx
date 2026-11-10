import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatusState } from "@/components/ui/status-state";

export function DashboardPage() {
  return (
    <section aria-labelledby="dashboard-title" className="mx-auto max-w-6xl px-4 pb-20 pt-32 sm:px-6 sm:pt-40">
      <Badge variant="outline">Data simulasi</Badge>
      <h1 id="dashboard-title" className="mt-4 font-serif text-4xl font-semibold sm:text-5xl">Dashboard bencana</h1>
      <p className="mt-4 max-w-2xl leading-7 text-muted-foreground">Ruang kerja untuk memantau urgensi, lokasi, dan validasi mitigasi.</p>
      <StatusState
        className="mt-10"
        status="empty"
        title="Data lokal belum tersedia"
        description="Fondasi tampilan sudah siap. IndexedDB, fixture simulasi, dan mesin skor akan ditambahkan pada Fase 2; belum ada kejadian yang dapat ditampilkan."
        action={<Button asChild variant="secondary"><Link to="/">Kembali ke beranda</Link></Button>}
      />
    </section>
  );
}
