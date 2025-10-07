import { Policy } from '../domain/class/Policy';
import { PolicyRepository } from '../domain/contracts/PolicyRepository';

export class PolicyCreator {
  constructor(
    private policyRepository: PolicyRepository
  ) { }

  async run(policy: Policy) {
    console.log('creador')
    return this.policyRepository.create(policy);
  }
}
