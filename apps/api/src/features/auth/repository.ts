import { randomUUID } from "node:crypto";
import { db } from "../../db.ts";
import type { CurrentUser } from "./schema.ts";

// slice-1: truy vấn user + session. Chỉ tầng dữ liệu, không biết HTTP.

export async function findUserByUsername(username: string) {
  return db
    .selectFrom("app_user")
    .select(["id", "username", "password_hash", "role"])
    .where("username", "=", username)
    .executeTakeFirst();
}

const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 ngày

export async function createSession(userId: number): Promise<string> {
  const id = randomUUID();
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);
  await db
    .insertInto("session")
    .values({ id, user_id: userId, expires_at: expiresAt })
    .execute();
  return id;
}

export async function findValidSessionUser(
  sessionId: string,
): Promise<CurrentUser | undefined> {
  const row = await db
    .selectFrom("session")
    .innerJoin("app_user", "app_user.id", "session.user_id")
    .select([
      "app_user.id as id",
      "app_user.username as username",
      "app_user.role as role",
      "session.expires_at as expires_at",
    ])
    .where("session.id", "=", sessionId)
    .executeTakeFirst();

  if (!row) return undefined;
  if (row.expires_at.getTime() < Date.now()) {
    await deleteSession(sessionId);
    return undefined;
  }
  return { id: row.id, username: row.username, role: row.role };
}

export async function deleteSession(sessionId: string) {
  await db.deleteFrom("session").where("id", "=", sessionId).execute();
}
