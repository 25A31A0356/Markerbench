import type { Request, Response, NextFunction } from "express";
import { getAuth } from "@clerk/express";

export function requireUser(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  const auth = getAuth(res);

  if (!auth.userId) {
    res.status(401).json({
      error: "UNAUTHORIZED"
    });

    return;
  }

  res.locals.clerkUserId = auth.userId;

  next();
}
