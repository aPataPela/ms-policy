import { NeDBClient } from '../../shared/infrastructure/ne-db';
import { Policy } from '../domain/class/Policy';
import { PolicyRepository } from '../domain/contracts/PolicyRepository';

export class NePolicyRepository extends NeDBClient<Policy> implements PolicyRepository {
  async create(policy: Policy): Promise<void> {
    console.log('implementacion repo')
    await this.insert(policy);
  }
}