import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),

  PORT: z
    .coerce
    .number()
    .int()
    .positive()
    .default(4000),

  DATABASE_URL: z
    .string()
    .min(1),

  FRONTEND_ORIGIN: z
    .string()
    .url(),

  CLERK_PUBLISHABLE_KEY: z
    .string()
    .min(1),

  CLERK_SECRET_KEY: z
    .string()
    .min(1),

  CLERK_AUTHORIZED_PARTIES: z
    .string()
    .min(1)
});

export const env = envSchema.parse(process.env);

export const authorizedParties =
  env.CLERK_AUTHORIZED_PARTIES
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
