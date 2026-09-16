import {
  insertViolation,
  listViolations,
  upsertVehicleByPlate,
} from "./repository.ts";
import type { CreateViolationInput } from "./schema.ts";

// slice-2: domain logic vi phạm, không biết HTTP. Một biển số → tái dùng xe, thêm vi phạm.

export async function createViolation(input: CreateViolationInput): Promise<void> {
  const vehicleId = await upsertVehicleByPlate({
    plate: input.plate,
    vehicle_type: input.vehicle_type,
  });
  await insertViolation({
    vehicle_id: vehicleId,
    content: input.content,
    location: input.location ?? null,
    occurred_at: input.occurred_at,
    status: input.status,
  });
}

export async function getViolations() {
  return listViolations();
}
