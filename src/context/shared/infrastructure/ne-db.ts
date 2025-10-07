// src/infra/nedb-client.ts
import Datastore from "nedb-promises";
import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";

type Options = {
  filename?: string;
  key?: string;
  inMemoryOnly?: boolean;
  autoload?: boolean;
};

export class NeDBClient<T> {
  protected db: Datastore<T>;
  private readonly key: string;

  constructor({ filename = path.join(process.cwd(), "data", "collection.db"), key = "id", inMemoryOnly = false, autoload = true }: Options = {}) {
    this.key = key;

    if (!inMemoryOnly) {
      fs.mkdirSync(path.dirname(filename), { recursive: true });
    }

    this.db = Datastore.create<T>({ filename, autoload, inMemoryOnly });
    void this.db.ensureIndex({ fieldName: this.key, unique: true });
  }

  private byKey(value: string): Partial<T> {
    return { [this.key]: value } as unknown as Partial<T>;
  }

  async all(query: Partial<T> = {}): Promise<T[]> {
    return this.db.find(query);
  }

  async findOne(id: string): Promise<T | null> {
    return this.db.findOne(this.byKey(id));
  }

  async insert(doc: T): Promise<T> {
    const copy = { ...(doc as unknown as Record<string, unknown>) };
    const k = this.key;
    const hasKey = typeof copy[k] === "string" && (copy[k] as string).length > 0;
    if (!hasKey) {
      copy[k] = randomUUID();
    }
    const toInsert = copy as unknown as T;
    await this.db.insert(toInsert);
    return toInsert;
  }

  async updateOne(id: string, patch: Partial<T>): Promise<T> {
    await this.db.update(this.byKey(id), { $set: patch }, { multi: false });
    const updated = await this.findOne(id);
    if (!updated) throw new Error(`Not found: ${id}`);
    return updated;
  }

  async remove(id: string): Promise<number> {
    return this.db.remove(this.byKey(id), { multi: false });
  }

  async count(query: Partial<T> = {}): Promise<number> {
    return this.db.count(query);
  }
}
