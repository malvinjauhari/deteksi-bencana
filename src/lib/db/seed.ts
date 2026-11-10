import { buildAnalysis } from "@/features/scoring/scoring-engine";
import { db, SCHEMA_VERSION, type SiagaDatabase } from "@/lib/db/database";
import { disasterFixtures } from "@/lib/db/fixtures/disasters";
import { demoUserFixtures } from "@/lib/db/fixtures/demo-users";
import { AnalysisRepository } from "@/lib/db/repositories/analysis-repository";
import { DisasterRepository } from "@/lib/db/repositories/disaster-repository";
import { DemoUserRepository } from "@/lib/db/repositories/demo-user-repository";
import type { Disaster } from "@/types/disaster";

export const SEED_METADATA_KEY = "seed";

export interface SeedResult {
  seeded: boolean;
  disasterCount: number;
  analysisCount: number;
  demoUserCount: number;
  seededAt: string;
}

/**
 * Idempotent seed. Fixture IDs are stable, so re-running the seed updates the
 * same records instead of duplicating them. `occurred_at` is derived from the
 * seed reference time so the simulation always looks recent.
 */
export async function seedDatabase(
  referenceDate: Date = new Date(),
  database: SiagaDatabase = db,
): Promise<SeedResult> {
  const disasters = disasterFixtures.map((fixture) =>
    toDisaster(fixture, referenceDate),
  );
  const analyses = disasters.map((disaster) => buildAnalysis(disaster, referenceDate));
  const seededAt = referenceDate.toISOString();

  await database.transaction(
    "rw",
    [
      database.disasters,
      database.analyses,
      database.demoUsers,
      database.metadata,
    ],
    async () => {
      await new DisasterRepository(database).bulkPut(disasters);
      await new AnalysisRepository(database).bulkSave(analyses);
      await new DemoUserRepository(database).bulkPut(demoUserFixtures);
      await database.metadata.put({
        key: SEED_METADATA_KEY,
        value: SCHEMA_VERSION,
        updated_at: seededAt,
      });
    },
  );

  return {
    seeded: true,
    disasterCount: disasters.length,
    analysisCount: analyses.length,
    demoUserCount: demoUserFixtures.length,
    seededAt,
  };
}

export async function isSeeded(database: SiagaDatabase = db): Promise<boolean> {
  const record = await database.metadata.get(SEED_METADATA_KEY);
  return record?.value === SCHEMA_VERSION;
}

/**
 * Removes all locally stored application data and re-seeds the fixtures.
 * Callers must confirm with the user before invoking this.
 */
export async function resetDemoData(
  referenceDate: Date = new Date(),
  database: SiagaDatabase = db,
): Promise<SeedResult> {
  await database.transaction(
    "rw",
    [
      database.disasters,
      database.analyses,
      database.demoUsers,
      database.votes,
      database.metadata,
    ],
    async () => {
      await Promise.all([
        database.disasters.clear(),
        database.analyses.clear(),
        database.demoUsers.clear(),
        database.votes.clear(),
        database.metadata.clear(),
      ]);
    },
  );

  return seedDatabase(referenceDate, database);
}

function toDisaster(
  fixture: (typeof disasterFixtures)[number],
  referenceDate: Date,
): Disaster {
  const occurredAt = new Date(
    referenceDate.getTime() - fixture.occurred_offset_minutes * 60_000,
  ).toISOString();

  return {
    id: fixture.id,
    type: fixture.type,
    title: fixture.title,
    location: fixture.location,
    source_name: fixture.source_name,
    source_reference: fixture.source_reference,
    occurred_at: occurredAt,
    status: fixture.status,
    total_vote_weight: 0,
    voter_count: 0,
    scoring_factors: fixture.scoring_factors,
    mitigation_steps: fixture.mitigation_steps,
    is_simulation: true,
    created_at: referenceDate.toISOString(),
    updated_at: referenceDate.toISOString(),
  };
}
