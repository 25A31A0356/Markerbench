
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

app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: "same-site",
    },
    referrerPolicy: {
      policy: "no-referrer",
    },
  })
);

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
      "OPTIONS",
    ],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
  })
);

app.use(
  express.json({
    limit: "1mb",
  })
);

app.use(
  express.urlencoded({
    extended: false,
    limit: "1mb",
  })
);

app.use(
  clerkMiddleware({
    authorizedParties,
  })
);

/*
 * Authentication rate limit:
 * maximum 5 requests per 15 minutes per IP.
 */
const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    error: "TOO_MANY_REQUESTS",
  },
});

/*
 * Keep authentication-sensitive API endpoints
 * behind the rate limiter.
 */
app.use("/api/auth", authRateLimit);

/*
 * Main API.
 */
app.use("/api", apiRouter);

/*
 * 404 handler.
 */
app.use((_req, res) => {
  res.status(404).json({
    error: "NOT_FOUND",
  });
});

/*
 * Global error handler.
 */
app.use(errorHandler);
