import { z } from "zod";

export const createBookingSchema = z.object({
  courseId: z.string().min(1),
  courseDateId: z.string().min(1),
  roomType: z.string().min(1),
  notes: z.string().optional(),
});
