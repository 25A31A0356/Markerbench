import { Router } from "express";
import { z } from "zod";

import { prisma } from "../db.js";
import { requireUser } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

export const projectsRouter = Router();

const createProjectSchema = z.object({
  body: z.object({
    name: z
      .string()
      .trim()
      .min(1)
      .max(120),

    type: z.enum([
      "DESIGN_3D",
      "CIRCUIT",
      "CODEBLOCK",
    ]),
  }),

  params: z.object({}),

  query: z.object({}),
});

projectsRouter.get(
  "/",
  requireUser,
  async (_req, res, next) => {
    try {
      const clerkUserId =
        res.locals.clerkUserId as string;

      const user = await prisma.user.findFirst({
        where: {
          clerkUserId,
          deletedAt: null,
        },
        select: {
          id: true,
        },
      });

      if (!user) {
        res.status(404).json({
          error: "USER_NOT_FOUND",
        });

        return;
      }

      const projects =
        await prisma.project.findMany({
          where: {
            ownerId: user.id,
            deletedAt: null,
          },
          orderBy: {
            createdAt: "desc",
          },
        });

      res.json({ projects });
    } catch (error) {
      next(error);
    }
  }
);

projectsRouter.post(
  "/",
  requireUser,
  validate(createProjectSchema),
  async (req, res, next) => {
    try {
      const clerkUserId =
        res.locals.clerkUserId as string;

      const user = await prisma.user.findFirst({
        where: {
          clerkUserId,
          deletedAt: null,
        },
        select: {
          id: true,
        },
      });

      if (!user) {
        res.status(404).json({
          error: "USER_NOT_FOUND",
        });

        return;
      }

      const project =
        await prisma.project.create({
          data: {
            ownerId: user.id,
            name: req.body.name,
            type: req.body.type,
          },
        });

      res.status(201).json({
        project,
      });
    } catch (error) {
      next(error);
    }
  }
);
