// slice-3: client gọi API đối tác tra cứu phạt nguội (dangkiemxe.com).
// ĐÂY là nơi DUY NHẤT đọc apiKey/ClientId. Không hardcode, không commit khoá (AGENTS.md §14).
// Xem ADR-0001. Đổi demo -> chính thức = đổi biến môi trường, không sửa code.

export interface PartnerLookupInput {
  phoneNumber: string;
  licensePlates: string;
  vehicleType: number;
}

export interface PartnerConfig {
  apiUrl: string;
  apiKey: string;
  clientId: string | undefined;
}

// Endpoint demo Trường An gửi qua curl. Ghi đè bằng DANGKIEMXE_API_URL khi ký chính thức.
const DEFAULT_API_URL =
  "https://tracuu.dangkiemxe.com/PartnerAPI/CustomerCriminalRecord/user/userCheckViolation";

const TIMEOUT_MS = 30_000;

// Thiếu cấu hình phía server (ví dụ chưa set apiKey).
export class PartnerConfigError extends Error {}

// Đối tác trả lỗi hoặc không gọi được.
export class PartnerUpstreamError extends Error {
  readonly status: number | undefined;
  constructor(message: string, status?: number) {
    super(message);
    this.name = "PartnerUpstreamError";
    this.status = status;
  }
}

// Đọc cấu hình đối tác từ biến môi trường. Ném PartnerConfigError nếu thiếu apiKey.
export function loadPartnerConfig(env: NodeJS.ProcessEnv = process.env): PartnerConfig {
  const apiKey = env.DANGKIEMXE_API_KEY?.trim();
  if (!apiKey) {
    throw new PartnerConfigError("Thiếu DANGKIEMXE_API_KEY trong biến môi trường");
  }
  return {
    apiUrl: env.DANGKIEMXE_API_URL?.trim() || DEFAULT_API_URL,
    apiKey,
    clientId: env.DANGKIEMXE_CLIENT_ID?.trim() || undefined,
  };
}

// Dựng request thuần (không gọi mạng) để test được URL/header/body.
export function buildLookupRequest(
  input: PartnerLookupInput,
  config: PartnerConfig,
): { url: string; init: { method: string; headers: Record<string, string>; body: string } } {
  const headers: Record<string, string> = {
    apiKey: config.apiKey,
    "Content-Type": "application/json",
  };
  if (config.clientId) {
    headers.ClientId = config.clientId;
  }
  return {
    url: config.apiUrl,
    init: {
      method: "POST",
      headers,
      body: JSON.stringify({
        phoneNumber: input.phoneNumber,
        licensePlates: input.licensePlates,
        vehicleType: input.vehicleType,
      }),
    },
  };
}

// Gọi đối tác. fetchFn inject được để test không chạm mạng.
export async function callPartnerLookup(
  input: PartnerLookupInput,
  config: PartnerConfig,
  fetchFn: typeof fetch = fetch,
): Promise<unknown> {
  const { url, init } = buildLookupRequest(input, config);

  let res: Response;
  try {
    res = await fetchFn(url, { ...init, signal: AbortSignal.timeout(TIMEOUT_MS) });
  } catch (err) {
    throw new PartnerUpstreamError(
      `Không gọi được API đối tác: ${(err as Error).message}`,
    );
  }

  const raw = await res.text();
  if (!res.ok) {
    throw new PartnerUpstreamError(`API đối tác trả HTTP ${res.status}`, res.status);
  }

  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw) as unknown;
  } catch {
    // Đối tác trả không phải JSON — trả nguyên văn để FE vẫn thấy được.
    return { raw };
  }
}
