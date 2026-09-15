import argon2 from "argon2";
import {
  createSession,
  deleteSession,
  findUserByUsername,
  findValidSessionUser,
} from "./repository.ts";
import type { CurrentUser, LoginInput } from "./schema.ts";

// slice-1: domain logic xác thực, không biết HTTP.

export class InvalidCredentialsError extends Error {
  constructor() {
    super("invalid credentials");
    this.name = "InvalidCredentialsError";
  }
}

export async function login(
  input: LoginInput,
): Promise<{ sessionId: string; user: CurrentUser }> {
  const user = await findUserByUsername(input.username);
  if (!user) throw new InvalidCredentialsError();

  const ok = await argon2.verify(user.password_hash, input.password);
  if (!ok) throw new InvalidCredentialsError();

  const sessionId = await createSession(user.id);
  return {
    sessionId,
    user: { id: user.id, username: user.username, role: user.role },
  };
}

export async function logout(sessionId: string): Promise<void> {
  await deleteSession(sessionId);
}

export async function getCurrentUser(
  sessionId: string | undefined,
): Promise<CurrentUser | null> {
  if (!sessionId) return null;
  return (await findValidSessionUser(sessionId)) ?? null;
}
