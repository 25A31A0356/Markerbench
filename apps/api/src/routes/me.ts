import { Router } from "express";

import { prisma } from "../db.js";
import { requireUser } from "../middleware/auth.js";

export const meRouter = Router();

meRouter.get(
  "/",
  requireUser,
  async (_req, res, next) => {
    try {
      const clerkUserId =
        res.locals.clerkUserId as string;

      /*
       * For now, Clerk is the source of truth
       * for authentication identity.
       *
       * The frontend does not provide clerkUserId.
       */
      const user =
        await prisma.user.findFirst({
          where: {
            clerkUserId,
            deletedAt: null,
          },
        });

      if (!user) {
        res.status(404).json({
          error: "USER_NOT_PROVISIONED",
        });

        return;
      }

      res.json({
        user: {
          id: user.id,
          clerkUserId: user.clerkUserId,
          email: user.email,
          displayName: user.displayName,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);
