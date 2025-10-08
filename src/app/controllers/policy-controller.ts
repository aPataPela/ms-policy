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
  searchById: async (req: Request, res: Response) => {
    const id = req.params?.id || null;
    const policy = await policySearcher.run({ id });
    res.status(200).send(policy);
  },
  search: async (req: Request, res: Response) => {
    const id = req.params?.id || null;
    const queryParam = req.query || null
    const policy = await policySearcher.run({ ...queryParam, id });
    res.status(200).send(policy);
  },
});
