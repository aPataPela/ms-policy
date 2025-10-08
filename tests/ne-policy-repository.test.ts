import { beforeEach, describe, expect, it } from "vitest";
import { randomUUID, type UUID } from "node:crypto";
import { NePolicyRepository } from "../src/context/policy/infrastructure/ne-policy-repository";
import { Policy } from "../src/context/policy/domain/class/Policy";
import { PolicySearchCriteria } from "../src/context/policy/domain/criteria/policy-search-criteria";

describe("NePolicyRepository", () => {
  let repository: NePolicyRepository;

  beforeEach(() => {
    repository = new NePolicyRepository({ inMemoryOnly: true, autoload: true });
  });

  it("persists and retrieves a policy by id", async () => {
    const policyId: UUID = randomUUID();
    const policy = Policy.create(
      policyId,
      "1234567890",
      new Date("2024-01-01T00:00:00.000Z"),
      "plan premium",
      199.99,
      "activa",
    );

    await repository.create(policy);

    const criteria = PolicySearchCriteria.from({ id: policyId });
    const found = await repository.search(criteria);

    expect(found).not.toBeNull();
    expect(found).toHaveLength(1);
    expect(found?.[0]).toBeInstanceOf(Policy);
    expect((found?.[0] as any).id).toBe(policyId);
  });

  it("updates the estado of an existing policy", async () => {
    const policyId: UUID = randomUUID();
    const policy = Policy.create(
      policyId,
      "1234567890",
      new Date("2024-01-01T00:00:00.000Z"),
      "plan premium",
      199.99,
      "activa",
    );

    await repository.create(policy);

    const criteria = PolicySearchCriteria.from({ id: policyId });
    await repository.update({ estado: "anulada" } as Partial<Policy>, criteria);

    const updated = await repository.search(criteria);
    expect(updated).not.toBeNull();
    expect(updated?.[0]).toBeInstanceOf(Policy);
    expect((updated?.[0] as any).estado).toBe("anulada");
  });
});
