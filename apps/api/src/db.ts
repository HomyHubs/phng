import { readFile, readdir } from "node:fs/promises";
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

// slice-2: mô hình vi phạm. 1 xe → nhiều vi phạm.
export interface VehicleTable {
  id: Generated<number>;
  plate: string;
  vehicle_type: string;
  inspection_expiry: Date | null;
  badge: string | null;
  civil_insurance_expiry: Date | null;
  created_at: Generated<Date>;
}

export interface ViolationTable {
  id: Generated<number>;
  vehicle_id: number;
  content: string;
  location: string | null;
  occurred_at: Date;
  status: Generated<"chua_xu_ly" | "da_xu_ly">;
  created_at: Generated<Date>;
}

export interface Database {
  app_user: AppUserTable;
  session: SessionTable;
  vehicle: VehicleTable;
  violation: ViolationTable;
}

const connectionString =
  process.env.DATABASE_URL ?? "postgres://phng:phng@localhost:5432/phng";

export const db = new Kysely<Database>({
  dialect: new PostgresDialect({
    pool: new pg.Pool({ connectionString }),
  }),
});

// Chạy toàn bộ migration SQL trong db/migrations theo thứ tự tên, idempotent lúc khởi động.
// TODO(slice-later): thay bằng dbmate.
export async function runMigrations() {
  const here = dirname(fileURLToPath(import.meta.url));
  const migrationsDir = join(here, "../../../db/migrations");
  const files = (await readdir(migrationsDir))
    .filter((name) => name.endsWith(".sql"))
    .sort();
  for (const name of files) {
    const ddl = await readFile(join(migrationsDir, name), "utf8");
    await sql.raw(ddl).execute(db);
  }
}
