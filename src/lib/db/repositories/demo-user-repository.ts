import type { SiagaDatabase } from "@/lib/db/database";
import type { DemoUser } from "@/types/disaster";

export class DemoUserRepository {
  constructor(private readonly database: SiagaDatabase) {}

  async list(): Promise<DemoUser[]> {
    return this.database.demoUsers.toArray();
  }

  async getById(id: string): Promise<DemoUser | undefined> {
    return this.database.demoUsers.get(id);
  }

  async bulkPut(users: DemoUser[]): Promise<void> {
    await this.database.demoUsers.bulkPut(users);
  }
}
