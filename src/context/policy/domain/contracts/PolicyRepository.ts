import { Policy } from '../class/Policy';
import { PolicySearchCriteria } from '../criteria/policy-search-criteria';

export interface PolicyRepository {
  create(policy: Policy): Promise<void>;
  search(criteria: PolicySearchCriteria): Promise<Policy[] | null>;
}
