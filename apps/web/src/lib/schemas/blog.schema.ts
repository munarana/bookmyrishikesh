import { z } from "zod";

export const createPostSchema = z.object({
  title: z.string().min(5),
  excerpt: z.string().optional(),
  content: z.string().min(20),
  coverImage: z.string().url().optional().or(z.literal("")),
  category: z.enum([
    "YOGA_TIPS",
    "TTC_GUIDE",
    "RISHIKESH_TRAVEL",
    "WELLNESS",
    "RETREAT_GUIDE",
    "SCHOOL_SPOTLIGHT",
    "STUDENT_STORIES",
  ]),
  tags: z.array(z.string()).default([]),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
  isFeatured: z.boolean().default(false),
  seoTitle: z.string().optional(),
  seoDesc: z.string().optional(),
});

export const updatePostSchema = createPostSchema.partial();
