import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { clerkMiddleware } from "@clerk/express";

import { env, authorizedParties } from "./config.js";
import { apiRouter } from "./routes/index.js";
import { errorHandler } from "./middleware/error.js";

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
 * Restrict browser requests to the MakerBench frontend.
 */
app.use(
  cors({
    origin: env.FRONTEND_ORIGIN,
    credentials: true,
    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS"
    ],
    allowedHeaders: [
      "Content-Type",
      "Authorization"
    ]
  })
);

/*
 * Request body limits.
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
 * Clerk authentication/session middleware.
 */
app.use(
  clerkMiddleware({
    authorizedParties
  })
);

/*
 * Authentication-sensitive rate limiter.
 *
 * 5 requests per 15 minutes per IP.
 */
const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    error: "TOO_MANY_REQUESTS"
  }
});

/*
 * API routes.
 */
app.use("/api", apiRouter);

/*
 * Authentication-sensitive endpoints
 * will use authRateLimit when their routes are added.
 */
app.use("/api/auth", authRateLimit);

/*
 * 404 handler.
 */
app.use((_req, res) => {
  res.status(404).json({
    error: "NOT_FOUND"
  });
});

/*
 * Global error handler.
 */
app.use(errorHandler);
