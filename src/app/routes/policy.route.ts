import { Router } from "express";
import { makeInvoker } from "awilix-express";
import { policyController } from '../controllers/policy-controller';
import { validSchemeCreatePolicy } from "../middlewares/policy/policy-create-schemma";
import { validSchemeUpdatePolicy } from '../middlewares/policy/policy-update-schemma';

export function policyRoutes() {
  const r = Router();
  const controller = makeInvoker(policyController);

  r.post("/", validSchemeCreatePolicy, controller("create"));
  r.get("/", controller("searchByCriteria"));
  r.get("/:id", controller("searchByCriteria"));
  r.put("/:id/status", validSchemeUpdatePolicy, controller("update"));
  return r;
}
