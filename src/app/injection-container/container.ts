
import { createContainer, asClass, InjectionMode, Lifetime, AwilixContainer, asFunction } from "awilix";
import { policyController } from '../controllers/policy-controller';
import { PolicyCreator } from '../../context/policy/application/policy-creator';
import { NePolicyRepository } from '../../context/policy/infrastructure/ne-policy-repository';



export type Cradle = {
  //logger: ReturnType<typeof consoleLogger>;
  policyController: ReturnType<typeof policyController>;
  policyCreator: PolicyCreator;
  policyRepository: NePolicyRepository;
};

// Contenedor raíz: PROXY permite inyección por objeto { depA, depB }
export const container: AwilixContainer<Cradle> = createContainer<Cradle>({
  injectionMode: InjectionMode.CLASSIC,
});

container.register({
  //  logger: asFunction(consoleLogger).singleton(),
  policyRepository: asClass(NePolicyRepository, { lifetime: Lifetime.SINGLETON }),
  policyController: asFunction(policyController, { lifetime: Lifetime.SCOPED }),
  policyCreator: asClass(PolicyCreator, { lifetime: Lifetime.SCOPED }),
});
