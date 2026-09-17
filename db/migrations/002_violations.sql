-- slice-2: mô hình dữ liệu vi phạm (xe + vi phạm)
-- Idempotent để chạy an toàn nhiều lần lúc khởi động, như 001_auth.sql.
-- Append-only; đảo ngược được bằng: DROP TABLE violation; DROP TABLE vehicle;

CREATE TABLE IF NOT EXISTS vehicle (
  id                     BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  plate                  TEXT NOT NULL UNIQUE,
  vehicle_type           TEXT NOT NULL,
  inspection_expiry      DATE,
  badge                  TEXT,
  civil_insurance_expiry DATE,
  created_at             TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS violation (
  id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  vehicle_id  BIGINT NOT NULL REFERENCES vehicle(id) ON DELETE CASCADE,
  content     TEXT NOT NULL,
  location    TEXT,
  occurred_at TIMESTAMPTZ NOT NULL,
  status      TEXT NOT NULL DEFAULT 'chua_xu_ly' CHECK (status IN ('chua_xu_ly', 'da_xu_ly')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_violation_vehicle_id ON violation(vehicle_id);
