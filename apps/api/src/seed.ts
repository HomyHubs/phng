import argon2 from "argon2";
import { db, runMigrations } from "./db.ts";

// slice-1: seed tài khoản admin + user để đăng nhập thử.
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

  await db.destroy();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
