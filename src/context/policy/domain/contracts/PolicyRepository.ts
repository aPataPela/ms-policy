import { Policy } from '../class/Policy';

export interface PolicyRepository {
  create(policy: Policy): Promise<void>;
}