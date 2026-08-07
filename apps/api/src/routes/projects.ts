import { Router } from "express";
import { z } from "zod";

import { prisma } from "../db.js";
import { requireUser } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const createProjectSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1).max(120),
    type: z.enum([
      "DESIGN_3D",
      "CIRCUIT",
      "CODEBLOCK"
    ])
  }),
  params: z.object({}),
  query: z.object({})
});

export const projectsRouter = Router();

/*
 * List projects owned by the authenticated user.
 */
projectsRouter.get(
  "/",
  requireUser,
  async (_req, res, next) => {
    try {
      const projects = await prisma.project.findMany({
        where: {
          owner: {
            clerkUserId: res.locals.clerkUserId
          },
          deletedAt: null
        },
        orderBy: {
          updatedAt: "desc"
        }
      });

      res.json({
        projects
      });
    } catch (error) {
      next(error);
    }
  }
);

/*
 * Create a new project.
 */
projectsRouter.post(
  "/",
  requireUser,
  validate(createProjectSchema),
  async (req, res, next) => {
    try {
      const owner = await prisma.user.findFirst({
        where: {
          clerkUserId: res.locals.clerkUserId,
          deletedAt: null
        }
      });

      if (!owner) {
        res.status(409).json({
          error: "USER_PROFILE_NOT_INITIALIZED"
        });
        return;
      }

      const project = await prisma.project.create({
        data: {
          ownerId: owner.id,
          name: req.body.name,
          type: req.body.type
        }
      });

      res.status(201).json({
        project
      });
    } catch (error) {
      next(error);
    }
  }
);
