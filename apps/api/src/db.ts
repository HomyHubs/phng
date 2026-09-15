import { Kysely, PostgresDialect } from "kysely";
import pg from "pg";

// Slice-0: DB thật, không stub. Chỉ cần một truy vấn ping (SELECT 1),
// nên interface DB để rỗng, đủ để Kysely hoạt động với raw sql.
export interface Database {}

const connectionString =
  process.env.DATABASE_URL ?? "postgres://phng:phng@localhost:5432/phng";

export const db = new Kysely<Database>({
  dialect: new PostgresDialect({
    pool: new pg.Pool({ connectionString }),
  }),
});
