import { Policy } from '../domain/class/Policy';
import { PolicyRepository } from '../domain/contracts/PolicyRepository';
import { PolicySearchCriteria, RawFilters } from '../domain/criteria/policy-search-criteria';

export class PolicySearcher {
  constructor(
    private policyRepository: PolicyRepository
  ) { }

  async run(filter: RawFilters): Promise<Policy[] | null> {
    const criteria = PolicySearchCriteria.from(filter);
    return this.policyRepository.search(criteria);
  }
}
