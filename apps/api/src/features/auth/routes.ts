import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { loginSchema, type CurrentUser } from "./schema.ts";
import {
  getCurrentUser,
  InvalidCredentialsError,
  login,
  logout,
} from "./service.ts";

const SESSION_COOKIE = "sid";

function setSessionCookie(reply: FastifyReply, sessionId: string) {
  reply.setCookie(SESSION_COOKIE, sessionId, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
  });
}

// Guard: gắn user vào request nếu có phiên hợp lệ, nếu không trả 401.
export async function requireAuth(req: FastifyRequest, reply: FastifyReply) {
  const sessionId = req.cookies[SESSION_COOKIE];
  const user = await getCurrentUser(sessionId);
  if (!user) {
    reply.code(401).send({ error: "unauthorized" });
    return;
  }
  (req as FastifyRequest & { user: CurrentUser }).user = user;
}

export async function authRoutes(app: FastifyInstance) {
  app.post("/auth/login", async (req, reply) => {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: "invalid input" });
    }
    try {
      const { sessionId, user } = await login(parsed.data);
      setSessionCookie(reply, sessionId);
      return { user };
    } catch (err) {
      if (err instanceof InvalidCredentialsError) {
        return reply.code(401).send({ error: "invalid credentials" });
      }
      req.log.error(err, "login failed");
      return reply.code(500).send({ error: "internal error" });
    }
  });

  app.post("/auth/logout", async (req, reply) => {
    const sessionId = req.cookies[SESSION_COOKIE];
    if (sessionId) await logout(sessionId);
    reply.clearCookie(SESSION_COOKIE, { path: "/" });
    return { ok: true };
  });

  // Trang protected mẫu: FE dùng để biết đã đăng nhập chưa.
  app.get("/auth/me", { preHandler: requireAuth }, async (req) => {
    return { user: (req as FastifyRequest & { user: CurrentUser }).user };
  });
}
