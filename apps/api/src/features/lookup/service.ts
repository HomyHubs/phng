import { callPartnerLookup, loadPartnerConfig } from "./partnerClient.ts";
import type { LookupViolationInput } from "./schema.ts";

// slice-3: domain logic tra cứu, không biết HTTP framework.
// Read-only: nạp cấu hình đối tác rồi gọi tra cứu, trả nguyên văn kết quả (passthrough).
export async function lookupViolations(input: LookupViolationInput): Promise<unknown> {
  const config = loadPartnerConfig();
  return callPartnerLookup(input, config);
}
