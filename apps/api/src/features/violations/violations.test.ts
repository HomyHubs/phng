import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { after, before, beforeEach, describe, it } from "node:test";
import Fastify, { type FastifyInstance } from "fastify";
import cookie from "@fastify/cookie";
import { sql } from "kysely";
import { db, runMigrations } from "../../db.ts";
import { violationRoutes } from "./index.ts";
import { createViolation, getViolations } from "./service.ts";
import { upsertVehicleByPlate } from "./repository.ts";

// slice-2: kiểm thử tích hợp chạy trên Postgres THẬT (AGENTS.md §16 dòng 363, §20 dòng 400).
// Cần DB: `pnpm db:up` (compose.dev.yml) hoặc đặt DATABASE_URL. runMigrations() tự dựng schema.

async function resetDb(): Promise<void> {
  // CASCADE xử lý FK violation->vehicle và session->app_user; RESTART IDENTITY để id ổn định.
  await sql`TRUNCATE violation, vehicle, session, app_user RESTART IDENTITY CASCADE`.execute(db);
}

// Tạo user + phiên hợp lệ để đi qua requireAuth (mint session trực tiếp, không qua /auth/login).
async function createSessionCookie(): Promise<string> {
  const user = await db
    .insertInto("app_user")
    .values({
      username: `tester_${randomUUID().slice(0, 8)}`,
      password_hash: "not-used-in-this-test",
      role: "admin",
    })
    .returning("id")
    .executeTakeFirstOrThrow();

  const sid = randomUUID();
  await db
    .insertInto("session")
    .values({ id: sid, user_id: user.id, expires_at: new Date(Date.now() + 60 * 60 * 1000) })
    .execute();
  return sid;
}

before(async () => {
  await runMigrations();
});

after(async () => {
  await db.destroy();
});

beforeEach(async () => {
  await resetDb();
});

describe("violations repository + service (Postgres thật)", () => {
  it("upsertVehicleByPlate: tìm-hoặc-tạo theo biển số, cập nhật loại xe khi trùng", async () => {
    const id1 = await upsertVehicleByPlate({ plate: "51F-123.45", vehicle_type: "car" });
    const id2 = await upsertVehicleByPlate({ plate: "51F-123.45", vehicle_type: "truck" });
    assert.equal(id2, id1, "cùng biển số phải trả về cùng vehicle id");

    const row = await db
      .selectFrom("vehicle")
      .select(["vehicle_type"])
      .where("plate", "=", "51F-123.45")
      .executeTakeFirstOrThrow();
    assert.equal(row.vehicle_type, "truck", "loại xe phải được cập nhật khi trùng biển số");

    const all = await db.selectFrom("vehicle").select("id").execute();
    assert.equal(all.length, 1, "không được tạo xe trùng biển số");
  });

  it("createViolation: status mặc định 'chua_xu_ly' và location = null khi bỏ trống", async () => {
    await createViolation({
      plate: "29A-000.11",
      vehicle_type: "car",
      content: "Vượt đèn đỏ",
      occurred_at: new Date("2026-09-10T08:00:00Z"),
    });

    const v = await db
      .selectFrom("violation")
      .select(["content", "location", "status"])
      .executeTakeFirstOrThrow();
    assert.equal(v.status, "chua_xu_ly");
    assert.equal(v.location, null);
    assert.equal(v.content, "Vượt đèn đỏ");
  });

  it("getViolations: join xe, giữ status truyền vào, sắp theo occurred_at giảm dần", async () => {
    await createViolation({
      plate: "30E-999.99",
      vehicle_type: "bus",
      content: "Vi phạm cũ hơn",
      location: "Ngã tư A",
      occurred_at: new Date("2026-09-01T00:00:00Z"),
      status: "da_xu_ly",
    });
    await createViolation({
      plate: "30E-999.99",
      vehicle_type: "bus",
      content: "Vi phạm mới hơn",
      occurred_at: new Date("2026-09-15T00:00:00Z"),
    });

    const list = await getViolations();
    assert.equal(list.length, 2);
    assert.equal(list[0].content, "Vi phạm mới hơn", "phải sắp giảm dần theo occurred_at");
    assert.equal(list[0].plate, "30E-999.99");
    assert.equal(list[0].vehicle_type, "bus");
    assert.equal(list[1].status, "da_xu_ly");
  });
});

describe("POST/GET /violations qua HTTP (sau requireAuth)", () => {
  let app: FastifyInstance;

  before(async () => {
    app = Fastify();
    await app.register(cookie);
    await app.register(violationRoutes);
    await app.ready();
  });

  after(async () => {
    await app.close();
  });

  it("từ chối 401 khi chưa đăng nhập", async () => {
    const res = await app.inject({ method: "GET", url: "/violations" });
    assert.equal(res.statusCode, 401);
  });

  it("400 khi payload sai schema", async () => {
    const sid = await createSessionCookie();
    const res = await app.inject({
      method: "POST",
      url: "/violations",
      cookies: { sid },
      payload: { plate: "", vehicle_type: "", content: "" },
    });
    assert.equal(res.statusCode, 400);
    assert.deepEqual(res.json(), { error: "invalid input" });
  });

  it("POST hợp lệ tạo vi phạm (201) rồi GET trả về đúng bản ghi", async () => {
    const sid = await createSessionCookie();

    const created = await app.inject({
      method: "POST",
      url: "/violations",
      cookies: { sid },
      payload: {
        plate: "36B-222.33",
        vehicle_type: "car",
        content: "Dừng đỗ sai quy định",
        location: "Đường X",
        occurred_at: "2026-09-16T10:00:00Z",
      },
    });
    assert.equal(created.statusCode, 201);
    assert.deepEqual(created.json(), { ok: true });

    const listed = await app.inject({ method: "GET", url: "/violations", cookies: { sid } });
    assert.equal(listed.statusCode, 200);
    const body = listed.json() as {
      violations: Array<{ plate: string; content: string; status: string }>;
    };
    assert.equal(body.violations.length, 1);
    assert.equal(body.violations[0].plate, "36B-222.33");
    assert.equal(body.violations[0].content, "Dừng đỗ sai quy định");
    assert.equal(body.violations[0].status, "chua_xu_ly");
  });
});
