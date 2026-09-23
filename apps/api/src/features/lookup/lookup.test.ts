import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildLookupRequest,
  callPartnerLookup,
  loadPartnerConfig,
  PartnerConfigError,
  PartnerUpstreamError,
  type PartnerConfig,
} from "./partnerClient.ts";
import { lookupViolationSchema } from "./schema.ts";

// slice-3: test KHÔNG chạm mạng, KHÔNG chạm DB. fetch được inject giả.
// "Khi chính thức sẽ sửa lại test sau" — hiện chỉ khoá hành vi dựng request + xử lý lỗi.

const CONFIG: PartnerConfig = {
  apiUrl: "https://example.test/lookup",
  apiKey: "test-key",
  clientId: "test-client",
};

const INPUT = { phoneNumber: "0999999999", licensePlates: "52T7777", vehicleType: 1 };

describe("lookup schema", () => {
  it("chấp nhận input hợp lệ và đặt vehicleType mặc định = 1", () => {
    const parsed = lookupViolationSchema.parse({
      phoneNumber: "0999999999",
      licensePlates: "52T7777",
    });
    assert.equal(parsed.vehicleType, 1);
    assert.equal(parsed.licensePlates, "52T7777");
  });

  it("từ chối số điện thoại quá ngắn/không hợp lệ", () => {
    const r = lookupViolationSchema.safeParse({
      phoneNumber: "abc",
      licensePlates: "52T7777",
      vehicleType: 1,
    });
    assert.equal(r.success, false);
  });
});

describe("loadPartnerConfig", () => {
  it("ném PartnerConfigError khi thiếu DANGKIEMXE_API_KEY", () => {
    assert.throws(() => loadPartnerConfig({}), PartnerConfigError);
  });

  it("đọc key + clientId, dùng URL mặc định khi không set", () => {
    const cfg = loadPartnerConfig({
      DANGKIEMXE_API_KEY: "k",
      DANGKIEMXE_CLIENT_ID: "c",
    });
    assert.equal(cfg.apiKey, "k");
    assert.equal(cfg.clientId, "c");
    assert.match(cfg.apiUrl, /userCheckViolation$/);
  });
});

describe("buildLookupRequest", () => {
  it("gắn header apiKey + ClientId và body đúng 3 trường", () => {
    const { url, init } = buildLookupRequest(INPUT, CONFIG);
    assert.equal(url, CONFIG.apiUrl);
    assert.equal(init.method, "POST");
    assert.equal(init.headers.apiKey, "test-key");
    assert.equal(init.headers.ClientId, "test-client");
    assert.equal(init.headers["Content-Type"], "application/json");
    assert.deepEqual(JSON.parse(init.body), INPUT);
  });

  it("bỏ header ClientId khi không cấu hình clientId", () => {
    const { init } = buildLookupRequest(INPUT, { ...CONFIG, clientId: undefined });
    assert.equal("ClientId" in init.headers, false);
  });
});

describe("callPartnerLookup (fetch giả)", () => {
  it("trả JSON đã parse khi đối tác trả 200", async () => {
    const seen: string[] = [];
    const fakeFetch: typeof fetch = async (url) => {
      seen.push(String(url));
      return new Response(JSON.stringify({ status: "OK", data: [] }), {
        status: 200,
        headers: { "content-type": "application/json" },
      });
    };
    const out = await callPartnerLookup(INPUT, CONFIG, fakeFetch);
    assert.deepEqual(out, { status: "OK", data: [] });
    assert.equal(seen[0], CONFIG.apiUrl);
  });

  it("ném PartnerUpstreamError khi đối tác trả lỗi", async () => {
    const fakeFetch: typeof fetch = async () => new Response("nope", { status: 500 });
    await assert.rejects(
      () => callPartnerLookup(INPUT, CONFIG, fakeFetch),
      PartnerUpstreamError,
    );
  });
});
