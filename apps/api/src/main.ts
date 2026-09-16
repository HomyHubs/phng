import Fastify from "fastify";
import cors from "@fastify/cors";
import cookie from "@fastify/cookie";
import { healthRoutes } from "./features/health/routes.ts";
import { authRoutes } from "./features/auth/index.ts";
import { violationRoutes } from "./features/violations/index.ts";
import { runMigrations } from "./db.ts";

const app = Fastify({ logger: true });

// slice-1: chỉ cho phép các origin nằm trong allowlist (CORS_ORIGINS, phân tách bằng dấu phẩy).
// Bắt buộc khai báo tường minh vì credentials: true không thể đi cùng origin phản chiếu tùy ý.
const allowedOrigins = (process.env.CORS_ORIGINS ?? "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

await app.register(cors, {
  origin: (origin, cb) => {
    // Cho phép request không có Origin (curl, health check, same-origin).
    if (!origin || allowedOrigins.includes(origin)) {
      cb(null, true);
      return;
    }
    cb(new Error("Origin không được phép bởi CORS"), false);
  },
  credentials: true,
});
await app.register(cookie);
await app.register(healthRoutes);
await app.register(authRoutes);
await app.register(violationRoutes);

// slice-1: đảm bảo schema tồn tại trước khi nhận request.
await runMigrations();

const port = Number(process.env.PORT ?? 3000);
try {
  await app.listen({ port, host: "0.0.0.0" });
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
