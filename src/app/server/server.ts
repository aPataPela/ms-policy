import express, { Router } from "express";
import { container } from "../injection-container/container"
import { policyRoutes } from "../routes/policy.route";
import { scopePerRequest, makeInvoker } from 'awilix-express';

export function createServer() {
  const app = express();
  app.use(scopePerRequest(container));
  app.use(express.json());
  const router = Router();

  router.use("/policies", policyRoutes());

  app.use("/api", router);

  app.use((req, res) => {
    res.status(404).json({ error: "Not found" });
  });

  app.use((err: unknown, req: express.Request, res: express.Response, _next: express.NextFunction) => {
    res.status(500).json({ error: "Internal Server Error" });
  });
  return app;
}


