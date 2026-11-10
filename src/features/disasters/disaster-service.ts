import { buildAnalysis } from "@/features/scoring/scoring-engine";
import { db, type SiagaDatabase } from "@/lib/db/database";
import { AnalysisRepository } from "@/lib/db/repositories/analysis-repository";
import { DisasterRepository } from "@/lib/db/repositories/disaster-repository";
import { isSeeded, seedDatabase } from "@/lib/db/seed";
import type {
  Analysis,
  Disaster,
  DisasterFilters,
} from "@/types/disaster";

export interface DisasterListItem {
  disaster: Disaster;
  analysis: Analysis | null;
}

export interface DisasterDetail {
  disaster: Disaster;
  analysis: Analysis;
}

/**
 * Raised when the browser refuses to open IndexedDB (private mode, disabled
 * storage, corrupted profile). The UI turns this into an explicit
 * "storage unavailable" state instead of pretending the data is empty.
 */
export class StorageUnavailableError extends Error {
  constructor(cause?: unknown) {
    super("Penyimpanan lokal tidak tersedia pada perangkat ini.");
    this.name = "StorageUnavailableError";
    this.cause = cause;
  }
}

function isStorageFailure(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  return (
    error.name === "SecurityError" ||
    error.name === "InvalidStateError" ||
    error.name === "QuotaExceededError" ||
    error.name === "MissingAPIError" ||
    /indexeddb|quota|storage/i.test(error.message)
  );
}

async function guard<T>(operation: () => Promise<T>): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    if (isStorageFailure(error)) throw new StorageUnavailableError(error);
    throw error;
  }
}

/**
 * Ensures the simulation fixtures exist before the first read.
 * The seed is idempotent, so this is safe to call on every page load.
 */
export async function ensureSeeded(
  database: SiagaDatabase = db,
): Promise<void> {
  await guard(async () => {
    if (!(await isSeeded(database))) {
      await seedDatabase(new Date(), database);
    }
  });
}

export async function listDisasters(
  filters: DisasterFilters,
  database: SiagaDatabase = db,
): Promise<DisasterListItem[]> {
  await ensureSeeded(database);

  return guard(async () => {
    const [disasters, analyses] = await Promise.all([
      new DisasterRepository(database).list(),
      new AnalysisRepository(database).list(),
    ]);

    const analysisById = new Map(analyses.map((a) => [a.disaster_id, a]));
    const items: DisasterListItem[] = disasters.map((disaster) => ({
      disaster,
      analysis: analysisById.get(disaster.id) ?? null,
    }));

    return sortAndFilter(items, filters);
  });
}

export async function getDisasterDetail(
  id: string,
  database: SiagaDatabase = db,
): Promise<DisasterDetail | null> {
  await ensureSeeded(database);

  return guard(async () => {
    const disaster = await new DisasterRepository(database).getById(id);
    if (!disaster) return null;

    const stored = await new AnalysisRepository(database).getByDisasterId(id);
    // Recompute on read so a scoring engine upgrade never shows a stale score.
    const analysis = stored
      ? { ...buildAnalysis(disaster, new Date(stored.calculated_at)) }
      : buildAnalysis(disaster);

    return { disaster, analysis };
  });
}

function sortAndFilter(
  items: DisasterListItem[],
  filters: DisasterFilters,
): DisasterListItem[] {
  const query = filters.query.trim().toLowerCase();

  const filtered = items.filter(({ disaster }) => {
    if (filters.type !== "all" && disaster.type !== filters.type) return false;
    if (filters.status !== "all" && disaster.status !== filters.status) return false;
    if (!query) return true;

    const haystack = [
      disaster.title,
      disaster.location.description,
      disaster.source_name,
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(query);
  });

  // Unscored events always come last for either urgency direction.
  const compareUrgency = (a: DisasterListItem, b: DisasterListItem, direction: 1 | -1) => {
    const aScore = a.analysis?.urgency_score;
    const bScore = b.analysis?.urgency_score;
    if (aScore === null || aScore === undefined) return 1;
    if (bScore === null || bScore === undefined) return -1;
    return (aScore - bScore) * direction;
  };

  return filtered.sort((a, b) => {
    switch (filters.sort) {
      case "urgency_desc":
        return compareUrgency(a, b, -1);
      case "urgency_asc":
        return compareUrgency(a, b, 1);
      case "occurred_desc":
        return b.disaster.occurred_at.localeCompare(a.disaster.occurred_at);
      case "occurred_asc":
        return a.disaster.occurred_at.localeCompare(b.disaster.occurred_at);
      default:
        return 0;
    }
  });
}
