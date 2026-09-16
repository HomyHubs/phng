// slice-1: gọi API auth. Cookie HttpOnly nên luôn kèm credentials.
export interface CurrentUser {
  id: number;
  username: string;
  role: "admin" | "user";
}

export async function apiLogin(
  username: string,
  password: string,
): Promise<CurrentUser> {
  const res = await fetch("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(body.error ?? `HTTP ${res.status}`);
  }
  const data = (await res.json()) as { user: CurrentUser };
  return data.user;
}

export async function apiLogout(): Promise<void> {
  await fetch("/auth/logout", { method: "POST", credentials: "include" });
}

export async function apiMe(): Promise<CurrentUser | null> {
  const res = await fetch("/auth/me", { credentials: "include" });
  if (res.status === 401) return null;
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = (await res.json()) as { user: CurrentUser };
  return data.user;
}
