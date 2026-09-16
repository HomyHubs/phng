// slice-2: gọi API vi phạm. Cookie HttpOnly nên luôn kèm credentials.
export interface Violation {
  id: number;
  plate: string;
  vehicle_type: string;
  content: string;
  location: string | null;
  occurred_at: string;
  status: "chua_xu_ly" | "da_xu_ly";
}

export interface CreateViolationInput {
  plate: string;
  vehicle_type: string;
  content: string;
  location?: string;
  occurred_at: string;
}

export async function apiListViolations(): Promise<Violation[]> {
  const res = await fetch("/violations", { credentials: "include" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = (await res.json()) as { violations: Violation[] };
  return data.violations;
}

export async function apiCreateViolation(input: CreateViolationInput): Promise<void> {
  const res = await fetch("/violations", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(body.error ?? `HTTP ${res.status}`);
  }
}
