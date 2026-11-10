export function DashboardPage() {
  return (
    <section aria-labelledby="dashboard-title">
      <p className="text-sm font-semibold text-slate-600">Data simulasi</p>
      <h1 id="dashboard-title" className="mt-2 font-serif text-4xl font-bold">
        Dashboard bencana
      </h1>
      <div className="mt-8 rounded-3xl border border-dashed border-slate-300 bg-white p-8">
        <h2 className="text-lg font-semibold">Dashboard sedang disiapkan</h2>
        <p className="mt-2 max-w-2xl leading-7 text-slate-600">
          Routing dan fondasi aplikasi sudah tersedia. Data lokal, skor urgensi,
          peta, dan validasi akan diimplementasikan pada fase berikutnya.
        </p>
      </div>
    </section>
  );
}
