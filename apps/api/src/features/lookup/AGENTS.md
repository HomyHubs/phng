# AGENTS.md — feature lookup (api)

Nhật ký này thuộc riêng feature lookup. Cập nhật liên tục.

## Bối cảnh feature

- Nhiệm vụ: tra cứu phạt nguội qua API đối tác (dangkiemxe.com, `userCheckViolation`). Read-only, không ghi DB.
- Slice/Task đang triển khai: slice-3, xem `docs/tasks/slices/slice-3-tra-cuu-phat-nguoi.md`. Quyết định tích hợp: `docs/adr/0001-tich-hop-api-doi-tac-tra-cuu-phat-nguoi.md`.
- Phụ thuộc module: `../auth` (guard `requireAuth` qua cửa công khai). Gọi ra ngoài tới đối tác qua `partnerClient.ts`. Đối tác FE gọi qua `/lookup/violations`.
- Owner hiện tại: AI agent
- Nhánh: feature/slice-3-tra-cuu-phat-nguoi

## Contract (cửa công khai — chốt trước, không đổi giữa chừng)

`index.ts` export:
- `lookupRoutes(app)` — đăng ký `POST /lookup/violations` (sau `requireAuth`). Body `{ phoneNumber, licensePlates, vehicleType }` → 200 `{ result: <passthrough đối tác> }`; lỗi 400/502/500.

## Cấu hình (nơi DUY NHẤT đọc khoá: `partnerClient.ts`)

- `DANGKIEMXE_API_KEY` (bắt buộc) → header `apiKey`. Thiếu → 500 `lookup not configured`.
- `DANGKIEMXE_CLIENT_ID` (tuỳ chọn) → header `ClientId`.
- `DANGKIEMXE_API_URL` (tuỳ chọn) → endpoint; mặc định = URL demo `userCheckViolation`.
- Sửa ở `apps/api/.env` (local) hoặc secret manager (deploy). Không hardcode, không commit `.env` (§14).

## Nhật ký liên tục

### 2026-09-23

**Đã xong**
- `partnerClient.ts`: `loadPartnerConfig` (đọc env), `buildLookupRequest` (dựng request thuần, test được), `callPartnerLookup` (gọi có timeout 30s, phân loại lỗi `PartnerConfigError`/`PartnerUpstreamError`).
- `schema`/`service`/`routes`/`index`: `POST /lookup/violations` sau `requireAuth`; đăng ký `lookupRoutes` ở `main.ts`.
- `lookup.test.ts`: test schema + dựng request (header apiKey/ClientId + body) + xử lý lỗi upstream, inject `fetch` giả (không chạm mạng/DB).
- `.env.example`: thêm `DANGKIEMXE_API_KEY` / `DANGKIEMXE_CLIENT_ID` / `DANGKIEMXE_API_URL`.

**Đang làm dở**
- —

**Bước tiếp theo**
- Verify runtime với khoá thật (đặt env, `pnpm dev`, thử `/lookup`). Cập nhật test end-to-end khi ký chính thức. Cân nhắc slice sau: lưu kết quả tra cứu vào bảng `violation`, đăng ký dịch vụ + webhook nhận định kỳ.

## Bàn giao phiên
