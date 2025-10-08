import type { Request, Response } from "express";
import { PolicyCreator } from '../../context/policy/application/policy-creator';
import { PolicySearcher } from '../../context/policy/application/policy-searcher';
export const policyController = (
  policyCreator: PolicyCreator,
  policySearcher: PolicySearcher,
) => ({
  create: async (req: Request, res: Response) => {
    await policyCreator.run(req.body)
    res.status(201).send('inserted');
  },
  search: async (req: Request, res: Response) => {
    const policy = await policySearcher.run();
    res.status(200).send(policy);
  },
});
