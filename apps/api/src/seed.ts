import argon2 from "argon2";
import { db, runMigrations } from "./db.ts";

// slice-1: seed tài khoản admin + user để đăng nhập thử.
// slice-2: seed thêm 1 xe + 1 vi phạm mẫu để verify mô hình dữ liệu.
// Chạy: pnpm --filter @phng/api seed
async function main() {
  await runMigrations();

  const accounts: Array<{ username: string; password: string; role: "admin" | "user" }> = [
    { username: "admin", password: "admin123", role: "admin" },
    { username: "user", password: "user123", role: "user" },
  ];

  for (const acc of accounts) {
    const hash = await argon2.hash(acc.password);
    await db
      .insertInto("app_user")
      .values({ username: acc.username, password_hash: hash, role: acc.role })
      .onConflict((oc) => oc.column("username").doUpdateSet({ password_hash: hash, role: acc.role }))
      .execute();
    console.log(`seeded ${acc.role}: ${acc.username}`);
  }

  const vehicle = await db
    .insertInto("vehicle")
    .values({
      plate: "51F-123.45",
      vehicle_type: "o to con",
      inspection_expiry: new Date("2026-12-31"),
      badge: null,
      civil_insurance_expiry: new Date("2026-06-30"),
    })
    .onConflict((oc) => oc.column("plate").doUpdateSet({ vehicle_type: "o to con" }))
    .returning("id")
    .executeTakeFirstOrThrow();

  const existing = await db
    .selectFrom("violation")
    .select("id")
    .where("vehicle_id", "=", vehicle.id)
    .executeTakeFirst();
  if (!existing) {
    await db
      .insertInto("violation")
      .values({
        vehicle_id: vehicle.id,
        content: "Vuot den do tai nga tu",
        location: "Nga tu Hang Xanh, TP.HCM",
        occurred_at: new Date("2026-09-10T08:30:00+07:00"),
      })
      .execute();
    console.log("seeded 1 vehicle + 1 violation");
  } else {
    console.log("violation seed skipped (already present)");
  }

  await db.destroy();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
