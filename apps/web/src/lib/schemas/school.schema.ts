import { z } from "zod";

export const updateSchoolSchema = z.object({
  name: z.string().min(2).optional(),
  tagline: z.string().optional(),
  description: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  website: z.string().url().optional().or(z.literal("")),
  amenities: z.array(z.string()).optional(),
  styles: z.array(z.string()).optional(),
  certifications: z.array(z.string()).optional(),
  gallery: z.array(z.string().url()).optional(),
});
