import { describe, expect, it } from "vitest";
import { randomUUID, type UUID } from "node:crypto";
import { Policy } from "../src/context/policy/domain/class/Policy";

describe("Policy domain", () => {
  it("creates a policy instance with provided attributes", () => {
    const id: UUID = randomUUID();
    const fechaEmision = new Date("2024-01-01T00:00:00.000Z");
    const policy = Policy.create(
      id,
      "1234567890",
      fechaEmision,
      "plan premium",
      199.99,
      "emitida",
    );

    expect(policy).toBeInstanceOf(Policy);
    const plain = policy as unknown as Record<string, unknown>;

    expect(plain.id).toBe(id);
    expect(plain.rutTitular).toBe("1234567890");
    expect(plain.fechaEmision).toEqual(fechaEmision);
    expect(plain.planSalud).toBe("plan premium");
    expect(plain.prima).toBe(199.99);
    expect(plain.estado).toBe("emitida");
  });

  it("keeps each created policy independent", () => {
    const first = Policy.create(
      randomUUID(),
      "1234567890",
      new Date("2024-01-01T00:00:00.000Z"),
      "plan A",
      100,
      "activa",
    );

    const second = Policy.create(
      randomUUID(),
      "0987654321",
      new Date("2024-02-01T00:00:00.000Z"),
      "plan B",
      200,
      "anulada",
    );

    expect(first).not.toBe(second);
    expect((first as any).planSalud).toBe("plan A");
    expect((second as any).planSalud).toBe("plan B");
  });
});
