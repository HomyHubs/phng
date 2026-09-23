# ADR-0001: Tích hợp API đối tác tra cứu phạt nguội (dangkiemxe.com)

- Trạng thái: Accepted
- Ngày: 2026-09-23
- Slice liên quan: slice-3 — Tra cứu phạt nguội qua API đối tác
- Vì sao cần ADR: thêm một phụ thuộc dịch vụ bên ngoài và xử lý secret là quyết định cross-cutting (AGENTS.md §18) và chạm câu 2 của checklist ảnh hưởng (§22.3 — có thêm contract/API).

## Bối cảnh

Đối tác (Trường An — dangkiemxe.com, luồng thuộc bộ tài liệu MoMo) cung cấp API tra cứu
phạt nguội theo từng phương tiện (`userCheckViolation`). Trước mắt team dùng endpoint
**demo**; khi ký chính thức chỉ đổi endpoint + khoá, không đổi code. slice-3 chỉ làm
phần **tra cứu đọc** (nhập biển số → gọi đối tác → hiện kết quả), chưa đăng ký dịch vụ,
chưa nhận webhook định kỳ, chưa ghi vào DB.

Demo (curl đối tác gửi, đã có sẵn ở `demo/lookup_demo.py`):

```
POST https://tracuu.dangkiemxe.com/PartnerAPI/CustomerCriminalRecord/user/userCheckViolation
Headers: apiKey, ClientId, Content-Type: application/json
Body: { phoneNumber, licensePlates, vehicleType }
```

## Quyết định

1. Gọi API đối tác **từ backend** (Fastify), không gọi trực tiếp từ trình duyệt — để
   không lộ `apiKey`/`ClientId` ra client và tránh CORS.
2. `apiKey`, `ClientId`, endpoint đọc từ **biến môi trường**, KHÔNG hardcode, KHÔNG commit
   (AGENTS.md §14). Chỉ một module đọc khoá: `apps/api/src/features/lookup/partnerClient.ts`.
   - `DANGKIEMXE_API_KEY` (bắt buộc) → header `apiKey`
   - `DANGKIEMXE_CLIENT_ID` (tuỳ chọn) → header `ClientId`
   - `DANGKIEMXE_API_URL` (tuỳ chọn) → endpoint; mặc định = URL demo ở trên
3. Đổi demo → chính thức = đổi giá trị 3 biến trên trong `.env` (local) hoặc secret
   manager (deploy). Không sửa code.
4. Endpoint nội bộ `POST /lookup/violations` đặt **sau `requireAuth`** (không thêm quyền mới).
5. slice-3 **read-only**: không migration, không ghi DB. Kết quả đối tác trả về được
   truyền thẳng (passthrough) cho FE hiển thị vì schema phản hồi do đối tác định nghĩa và
   chưa chốt.
6. Lỗi phân tầng: 400 (input sai), 502 (đối tác lỗi/không gọi được), 500 (thiếu cấu hình).
7. Timeout gọi đối tác: 30s (AbortSignal.timeout).

## Hệ quả

- Tích cực: khoá không lọt ra client; đổi môi trường không cần build lại code; test được
  phần dựng request/xử lý lỗi mà không chạm mạng (inject `fetch`).
- Đánh đổi: kết quả passthrough chưa chuẩn hoá — khi có schema chính thức sẽ chuẩn hoá và
  (nếu cần) map vào bảng `violation` ở một slice sau (nợ kỹ thuật ghi trong file slice).
- Nợ kéo theo: chưa có retry/rate-limit/cache; chưa lưu lịch sử tra cứu.

## Phương án đã cân nhắc

- Gọi đối tác trực tiếp từ FE: loại — lộ khoá, dính CORS.
- Cắm cứng endpoint/khoá trong code: loại — vi phạm §14, không đổi được môi trường.
- Gộp cả đăng ký dịch vụ + webhook nhận định kỳ vào slice-3: hoãn — vượt 2–4 task của
  một lát cắt dọc và cần schema đăng ký + payload webhook (chưa có trong repo). Tách thành
  slice sau (slice-3b/3c).
