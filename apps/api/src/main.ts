import Fastify from "fastify";
import cors from "@fastify/cors";
import { healthRoutes } from "./features/health/routes.ts";

const app = Fastify({ logger: true });

await app.register(cors, { origin: true });
await app.register(healthRoutes);

const port = Number(process.env.PORT ?? 3000);
try {
  await app.listen({ port, host: "0.0.0.0" });
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
