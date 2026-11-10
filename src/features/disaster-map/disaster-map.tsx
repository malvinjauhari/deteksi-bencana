import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./disaster-map.css";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { severityLabel } from "@/features/scoring/severity-labels";
import type { DisasterListItem } from "@/features/disasters/disaster-service";

const markerColors = {
  kritis: "#a43c48",
  waspada: "#946414",
  rendah: "#356a60",
  belum_dinilai: "#59645e",
} as const;

/**
 * Leaflet map plus a semantic text alternative.
 *
 * The coordinate list is always present, not just when tiles fail. Markers are
 * keyboard-focusable, while scroll-wheel zoom is disabled so scrolling the page
 * never gets trapped by the map.
 */
export function DisasterMap({ items }: { items: DisasterListItem[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);
  const [tileFailed, setTileFailed] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const map = L.map(containerRef.current, {
      center: [-2.5, 118],
      zoom: 4,
      minZoom: 3,
      maxZoom: 16,
      keyboard: true,
      scrollWheelZoom: false,
      attributionControl: true,
    });
    const markers = L.layerGroup().addTo(map);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a>',
    })
      .on("tileerror", () => setTileFailed(true))
      .addTo(map);

    mapRef.current = map;
    markersRef.current = markers;

    return () => {
      map.remove();
      mapRef.current = null;
      markersRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    const markers = markersRef.current;
    if (!map || !markers) return;

    markers.clearLayers();
    const bounds: L.LatLngBoundsExpression = [];

    for (const { disaster, analysis } of items) {
      const { lat, lng } = disaster.location;
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) continue;

      const severity = analysis?.severity ?? "belum_dinilai";
      const marker = L.marker([lat, lng], {
        icon: L.divIcon({
          className: "disaster-map-icon",
          html: `<span class="disaster-map-marker" style="--marker-color:${markerColors[severity]}"></span>`,
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        }),
        keyboard: true,
        title: disaster.title,
        alt: `Lokasi ${disaster.title}`,
        riseOnHover: true,
      });

      const popup = document.createElement("div");
      popup.className = "disaster-map-popup";
      const heading = document.createElement("strong");
      heading.textContent = disaster.title;
      const description = document.createElement("span");
      description.textContent = `${disaster.location.description} · ${severityLabel[severity]}`;
      popup.append(heading, description);
      marker.bindPopup(popup);
      marker.addTo(markers);
      bounds.push([lat, lng]);
    }

    if (bounds.length === 1) {
      map.setView(bounds[0], 10);
    } else if (bounds.length > 1) {
      map.fitBounds(bounds, { padding: [32, 32], maxZoom: 9 });
    }

    const frame = window.requestAnimationFrame(() => map.invalidateSize());
    return () => window.cancelAnimationFrame(frame);
  }, [items]);

  return (
    <section aria-labelledby="disaster-map-title" className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 id="disaster-map-title" className="text-xl font-semibold">
            Peta kejadian simulasi
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Geser dan zoom dengan kontrol peta atau keyboard. Koordinat juga
            tersedia sebagai teks di bawah.
          </p>
        </div>
        <Badge variant="outline">Bukan lokasi kejadian nyata</Badge>
      </div>

      <div className="overflow-hidden rounded-card border bg-surface-muted">
        <div
          ref={containerRef}
          className="disaster-map"
          role="region"
          aria-label="Peta lokasi kejadian simulasi"
          data-testid="disaster-map"
        />
      </div>

      {tileFailed && (
        <p role="alert" className="rounded-xl border border-warning/30 bg-warning/10 p-4 text-sm">
          Tile peta tidak dapat dimuat. Daftar koordinat dan seluruh analisis
          tetap tersedia tanpa peta.
        </p>
      )}

      <Card className="shadow-none">
        <CardContent className="p-5 sm:p-6">
          <h3 className="font-semibold">Daftar lokasi dan koordinat</h3>
          <ul className="mt-4 divide-y">
            {items.map(({ disaster, analysis }) => (
              <li key={disaster.id} className="flex flex-col gap-2 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <Link
                    to={`/disasters/${disaster.id}`}
                    className="font-medium text-info underline-offset-4 hover:underline"
                  >
                    {disaster.title}
                  </Link>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {disaster.location.description} · {severityLabel[analysis?.severity ?? "belum_dinilai"]}
                  </p>
                </div>
                <p className="shrink-0 text-sm tabular-nums text-muted-foreground">
                  {formatCoordinate(disaster.location.lat)}, {formatCoordinate(disaster.location.lng)}
                </p>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </section>
  );
}

function formatCoordinate(value: number) {
  return value.toFixed(4);
}
