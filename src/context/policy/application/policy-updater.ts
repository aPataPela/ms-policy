import { Policy } from '../domain/class/Policy';
import { PolicyRepository } from '../domain/contracts/PolicyRepository';
import { PolicySearchCriteria, RawFilters } from '../domain/criteria/policy-search-criteria';

export class PolicyUpdater {
  constructor(
    private policyRepository: PolicyRepository
  ) { }

  async run(policyAttr: Partial<Policy>, id: string): Promise<void> {
    const criteria = PolicySearchCriteria.from({ id });
    return this.policyRepository.update(policyAttr, criteria);
  }
}
