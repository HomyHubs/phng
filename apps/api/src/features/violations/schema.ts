import { z } from "zod";

// slice-2: contract vi phạm. Chốt ở đây, không đổi giữa chừng.
export const createViolationSchema = z.object({
  plate: z.string().min(1).max(20),
  vehicle_type: z.string().min(1).max(50),
  content: z.string().min(1).max(500),
  location: z.string().max(200).optional(),
  occurred_at: z.coerce.date(),
  status: z.enum(["chua_xu_ly", "da_xu_ly"]).optional(),
});

export type CreateViolationInput = z.infer<typeof createViolationSchema>;
