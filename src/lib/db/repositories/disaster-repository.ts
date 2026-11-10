import type { SiagaDatabase } from "@/lib/db/database";
import type { Disaster } from "@/types/disaster";

export class DisasterRepository {
  constructor(private readonly database: SiagaDatabase) {}

  async list(): Promise<Disaster[]> {
    return this.database.disasters.toArray();
  }

  async getById(id: string): Promise<Disaster | undefined> {
    return this.database.disasters.get(id);
  }

  async put(disaster: Disaster): Promise<void> {
    await this.database.disasters.put(disaster);
  }

  async bulkPut(disasters: Disaster[]): Promise<void> {
    await this.database.disasters.bulkPut(disasters);
  }

  async count(): Promise<number> {
    return this.database.disasters.count();
  }
}
