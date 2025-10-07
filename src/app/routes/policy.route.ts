import { Router } from "express";
import { makeInvoker } from "awilix-express";
import { policyController } from '../controllers/policy-controller';

export function policyRoutes() {
  const r = Router();
  const controller = makeInvoker(policyController);

  r.post("/", controller("create"));
  return r;
}
