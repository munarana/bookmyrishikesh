import { z } from "zod";

export const roomTypeSchema = z.object({
  type: z.string().min(1),
  priceAddon: z.number().min(0),
});

export const createCourseSchema = z.object({
  name: z.string().min(3),
  category: z.string().min(2),
  style: z.string().min(2),
  description: z.string().min(10),
  level: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED", "ALL_LEVELS"]),
  durationDays: z.number().int().positive(),
  priceUSD: z.number().positive(),
  priceINR: z.number().positive(),
  includedItems: z.array(z.string()).default([]),
  highlights: z.array(z.string()).default([]),
  excludes: z.array(z.string()).default([]),
  roomTypes: z.array(roomTypeSchema).default([]),
  isPublished: z.boolean().optional().default(false),
});

export const updateCourseSchema = createCourseSchema.partial();

export const createCourseDateSchema = z.object({
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  capacity: z.number().int().positive(),
  priceOverride: z.number().positive().optional(),
});

export const updateCourseDateSchema = createCourseDateSchema.partial();
