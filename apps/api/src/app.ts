import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { clerkMiddleware } from "@clerk/express";

import { env, authorizedParties } from "./config.js";

export const app = express();

app.disable("x-powered-by");
app.set("trust proxy", 1);

/*
 * Security headers
 */
app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: "same-site"
    },
    referrerPolicy: {
      policy: "no-referrer"
    }
  })
);

/*
 * Only allow requests from the MakerBench frontend.
 */
app.use(
  cors({
    origin: env.FRONTEND_ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

/*
 * Limit request body size to reduce abuse.
 */
app.use(
  express.json({
    limit: "1mb"
  })
);

app.use(
  express.urlencoded({
    extended: false,
    limit: "1mb"
  })
);

/*
 * Clerk validates the authentication session.
 */
app.use(
  clerkMiddleware({
    authorizedParties
  })
);

/*
 * Authentication-sensitive endpoints:
 * 5 requests per 15 minutes per IP.
 */
export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    error: "TOO_MANY_REQUESTS"
  }
});

/*
 * Temporary protected API endpoints.
 * These will be replaced/expanded as we add routes.
 */
app.get("/api", (_req, res) => {
  res.json({
    name: "MakerBench API",
    version: "1.0.0"
  });
});

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    service: "makerbench-api"
  });
});
