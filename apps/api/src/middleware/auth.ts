import type {
  Request,
  Response,
  NextFunction,
} from "express";

import { getAuth } from "@clerk/express";

export function requireUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { isAuthenticated, userId } = getAuth(req);

  if (!isAuthenticated || !userId) {
    res.status(401).json({
      error: "UNAUTHORIZED",
    });

    return;
  }

  res.locals.clerkUserId = userId;

  next();
}
