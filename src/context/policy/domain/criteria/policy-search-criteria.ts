type CriteriaPrimitive = string | number | boolean;
type CriteriaValue = CriteriaPrimitive | CriteriaPrimitive[] | Record<string, unknown>;
export type RawFilters = Record<string, unknown> | null | undefined;

export type PolicyFilters = Record<string, CriteriaValue>;

export class PolicySearchCriteria {
  private constructor(private readonly filters: PolicyFilters) { }

  static from(rawFilters: RawFilters): PolicySearchCriteria {
    const filters: PolicyFilters = {};

    if (!rawFilters) return new PolicySearchCriteria(filters);
    for (const [key, value] of Object.entries(rawFilters)) {
      if (!value) continue;
      if (typeof value === "object") {
        filters[key] = value as Record<string, unknown>;
        continue;
      }
      filters[key] = value as CriteriaPrimitive;
    }
    return new PolicySearchCriteria(filters)
  }

  toQuery(): PolicyFilters {
    return { ...this.filters };
  }
}
