import Fastify from "fastify";
import cors from "@fastify/cors";
import cookie from "@fastify/cookie";
import { healthRoutes } from "./features/health/routes.ts";
import { authRoutes } from "./features/auth/index.ts";
import { runMigrations } from "./db.ts";

const app = Fastify({ logger: true });

await app.register(cors, { origin: true, credentials: true });
await app.register(cookie);
await app.register(healthRoutes);
await app.register(authRoutes);

// slice-1: đảm bảo schema tồn tại trước khi nhận request.
await runMigrations();

const port = Number(process.env.PORT ?? 3000);
try {
  await app.listen({ port, host: "0.0.0.0" });
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
