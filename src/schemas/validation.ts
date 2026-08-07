import { z } from 'zod';

export const RoleEnum = z.enum(['BUYER', 'SELLER', 'ADMIN']);
export const ProjectTypeEnum = z.enum(['DESIGN_3D', 'CIRCUIT', 'CODEBLOCK']);
export const ListingStatusEnum = z.enum(['DRAFT', 'PENDING_REVIEW', 'APPROVED', 'REJECTED', 'ARCHIVED']);
export const LicenseTypeEnum = z.enum(['PERSONAL_USE', 'COMMERCIAL_USE']);

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character'),
  role: RoleEnum.optional().default('BUYER'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const createProjectSchema = z.object({
  type: ProjectTypeEnum,
  title: z.string().trim().min(1, 'Title is required').max(100, 'Title too long'),
  sceneJson: z.record(z.unknown()).default({}),
});

export const updateProjectSchema = z.object({
  title: z.string().trim().min(1).max(100).optional(),
  sceneJson: z
    .record(z.unknown())
    .refine((data) => JSON.stringify(data).length <= 10 * 1024 * 1024, 'Scene payload exceeds 10MB limit')
    .optional(),
  thumbnailUrl: z.string().url('Invalid URL format').nullable().optional(),
});

export const createListingSchema = z.object({
  projectId: z.string().uuid('Invalid project ID'),
  priceCents: z
    .number()
    .int('Price must be an integer in cents')
    .min(50, 'Minimum price is $0.50')
    .max(1000000, 'Price exceeds maximum limit'),
  title: z.string().trim().min(3, 'Title too short').max(120, 'Title too long'),
  description: z.string().trim().min(10, 'Description must be at least 10 characters'),
  category: z.string().trim().min(1, 'Category is required'),
  licenseType: LicenseTypeEnum.default('PERSONAL_USE'),
});

export const createCheckoutSessionSchema = z.object({
  listingIds: z.array(z.string().uuid('Invalid listing ID')).min(1, 'Cart must contain at least 1 item'),
});

export const createReviewSchema = z.object({
  listingId: z.string().uuid('Invalid listing ID'),
  rating: z.number().int().min(1).max(5),
  comment: z.string().trim().min(3).max(1000),
});

