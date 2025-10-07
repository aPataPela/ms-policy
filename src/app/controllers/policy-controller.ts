import type { Request, Response } from "express";
import { PolicyCreator } from '../../context/policy/application/policy-creator';

export const policyController = (policyCreator: PolicyCreator) => ({
  create: async (req: Request, res: Response) => {
    await policyCreator.run(req.body)
    res.status(201).send('inserted');
  },
});
