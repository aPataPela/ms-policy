// src/infra/nedb-client.ts
import Datastore from "nedb-promises";
import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";

export type NeDBOptions = {
  filename?: string;
  key?: string;
  inMemoryOnly?: boolean;
  autoload?: boolean;
};

export class NeDBClient<T> {
  protected db: Datastore<Record<string, unknown>>;
  private readonly key: string;

  constructor({ filename = path.join(process.cwd(), "data", "collection.db"), key = "id", inMemoryOnly = false, autoload = true }: NeDBOptions = {}) {
    this.key = key;

    if (!inMemoryOnly) {
      fs.mkdirSync(path.dirname(filename), { recursive: true });
    }

    this.db = Datastore.create({ filename, autoload, inMemoryOnly }) as Datastore<T & { _id: string }>;
    void this.db.ensureIndex({ fieldName: this.key, unique: true });
  }

  private byKey(value: string): Partial<T> {
    return { [this.key]: value } as unknown as Partial<T>;
  }

  async all(query: Partial<T> = {}): Promise<T[]> {
    return this.db.find(query as Record<string, unknown>) as Promise<T[]>;
  }

  async findOne(id: string): Promise<T | null> {
    return this.db.findOne(this.byKey(id)) as Promise<T | null>;
  }

  async insert(doc: T): Promise<T> {
    const copy = { ...(doc as unknown as Record<string, unknown>) };
    const k = this.key;
    const hasKey = typeof copy[k] === "string" && (copy[k] as string).length > 0;
    if (!hasKey) {
      copy[k] = randomUUID();
    }
    const toInsert = copy as unknown as T;
    await this.db.insert(toInsert as Record<string, unknown>);
    return toInsert;
  }

  async updateOne(filter: Partial<T>, patch: Partial<T>): Promise<T> {
    const target = await this.db.findOne(filter as Record<string, unknown>);
    if (!target) {
      throw new Error(`<${this.constructor}> updateOne: Not found for filter: ${JSON.stringify(filter)}`);
    }

    const identifier = (target as unknown as Record<string, unknown>)[this.key];
    if (typeof identifier !== "string" || identifier.length === 0) {
      throw new Error(`<${this.constructor}> updateOne: Unable to determine key "${this.key}" from target`);
    }

    await this.db.update(this.byKey(identifier), { $set: patch }, { multi: false });
    const updated = await this.findOne(identifier);
    if (!updated) throw new Error(`<${this.constructor}> updateOne: Not found: ${identifier}`);
    return updated;
  }

  async remove(id: string): Promise<number> {
    return this.db.remove(this.byKey(id), { multi: false });
  }

  async count(query: Partial<T> = {}): Promise<number> {
    return this.db.count(query as Record<string, unknown>);
  }
}
