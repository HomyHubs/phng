# AGENTS.md — feature violations (api)

Nhật ký này thuộc riêng feature violations. Cập nhật liên tục.

## Bối cảnh feature

- Nhiệm vụ: mô hình dữ liệu vi phạm (xe + vi phạm) và ingest thủ công; đọc/ghi DB thật.
- Slice/Task đang triển khai: slice-2, xem `docs/tasks/slices/slice-2-mo-hinh-vi-pham.md`
- Phụ thuộc module: `../../db.ts` (Kysely; bảng `vehicle`, `violation`), `../auth` (guard `requireAuth` qua cửa công khai). Đối tác FE gọi qua `/violations`.
- Owner hiện tại: An Vo
- Nhánh: feature/slice-2-vi-pham

## Contract (cửa công khai — chốt trước, không đổi giữa chừng)

`index.ts` export:
- `violationRoutes(app)` — đăng ký `GET /violations` (liệt kê) và `POST /violations` (tạo); cả hai sau `requireAuth`.

## Mô hình dữ liệu

- `vehicle`: `plate` (biển số, unique), `vehicle_type`, `inspection_expiry` (hạn đăng kiểm), `badge` (phù hiệu), `civil_insurance_expiry` (hạn bảo hiểm dân sự) — thuộc tính đổi chậm của xe.
- `violation`: `vehicle_id` (FK → vehicle, ON DELETE CASCADE), `content` (nội dung), `location` (địa điểm), `occurred_at` (thời gian vi phạm), `status` (`chua_xu_ly`/`da_xu_ly`, mặc định `chua_xu_ly`). 1 xe → nhiều vi phạm.
- Chuẩn hoá: trạng thái đăng ký (đăng kiểm/phù hiệu/bảo hiểm) đặt ở `vehicle`, không lặp qua từng vi phạm.

## Nhật ký liên tục

### 2026-09-16

**Đã xong**
- Migration `db/migrations/002_violations.sql`: bảng `vehicle`, `violation` (idempotent, đảo ngược được).
- `db.ts`: thêm kiểu `VehicleTable`/`ViolationTable` vào `Database`; tổng quát hoá `runMigrations` chạy mọi file `.sql` trong `db/migrations` theo thứ tự tên.
- BE feature `violations`: `schema`/`repository`/`service`/`routes`/`index` (tạo + liệt kê, guard `requireAuth`); đăng ký `violationRoutes` ở `main.ts`.
- Seed `src/seed.ts`: 1 xe + 1 vi phạm mẫu (idempotent).
- FE: `ViolationsPage` (form nhập tối thiểu + bảng danh sách); route `/violations` sau `RequireAuth`; link từ trang chủ; proxy Vite `/violations`.
- Typecheck api + web: pass.

**Đang làm dở**
- —

**Bước tiếp theo**
- Verify runtime cần Postgres (docker compose + seed + `pnpm dev`) — người chạy; commit lên nhánh; mở PR vào dev.

## Bàn giao phiên
