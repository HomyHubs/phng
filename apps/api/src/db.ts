import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { Kysely, PostgresDialect, sql, type Generated } from "kysely";
import pg from "pg";

// slice-1: thêm bảng app_user + session. Interface DB khai báo để Kysely có kiểu.
// Generated<T>: cột do DB sinh/đặt mặc định → không bắt buộc khi insert.
export interface AppUserTable {
  id: Generated<number>;
  username: string;
  password_hash: string;
  role: "admin" | "user";
  created_at: Generated<Date>;
}

export interface SessionTable {
  id: string;
  user_id: number;
  created_at: Generated<Date>;
  expires_at: Date;
}

export interface Database {
  app_user: AppUserTable;
  session: SessionTable;
}

const connectionString =
  process.env.DATABASE_URL ?? "postgres://phng:phng@localhost:5432/phng";

export const db = new Kysely<Database>({
  dialect: new PostgresDialect({
    pool: new pg.Pool({ connectionString }),
  }),
});

// Chạy migration SQL lúc khởi động (idempotent). TODO(slice-later): thay bằng dbmate.
export async function runMigrations() {
  const here = dirname(fileURLToPath(import.meta.url));
  const migrationPath = join(here, "../../../db/migrations/001_auth.sql");
  const ddl = await readFile(migrationPath, "utf8");
  await sql.raw(ddl).execute(db);
}
