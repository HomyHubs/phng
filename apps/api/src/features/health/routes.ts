import type { FastifyInstance } from "fastify";
import { sql } from "kysely";
import { db } from "../../db.ts";

// GET /health — Task 1 + 3 của slice-0.
// Ping database THẬT bằng SELECT 1; phản ánh up/down vào response.
export async function healthRoutes(app: FastifyInstance) {
  app.get("/health", async () => {
    let dbStatus: "up" | "down" = "down";
    try {
      await sql`select 1`.execute(db);
      dbStatus = "up";
    } catch (err) {
      app.log.error(err, "database ping failed");
    }

    return {
      status: dbStatus === "up" ? "ok" : "degraded",
      db: dbStatus,
    };
  });
}
