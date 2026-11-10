import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { StatusState } from "@/components/ui/status-state";
import { DisasterCard } from "@/features/disasters/disaster-card";
import {
  listDisasters,
  StorageUnavailableError,
  type DisasterListItem,
} from "@/features/disasters/disaster-service";
import {
  DEFAULT_FILTERS,
  readFilters,
  writeFilters,
} from "@/lib/storage/preferences";
import type { DisasterFilters } from "@/types/disaster";

type LoadStatus = "ready" | "error" | "storage-unavailable";

interface LoadResult {
  key: string;
  status: LoadStatus;
  items: DisasterListItem[];
  message?: string;
}

export function DashboardPage() {
  const [filters, setFilters] = useState<DisasterFilters>(() => readFilters());
  const [retryToken, setRetryToken] = useState(0);
  const [result, setResult] = useState<LoadResult | null>(null);

  const filterKey = useMemo(() => JSON.stringify(filters), [filters]);
  const requestKey = `${filterKey}#${retryToken}`;

  useEffect(() => {
    let active = true;

    void (async () => {
      try {
        const items = await listDisasters(filters);
        if (!active) return;
        setResult({ key: requestKey, status: "ready", items });
      } catch (error) {
        if (!active) return;
        if (error instanceof StorageUnavailableError) {
          setResult({
            key: requestKey,
            status: "storage-unavailable",
            items: [],
            message: error.message,
          });
          return;
        }
        setResult({
          key: requestKey,
          status: "error",
          items: [],
          message:
            error instanceof Error
              ? error.message
              : "Data lokal tidak dapat dimuat karena kesalahan tak dikenal.",
        });
      }
    })();

    return () => {
      active = false;
    };
  }, [filters, requestKey]);

  const updateFilters = useCallback((patch: Partial<DisasterFilters>) => {
    setFilters((current) => {
      const next = { ...current, ...patch };
      writeFilters(next);
      return next;
    });
  }, []);

  const retry = useCallback(() => {
    setRetryToken((token) => token + 1);
  }, []);

  const isInitialLoad = result === null;
  const isStale = result !== null && result.key !== requestKey;

  const items = useMemo(() => {
    if (isInitialLoad || isStale) return [];
    return result?.items ?? [];
  }, [result, isInitialLoad, isStale]);

  const summary = useMemo(() => {
    if (isInitialLoad || isStale) return null;
    return {
      total: items.length,
      kritis: items.filter((item) => item.analysis?.severity === "kritis").length,
      waspada: items.filter((item) => item.analysis?.severity === "waspada").length,
      provisional: items.filter((item) => item.analysis?.is_provisional).length,
    };
  }, [items, isInitialLoad, isStale]);

  return (
    <section
      aria-labelledby="dashboard-title"
      className="mx-auto max-w-6xl px-4 pb-20 pt-32 sm:px-6 sm:pt-40"
    >
      <Badge variant="outline">Data simulasi</Badge>
      <h1
        id="dashboard-title"
        className="mt-4 font-serif text-4xl font-semibold sm:text-5xl"
      >
        Dashboard bencana
      </h1>
      <p className="mt-4 max-w-2xl leading-7 text-muted-foreground">
        Ruang kerja untuk memantau urgensi, lokasi, dan validasi mitigasi. Seluruh
        angka berasal dari fixture simulasi yang tersimpan di perangkat ini.
      </p>

      {summary && (
        <dl className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Total kejadian", value: summary.total },
            { label: "Kritis", value: summary.kritis },
            { label: "Waspada", value: summary.waspada },
            { label: "Skor sementara", value: summary.provisional },
          ].map((item) => (
            <Card key={item.label} className="shadow-none">
              <CardContent className="p-5">
                <dt className="text-sm text-muted-foreground">{item.label}</dt>
                <dd className="mt-2 font-serif text-3xl font-semibold tabular-nums">
                  {item.value}
                </dd>
              </CardContent>
            </Card>
          ))}
        </dl>
      )}

      <form
        className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        onSubmit={(event) => event.preventDefault()}
        role="search"
        aria-label="Filter kejadian simulasi"
      >
        <div className="lg:col-span-2">
          <label htmlFor="disaster-search" className="text-sm font-medium">
            Pencarian
          </label>
          <Input
            id="disaster-search"
            className="mt-2"
            type="search"
            placeholder="Judul atau lokasi kejadian"
            value={filters.query}
            onChange={(event) => updateFilters({ query: event.target.value })}
          />
        </div>
        <div>
          <label htmlFor="filter-type" className="text-sm font-medium">
            Jenis bencana
          </label>
          <Select
            id="filter-type"
            className="mt-2"
            value={filters.type}
            onChange={(event) =>
              updateFilters({ type: event.target.value as DisasterFilters["type"] })
            }
          >
            <option value="all">Semua jenis</option>
            <option value="earthquake">Gempa bumi</option>
            <option value="flood">Banjir</option>
            <option value="forest_fire">Kebakaran hutan</option>
            <option value="landslide">Longsor</option>
          </Select>
        </div>
        <div>
          <label htmlFor="filter-sort" className="text-sm font-medium">
            Urutan
          </label>
          <Select
            id="filter-sort"
            className="mt-2"
            value={filters.sort}
            onChange={(event) =>
              updateFilters({ sort: event.target.value as DisasterFilters["sort"] })
            }
          >
            <option value="urgency_desc">Urgensi tertinggi</option>
            <option value="urgency_asc">Urgensi terendah</option>
            <option value="occurred_desc">Waktu terbaru</option>
            <option value="occurred_asc">Waktu terlama</option>
          </Select>
        </div>
      </form>

      <div className="mt-10">
        {isInitialLoad && (
          <StatusState
            status="loading"
            title="Memuat data lokal"
            description="Menyiapkan fixture simulasi dan menghitung skor urgensi di perangkat ini."
          />
        )}

        {isStale && (
          <p role="status" className="text-sm text-muted-foreground">
            Memuat ulang data dengan filter terbaru...
          </p>
        )}

        {!isInitialLoad && !isStale && result?.status === "storage-unavailable" && (
          <StatusState
            status="error"
            title="Penyimpanan lokal tidak tersedia"
            description={`${result.message} Buka aplikasi di browser biasa atau nonaktifkan mode privasi, lalu muat ulang halaman.`}
            action={
              <Button variant="secondary" onClick={retry}>
                Coba lagi
              </Button>
            }
          />
        )}

        {!isInitialLoad && !isStale && result?.status === "error" && (
          <StatusState
            status="error"
            title="Data tidak dapat dimuat"
            description={
              result.message ??
              "Data lokal tidak dapat dimuat karena kesalahan tak dikenal."
            }
            action={
              <Button variant="secondary" onClick={retry}>
                Coba lagi
              </Button>
            }
          />
        )}

        {!isInitialLoad && !isStale && result?.status === "ready" && items.length === 0 && (
          <StatusState
            status="empty"
            title="Tidak ada kejadian yang cocok"
            description="Ubah kata kunci atau filter jenis untuk melihat fixture simulasi lainnya."
            action={
              <Button variant="secondary" onClick={() => updateFilters(DEFAULT_FILTERS)}>
                Reset filter
              </Button>
            }
          />
        )}

        {!isInitialLoad && !isStale && result?.status === "ready" && items.length > 0 && (
          <ul className="grid gap-5 md:grid-cols-2">
            {items.map((item) => (
              <li key={item.disaster.id}>
                <DisasterCard item={item} />
              </li>
            ))}
          </ul>
        )}
      </div>

      <p className="mt-10 text-sm text-muted-foreground">
        Data simulasi lokal. Untuk keadaan darurat, ikuti arahan FEMA, BNPB, BMKG,
        dan otoritas setempat.{" "}
        <Link to="/" className="font-medium text-info underline underline-offset-4">
          Kembali ke beranda
        </Link>
        .
      </p>
    </section>
  );
}
