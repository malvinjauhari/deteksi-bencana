import "fake-indexeddb/auto";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { SiagaDatabase } from "@/lib/db/database";
import { disasterFixtures } from "@/lib/db/fixtures/disasters";
import { demoUserFixtures } from "@/lib/db/fixtures/demo-users";
import { isSeeded, resetDemoData, seedDatabase } from "@/lib/db/seed";
import { AnalysisRepository } from "@/lib/db/repositories/analysis-repository";
import { DisasterRepository } from "@/lib/db/repositories/disaster-repository";
import { DemoUserRepository } from "@/lib/db/repositories/demo-user-repository";

const referenceDate = new Date("2026-01-01T00:00:00.000Z");

let database: SiagaDatabase;

beforeEach(() => {
  database = new SiagaDatabase(`test-db-${Math.random().toString(36).slice(2)}`);
});

afterEach(async () => {
  await database.delete();
  database.close();
});

describe("seedDatabase", () => {
  it("stores every fixture exactly once", async () => {
    const result = await seedDatabase(referenceDate, database);

    expect(result.seeded).toBe(true);
    expect(result.disasterCount).toBe(disasterFixtures.length);
    expect(result.analysisCount).toBe(disasterFixtures.length);
    expect(result.demoUserCount).toBe(demoUserFixtures.length);

    const disasters = await new DisasterRepository(database).list();
    expect(disasters).toHaveLength(disasterFixtures.length);
    expect(new Set(disasters.map((disaster) => disaster.id)).size).toBe(
      disasters.length,
    );
    expect(disasters.every((disaster) => disaster.is_simulation)).toBe(true);
  });

  it("stores one analysis per disaster with matching ids", async () => {
    await seedDatabase(referenceDate, database);

    const analyses = await new AnalysisRepository(database).list();
    expect(analyses).toHaveLength(disasterFixtures.length);

    const disasterIds = new Set(
      (await new DisasterRepository(database).list()).map((disaster) => disaster.id),
    );
    for (const analysis of analyses) {
      expect(disasterIds.has(analysis.disaster_id)).toBe(true);
      expect(analysis.factor_breakdown).toHaveLength(5);
    }
  });

  it("is idempotent when run repeatedly", async () => {
    await seedDatabase(referenceDate, database);
    await seedDatabase(referenceDate, database);
    await seedDatabase(referenceDate, database);

    expect(await new DisasterRepository(database).count()).toBe(
      disasterFixtures.length,
    );
    expect(await new AnalysisRepository(database).count()).toBe(
      disasterFixtures.length,
    );
    expect(await new DemoUserRepository(database).list()).toHaveLength(
      demoUserFixtures.length,
    );
  });

  it("records the schema version in metadata", async () => {
    expect(await isSeeded(database)).toBe(false);
    await seedDatabase(referenceDate, database);
    expect(await isSeeded(database)).toBe(true);
  });

  it("derives occurred_at from the reference time", async () => {
    await seedDatabase(referenceDate, database);

    const earthquake = await new DisasterRepository(database).getById(
      "sim-earthquake-001",
    );
    expect(earthquake).toBeDefined();
    expect(earthquake?.occurred_at).toBe(
      new Date(referenceDate.getTime() - 45 * 60_000).toISOString(),
    );
  });

  it("keeps fixtures with missing factors without inventing values", async () => {
    await seedDatabase(referenceDate, database);

    const partial = await new DisasterRepository(database).getById("sim-flood-005");
    expect(partial?.scoring_factors.population_density).toBeNull();
    expect(partial?.scoring_factors.weather_risk).toBeNull();

    const analysis = await new AnalysisRepository(database).getByDisasterId(
      "sim-flood-005",
    );
    expect(analysis?.is_provisional).toBe(true);
    expect(analysis?.urgency_score).not.toBeNull();
  });

  it("marks a fully unscored fixture as not assessed", async () => {
    await seedDatabase(referenceDate, database);

    const analysis = await new AnalysisRepository(database).getByDisasterId(
      "sim-earthquake-006",
    );
    expect(analysis?.urgency_score).toBeNull();
    expect(analysis?.severity).toBe("belum_dinilai");
    expect(analysis?.data_completeness).toBe(0);
  });
});

describe("resetDemoData", () => {
  it("clears local data and restores the fixtures", async () => {
    await seedDatabase(referenceDate, database);

    await database.votes.put({
      id: "vote-1",
      disaster_id: "sim-flood-002",
      demo_user_id: "demo-user-warga",
      weight: 1,
      created_at: referenceDate.toISOString(),
    });

    const result = await resetDemoData(referenceDate, database);

    expect(result.disasterCount).toBe(disasterFixtures.length);
    expect(await database.votes.count()).toBe(0);
    expect(await new DisasterRepository(database).count()).toBe(
      disasterFixtures.length,
    );
    expect(await isSeeded(database)).toBe(true);
  });
});
