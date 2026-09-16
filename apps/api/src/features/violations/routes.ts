import type { FastifyInstance } from "fastify";
import { requireAuth } from "../auth/index.ts";
import { createViolationSchema } from "./schema.ts";
import { createViolation, getViolations } from "./service.ts";

// slice-2: endpoint tạo + liệt kê vi phạm. Cả hai nằm sau requireAuth (dùng cửa công khai của auth).
export async function violationRoutes(app: FastifyInstance) {
  app.get("/violations", { preHandler: requireAuth }, async () => {
    const violations = await getViolations();
    return { violations };
  });

  app.post("/violations", { preHandler: requireAuth }, async (req, reply) => {
    const parsed = createViolationSchema.safeParse(req.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: "invalid input" });
    }
    await createViolation(parsed.data);
    return reply.code(201).send({ ok: true });
  });
}
