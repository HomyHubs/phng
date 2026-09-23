// slice-3: gọi API tra cứu phạt nguội (qua backend). Cookie HttpOnly nên luôn kèm credentials.
export interface LookupInput {
  phoneNumber: string;
  licensePlates: string;
  vehicleType: number;
}

// Trả về nguyên văn `result` đối tác trả (schema do đối tác định nghĩa) — FE hiển thị thô.
export async function apiLookupViolations(input: LookupInput): Promise<unknown> {
  const res = await fetch("/lookup/violations", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(body.error ?? `HTTP ${res.status}`);
  }
  const data = (await res.json()) as { result: unknown };
  return data.result;
}
