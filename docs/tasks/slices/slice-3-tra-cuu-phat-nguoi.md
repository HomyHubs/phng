# Slice/Task slice-3 — Tra cứu phạt nguội qua API đối tác

- Cơ chế: Dọc
- Owner hiện tại: AI agent
- Nhánh: feature/slice-3-tra-cuu-phat-nguoi
- PR: —
- Trạng thái: xem `../MVP-BACKLOG.md` (nguồn trạng thái duy nhất)
- Phụ thuộc: slice-1 (phiên đăng nhập để bảo vệ route), slice-2 (mô hình vi phạm — PR #3, đã merge)
- Sửa mục gốc: —

## Mục tiêu bấm được / nghiệm thu được

Sau khi đăng nhập, người dùng mở `/lookup`, nhập **số điện thoại + biển số + loại xe** rồi
bấm "Tra cứu". Backend gọi API đối tác (dangkiemxe.com, endpoint `userCheckViolation`) kèm
`apiKey`/`ClientId` lấy từ biến môi trường, rồi trả kết quả về cho web hiển thị. Đây là một
lát cắt dọc đi xuyên UI → API nội bộ → dịch vụ đối tác → UI. Read-only: KHÔNG ghi DB.

Dùng endpoint **demo** trước; khi ký chính thức chỉ đổi khoá + URL trong `.env`, không sửa code.

## Hợp đồng API (chốt trước khi code — AGENTS.md §8)

`POST /lookup/violations` — sau `requireAuth`.

Request:

```json
{ "phoneNumber": "0999999999", "licensePlates": "52T7777", "vehicleType": 1 }
```

- `phoneNumber`: chuỗi 8–15 ký tự. `licensePlates`: chuỗi 1–20 ký tự. `vehicleType`: số nguyên dương, mặc định 1.

Response 200:

```json
{ "result": <nguyên văn JSON đối tác trả về> }
```

- `result` là passthrough vì schema phản hồi do đối tác định nghĩa, chưa chốt.
- Lỗi: 400 `{ "error": "invalid input" }`; 502 `{ "error": "upstream error" }` (đối tác lỗi/không gọi được); 500 `{ "error": "lookup not configured" }` (thiếu `DANGKIEMXE_API_KEY`).
- Chưa đăng nhập → 401 (qua `requireAuth`).

Cửa công khai backend (`features/lookup/index.ts`): `lookupRoutes(app)`.

## Cấu hình (nơi DUY NHẤT đọc khoá: `features/lookup/partnerClient.ts`)

| Biến môi trường | Vai trò | Bắt buộc | Mặc định |
| --- | --- | --- | --- |
| `DANGKIEMXE_API_KEY` | header `apiKey` | Có | — (thiếu → 500) |
| `DANGKIEMXE_CLIENT_ID` | header `ClientId` | Không | (không gửi header nếu trống) |
| `DANGKIEMXE_API_URL` | endpoint đối tác | Không | URL demo `userCheckViolation` |

Sửa ở `apps/api/.env` (local) hoặc secret manager (deploy). Không commit `.env` (§14).

## Task

| # | Task | Tầng (nếu dùng Lát cắt ngang) | Ghi chú |
| --- | --- | --- | --- |
| 1 | BE `partnerClient.ts`: đọc cấu hình từ env; dựng request thuần (`buildLookupRequest`); gọi đối tác (`callPartnerLookup`) có timeout + phân loại lỗi | — | Nơi duy nhất đọc khoá; `fetch` inject được để test |
| 2 | BE `schema.ts` + `service.ts` + `routes.ts` + `index.ts`: `POST /lookup/violations` sau `requireAuth`; đăng ký ở `main.ts` | — | Mẫu như `violationRoutes` |
| 3 | FE `features/lookup/api.ts` + `LookupPage.tsx`: form nhập + gọi `/lookup/violations` (`credentials: include`) + hiện kết quả | — | React Query, style tối thiểu |
| 4 | FE điều hướng: route `/lookup` bọc `RequireAuth` ở `main.tsx`; link từ trang chủ `App.tsx`; proxy Vite `/lookup` | — | — |
| 5 | Test không chạm mạng/DB: schema, dựng request (header apiKey/ClientId + body), xử lý lỗi upstream (`lookup.test.ts`) | — | Inject `fetch` giả; test thật đổi sau khi có khoá chính thức |
| 6 | `AGENTS.md` của feature `lookup` (BE) theo `docs/templates/feature-AGENTS.template.md` | — | Cửa công khai chỉ export qua `index.ts` |

## Stub cho phép

- Kết quả đối tác hiển thị dạng JSON thô (chưa cần bảng đẹp) — `TODO(slice-3)`.
- Chưa lưu lịch sử tra cứu, chưa map kết quả vào bảng `violation` — để slice sau.
- Test gọi đối tác dùng `fetch` giả; test end-to-end với khoá thật làm khi ký chính thức.

## Không được stub

Xác thực (route sau `requireAuth`). Không hardcode `apiKey`/`ClientId`/endpoint — chỉ đọc
từ biến môi trường. Không gọi đối tác trực tiếp từ trình duyệt. Hợp đồng API chốt trước, không đổi giữa chừng.

## Nợ kỹ thuật

| Marker | Vị trí | Nội dung | Dự kiến trả |
| --- | --- | --- | --- |
| TODO(slice-3) | web/lookup | Kết quả hiển thị JSON thô, chưa chuẩn hoá bảng | slice hiển thị/chuẩn hoá sau khi có schema chính thức |
| TODO(slice-3) | be/lookup | Chưa retry/rate-limit/cache; chưa lưu lịch sử tra cứu | slice nâng cao sau |
| TODO(slice-3) | be/lookup | Response passthrough — chưa map vào bảng `violation` | slice "lưu kết quả tra cứu" |

## Nhật ký thay đổi phạm vi của riêng Slice/Task này

| Ngày | Loại | Nội dung | Lý do | ADR |
| --- | --- | --- | --- | --- |
| 2026-09-23 | Tạo mới | Lập slice-3 (tra cứu phạt nguội qua API đối tác, read-only) từ `_TEMPLATE.md`; tách đăng ký dịch vụ + webhook sang slice sau | Giữ đúng 2–4 task/1 lát cắt dọc; repo mới có sẵn spec tra cứu (demo), chưa có schema đăng ký/webhook | ADR-0001 |

## Cách nghiệm thu

- Đăng nhập → mở `/lookup`, nhập số điện thoại + biển số (dùng dữ liệu demo `0999999999` / `52T7777`, loại xe `1`) → bấm Tra cứu → thấy JSON kết quả từ đối tác (hoặc lỗi rõ ràng nếu chưa cấu hình khoá).
- Mở `/lookup` khi chưa đăng nhập → bị chặn về `/login`.
- Chưa set `DANGKIEMXE_API_KEY` → BE trả 500 `lookup not configured` (không crash).
- `pnpm run gate` PASS (lint + typecheck + test; test slice-3 không cần mạng/DB).

## Bàn giao phiên gần nhất

Điền theo mẫu `../../ai-workflow/templates/session-handoff.md` khi dừng giữa chừng.
