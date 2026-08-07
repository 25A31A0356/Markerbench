import type { RequestHandler } from "express";
import { z } from "zod";

export const validate = (schema: z.ZodType): RequestHandler => {
  return (req, res, next) => {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query
    });

    if (!result.success) {
      res.status(400).json({
        error: "VALIDATION_ERROR",
        issues: result.error.issues
      });
      return;
    }

    const data = result.data as {
      body?: unknown;
    };

    if (data.body !== undefined) {
      req.body = data.body;
    }

    next();
  };
};
