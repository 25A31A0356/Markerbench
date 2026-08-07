import { Router } from "express";

import { healthRouter } from "./health.js";
import { meRouter } from "./me.js";

export const apiRouter = Router();

apiRouter.use("/health", healthRouter);
apiRouter.use("/me", meRouter);
