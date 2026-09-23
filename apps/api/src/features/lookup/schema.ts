import { z } from "zod";

// slice-3: contract tra cứu phạt nguội. Chốt ở đây, không đổi giữa chừng (AGENTS.md §8).
export const lookupViolationSchema = z.object({
  phoneNumber: z.string().min(8).max(15),
  licensePlates: z.string().min(1).max(20),
  vehicleType: z.number().int().positive().default(1),
});

export type LookupViolationInput = z.infer<typeof lookupViolationSchema>;
