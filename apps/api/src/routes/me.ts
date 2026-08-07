import { Router } from "express";
import { z } from "zod";

import { prisma } from "../db.js";
import { requireUser } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const updateProfileSchema = z.object({
  body: z.object({
    email: z.email(),
    displayName: z
      .string()
      .trim()
      .min(1)
      .max(100)
      .optional()
  }),
  params: z.object({}),
  query: z.object({})
});

export const meRouter = Router();

/*
 * Get the authenticated MakerBench user.
 */
meRouter.get("/", requireUser, async (_req, res, next) => {
  try {
    const user = await prisma.user.findFirst({
      where: {
        clerkUserId: res.locals.clerkUserId,
        deletedAt: null
      }
    });

    res.json({
      user
    });
  } catch (error) {
    next(error);
  }
});

/*
 * Create/update the application profile for
 * the currently authenticated Clerk user.
 */
meRouter.put(
  "/",
  requireUser,
  validate(updateProfileSchema),
  async (req, res, next) => {
    try {
      const user = await prisma.user.upsert({
        where: {
          clerkUserId: res.locals.clerkUserId
        },
        create: {
          clerkUserId: res.locals.clerkUserId,
          email: req.body.email,
          displayName: req.body.displayName
        },
        update: {
          email: req.body.email,
          displayName: req.body.displayName,
          deletedAt: null
        }
      });

      res.json({
        user
      });
    } catch (error) {
      next(error);
    }
  }
);
