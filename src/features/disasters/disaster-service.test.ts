import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  getDisasterDetail,
  listDisasters,
} from "@/features/disasters/disaster-service";
import { SiagaDatabase } from "@/lib/db/database";
import { seedDatabase } from "@/lib/db/seed";
import { DEFAULT_FILTERS } from "@/lib/storage/filter-preferences";
import type { DisasterFilters } from "@/types/disaster";

let database: SiagaDatabase;

beforeEach(async () => {
  database = new SiagaDatabase(`service-test-${Math.random().toString(36).slice(2)}`);
  await seedDatabase(new Date("2026-01-01T00:00:00.000Z"), database);
});

afterEach(async () => {
  await database.delete();
  database.close();
});

function filters(patch: Partial<DisasterFilters> = {}): DisasterFilters {
  return { ...DEFAULT_FILTERS, ...patch };
}

describe("listDisasters", () => {
  it("returns every seeded disaster by default", async () => {
    const items = await listDisasters(filters(), database);
    expect(items).toHaveLength(6);
    expect(items[0]?.analysis).not.toBeNull();
  });

  it("matches title and location search case-insensitively", async () => {
    const byTitle = await listDisasters(filters({ query: "  LONGSOR " }), database);
    expect(byTitle.map((item) => item.disaster.id)).toEqual(["sim-landslide-004"]);

    const byLocation = await listDisasters(
      filters({ query: "kalimantan selatan" }),
      database,
    );
    expect(byLocation.map((item) => item.disaster.id)).toEqual(["sim-flood-005"]);
  });

  it("filters by type and campaign status", async () => {
    const floods = await listDisasters(filters({ type: "flood" }), database);
    expect(floods.map((item) => item.disaster.id).sort()).toEqual([
      "sim-flood-002",
      "sim-flood-005",
    ]);

    const campaigns = await listDisasters(filters({ status: "campaign" }), database);
    expect(campaigns).toEqual([]);
  });

  it("keeps unscored events last for both urgency sort directions", async () => {
    const descending = await listDisasters(
      filters({ sort: "urgency_desc" }),
      database,
    );
    expect(descending[0]?.analysis?.urgency_score).toBe(77);
    expect(descending.at(-1)?.analysis?.urgency_score).toBeNull();

    const ascending = await listDisasters(filters({ sort: "urgency_asc" }), database);
    expect(ascending[0]?.analysis?.urgency_score).toBe(28);
    expect(ascending.at(-1)?.analysis?.urgency_score).toBeNull();
  });

  it("sorts by occurrence time", async () => {
    const newest = await listDisasters(filters({ sort: "occurred_desc" }), database);
    expect(newest[0]?.disaster.id).toBe("sim-earthquake-006");

    const oldest = await listDisasters(filters({ sort: "occurred_asc" }), database);
    expect(oldest[0]?.disaster.id).toBe("sim-forest-fire-003");
  });
});

describe("getDisasterDetail", () => {
  it("returns the disaster and its five-factor analysis", async () => {
    const detail = await getDisasterDetail("sim-earthquake-001", database);
    expect(detail?.disaster.id).toBe("sim-earthquake-001");
    expect(detail?.analysis.urgency_score).toBe(77);
    expect(detail?.analysis.factor_breakdown).toHaveLength(5);
  });

  it("returns null for an unknown id", async () => {
    expect(await getDisasterDetail("unknown", database)).toBeNull();
  });
});
