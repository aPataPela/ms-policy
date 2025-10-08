
import { createContainer, asClass, InjectionMode, Lifetime, AwilixContainer, asFunction } from "awilix";
import { policyController } from '../controllers/policy-controller';
import { PolicyCreator } from '../../context/policy/application/policy-creator';
import { NePolicyRepository } from '../../context/policy/infrastructure/ne-policy-repository';
import { PolicySearcher } from '../../context/policy/application/policy-searcher';
import { PolicyUpdater } from '../../context/policy/application/policy-updater';



export type Cradle = {
  //logger: ReturnType<typeof consoleLogger>;
  policyRepository: NePolicyRepository;
  policyController: ReturnType<typeof policyController>;
  policyCreator: PolicyCreator;
  policySearcher: PolicySearcher;
  policyUpdater: PolicyUpdater;
};

export const container: AwilixContainer<Cradle> = createContainer<Cradle>({
  injectionMode: InjectionMode.CLASSIC,
});

container.register({
  //  logger: asFunction(consoleLogger).singleton(),
  policyRepository: asClass(NePolicyRepository, { lifetime: Lifetime.SINGLETON }),
  policyController: asFunction(policyController, { lifetime: Lifetime.SCOPED }),
  policyCreator: asClass(PolicyCreator, { lifetime: Lifetime.SCOPED }),
  policySearcher: asClass(PolicySearcher, { lifetime: Lifetime.SCOPED }),
  policyUpdater: asClass(PolicyUpdater, { lifetime: Lifetime.SCOPED }),
});
