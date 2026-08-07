import type { RequestHandler } from "express";
import { getAuth } from "@clerk/express";

export const requireUser: RequestHandler = (req, res, next) => {
  const auth = getAuth(req);

  if (!auth.isAuthenticated || !auth.userId) {
    res.status(401).json({
      error: "UNAUTHORIZED"
    });
    return;
  }

  res.locals.clerkUserId = auth.userId;

  next();
};
