import type { SiagaDatabase } from "@/lib/db/database";
import type { Analysis } from "@/types/disaster";

export class AnalysisRepository {
  constructor(private readonly database: SiagaDatabase) {}

  async list(): Promise<Analysis[]> {
    return this.database.analyses.toArray();
  }

  async getByDisasterId(disasterId: string): Promise<Analysis | undefined> {
    return this.database.analyses.get(disasterId);
  }

  async save(analysis: Analysis): Promise<void> {
    await this.database.analyses.put(analysis);
  }

  async bulkSave(analyses: Analysis[]): Promise<void> {
    await this.database.analyses.bulkPut(analyses);
  }

  async count(): Promise<number> {
    return this.database.analyses.count();
  }
}
