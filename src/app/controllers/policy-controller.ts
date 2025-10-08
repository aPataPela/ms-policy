import type { Request, Response } from "express";
import { PolicyCreator } from '../../context/policy/application/policy-creator';
import { PolicySearcher } from '../../context/policy/application/policy-searcher';
import { PolicyUpdater } from '../../context/policy/application/policy-updater';
export const policyController = (
  policyCreator: PolicyCreator,
  policySearcher: PolicySearcher,
  policyUpdater: PolicyUpdater,
) => ({
  create: async (req: Request, res: Response) => {
    await policyCreator.run(req.body)
    res.status(201).send('inserted');
  },
  searchByCriteria: async (req: Request, res: Response) => {
    const id = req.params?.id || null;
    const queryParam = req.query || null
    const policy = await policySearcher.run({ ...queryParam, id });
    res.status(200).send(policy);
  },
  update: async (req: Request, res: Response) => {
    const id = req.params?.id || '';
    const reqBody = req?.body || null
    await policyUpdater.run(reqBody, id);
    res.status(201).send('updated');
  },
});
