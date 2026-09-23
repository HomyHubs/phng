import type { FastifyInstance } from "fastify";
import { requireAuth } from "../auth/index.ts";
import { lookupViolationSchema } from "./schema.ts";
import { lookupViolations } from "./service.ts";
import { PartnerConfigError, PartnerUpstreamError } from "./partnerClient.ts";

// slice-3: tra cứu phạt nguội qua API đối tác (dangkiemxe.com). Sau requireAuth. Read-only.
export async function lookupRoutes(app: FastifyInstance) {
  app.post("/lookup/violations", { preHandler: requireAuth }, async (req, reply) => {
    const parsed = lookupViolationSchema.safeParse(req.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: "invalid input" });
    }
    try {
      const result = await lookupViolations(parsed.data);
      return { result };
    } catch (err) {
      if (err instanceof PartnerConfigError) {
        req.log.error(err, "lookup not configured");
        return reply.code(500).send({ error: "lookup not configured" });
      }
      if (err instanceof PartnerUpstreamError) {
        req.log.warn(err, "partner upstream error");
        return reply.code(502).send({ error: "upstream error" });
      }
      req.log.error(err, "lookup failed");
      return reply.code(500).send({ error: "internal error" });
    }
  });
}
