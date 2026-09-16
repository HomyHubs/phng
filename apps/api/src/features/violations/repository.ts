import { db } from "../../db.ts";

// slice-2: truy vấn xe + vi phạm. Chỉ tầng dữ liệu, không biết HTTP.

// Tìm-hoặc-tạo xe theo biển số; nếu đã có thì cập nhật loại xe. Trả về id xe.
export async function upsertVehicleByPlate(input: {
  plate: string;
  vehicle_type: string;
}): Promise<number> {
  const row = await db
    .insertInto("vehicle")
    .values({
      plate: input.plate,
      vehicle_type: input.vehicle_type,
      inspection_expiry: null,
      badge: null,
      civil_insurance_expiry: null,
    })
    .onConflict((oc) =>
      oc.column("plate").doUpdateSet({ vehicle_type: input.vehicle_type }),
    )
    .returning("id")
    .executeTakeFirstOrThrow();
  return row.id;
}

export async function insertViolation(input: {
  vehicle_id: number;
  content: string;
  location: string | null;
  occurred_at: Date;
  status?: "chua_xu_ly" | "da_xu_ly";
}): Promise<void> {
  await db
    .insertInto("violation")
    .values({
      vehicle_id: input.vehicle_id,
      content: input.content,
      location: input.location,
      occurred_at: input.occurred_at,
      status: input.status,
    })
    .execute();
}

export async function listViolations() {
  return db
    .selectFrom("violation")
    .innerJoin("vehicle", "vehicle.id", "violation.vehicle_id")
    .select([
      "violation.id as id",
      "vehicle.plate as plate",
      "vehicle.vehicle_type as vehicle_type",
      "violation.content as content",
      "violation.location as location",
      "violation.occurred_at as occurred_at",
      "violation.status as status",
    ])
    .orderBy("violation.occurred_at", "desc")
    .execute();
}
