import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(["STUDENT", "SCHOOL_ADMIN"]).default("STUDENT"),
  schoolName: z.string().optional(),
  phone: z.string().optional(),
  nationality: z.string().optional(),
  address: z.string().optional(),
  website: z.string().optional(),
  tagline: z.string().optional(),
  businessRegistrationNo: z.string().optional(),
  yogaCertificateUrl: z.string().optional(),
  personalIdUrl: z.string().optional(),
});
