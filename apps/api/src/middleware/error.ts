import type {
  Request,
  Response,
  NextFunction,
} from "express";

import { ZodError } from "zod";

export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  console.error(error);

  if (error instanceof ZodError) {
    res.status(400).json({
      error: "VALIDATION_ERROR",
      details: error.flatten(),
    });

    return;
  }

  res.status(500).json({
    error: "INTERNAL_SERVER_ERROR",
  });
}
