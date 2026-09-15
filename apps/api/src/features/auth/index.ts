// Cửa công khai của feature auth. Module khác chỉ import qua đây.
export { authRoutes, requireAuth } from "./routes.ts";
export type { CurrentUser } from "./schema.ts";
