import { Policy } from '../domain/class/Policy';
import { PolicyRepository } from '../domain/contracts/PolicyRepository';

export class PolicySearcher {
  constructor(
    private policyRepository: PolicyRepository
  ) { }

  async run() {
    return this.policyRepository.search();
  }
}
