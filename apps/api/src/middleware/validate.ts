import type {
  Request,
  Response,
  NextFunction,
} from "express";

import { z } from "zod";

export function validate(
  schema: z.ZodTypeAny
) {
  return (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    if (!result.success) {
      res.status(400).json({
        error: "VALIDATION_ERROR",
        details: result.error.issues,
      });

      return;
    }

    const data = result.data as {
      body?: unknown;
      params?: unknown;
      query?: unknown;
    };

    if (data.body !== undefined) {
      req.body = data.body;
    }

    next();
  };
}
