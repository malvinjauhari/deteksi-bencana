import Dexie, { type EntityTable } from "dexie";
import type {
  Analysis,
  DemoUser,
  Disaster,
  MetadataRecord,
  Vote,
} from "@/types/disaster";

export const DATABASE_NAME = "siaga-nusantara";
export const SCHEMA_VERSION = 1;

export class SiagaDatabase extends Dexie {
  disasters!: EntityTable<Disaster, "id">;
  analyses!: EntityTable<Analysis, "disaster_id">;
  demoUsers!: EntityTable<DemoUser, "id">;
  votes!: EntityTable<Vote, "id">;
  metadata!: EntityTable<MetadataRecord, "key">;

  constructor(name: string = DATABASE_NAME) {
    super(name);
    this.version(SCHEMA_VERSION).stores({
      disasters: "id, type, status, occurred_at, [status+type]",
      analyses: "disaster_id, urgency_score, severity",
      demoUsers: "id, role",
      votes: "id, disaster_id, demo_user_id, &[disaster_id+demo_user_id]",
      metadata: "key",
    });
  }
}

export const db = new SiagaDatabase();
