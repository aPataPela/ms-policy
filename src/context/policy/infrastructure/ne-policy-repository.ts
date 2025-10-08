import { NeDBClient } from '../../shared/infrastructure/ne-db';
import { Policy } from '../domain/class/Policy';
import { PolicyRepository } from '../domain/contracts/PolicyRepository';
import { PolicySearchCriteria } from '../domain/criteria/policy-search-criteria';

export class NePolicyRepository extends NeDBClient<Policy> implements PolicyRepository {
  async create(policy: Policy): Promise<void> {
    await this.insert(policy).catch((err) => { throw Error(`<${this.constructor}> Create: ${err}`) });
  }
  async search(criteria: PolicySearchCriteria): Promise<Policy[] | null> {
    const query = criteria.toQuery();
    const policies = await this.all(query as Partial<Policy>).catch((err) => { throw Error(`<${this.constructor}> Search:  ${err}`) });
    if (!policies) return null;
    return policies.map((policy) => Policy.create(policy.id, policy.rutTitular, policy.fechaEmision, policy.planSalud, policy.prima, policy.estado));
  }

  async update(policyAttr: Partial<Policy>, criteria: PolicySearchCriteria): Promise<void> {
    const query = criteria.toQuery();
    await this.updateOne(query, policyAttr);
  }
}
