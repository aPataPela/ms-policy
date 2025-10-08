import { NeDBClient } from '../../shared/infrastructure/ne-db';
import { Policy } from '../domain/class/Policy';
import { PolicyRepository } from '../domain/contracts/PolicyRepository';

export class NePolicyRepository extends NeDBClient<Policy> implements PolicyRepository {
  async create(policy: Policy): Promise<void> {
    await this.insert(policy).catch((err) => { throw Error(`<${this.constructor}> Create: ${err}`) });
  }
  async search(): Promise<Policy[] | null> {
    const policies = await this.all().catch((err) => { throw Error(`<${this.constructor}> Search:  ${err}`) });
    if (!policies) return null;
    return policies;
  }
}