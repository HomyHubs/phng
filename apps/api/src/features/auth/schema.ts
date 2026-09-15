import { z } from "zod";

// slice-1: contract xác thực. Chốt ở đây, không đổi giữa chừng.
export const loginSchema = z.object({
  username: z.string().min(1).max(100),
  password: z.string().min(1).max(200),
});

export type LoginInput = z.infer<typeof loginSchema>;

export interface CurrentUser {
  id: number;
  username: string;
  role: "admin" | "user";
}
