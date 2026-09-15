# Slice/Task slice-5 — Tra cứu phạt nguội theo biển số

- Cơ chế: Dọc
- Owner hiện tại: —
- Nhánh: —
- PR: —
- Trạng thái: xem `../MVP-BACKLOG.md`
- Phụ thuộc: slice-2
- Sửa mục gốc: —

## Mục tiêu bấm được / nghiệm thu được

User gửi yêu cầu tra cứu lỗi vi phạm theo một biển số, hoặc theo danh sách biển số (upload). Hệ thống gọi API đối tác thật (`userCheckViolation` của dangkiemxe.com), lưu kết quả và hiển thị.

API tham khảo:
`POST https://tracuu.dangkiemxe.com/PartnerAPI/CustomerCriminalRecord/user/userCheckViolation`
Body: `{ "phoneNumber", "licensePlates", "vehicleType" }`, header `apiKey`.

## Task

| # | Task | Tầng | Ghi chú |
| --- | --- | --- | --- |
| 1 | BE: client gọi API đối tác thật (apiKey qua env/secret), lưu kết quả vào DB | — | Không hardcode apiKey |
| 2 | FE: form nhập 1 biển số → gọi BE → hiển thị kết quả | — | — |
| 3 | FE+BE: upload file danh sách biển số → tra cứu hàng loạt → hiển thị | — | Validate file input |

## Stub cho phép

Xử lý hàng loạt có thể tuần tự (chưa cần song song/queue), đánh dấu `TODO(slice-5)`.

## Không được stub

Gọi API đối tác phải thật (không mock). apiKey nạp từ secret/env, không commit.

## Nợ kỹ thuật

| Marker | Vị trí | Nội dung | Dự kiến trả |
| --- | --- | --- | --- |

## Nhật ký thay đổi phạm vi của riêng Slice/Task này

| Ngày | Loại | Nội dung | Lý do | ADR |
| --- | --- | --- | --- | --- |

## Cách nghiệm thu

Nhập 1 biển số thật → thấy kết quả vi phạm trả về từ API đối tác; upload file nhiều biển số → thấy kết quả từng biển số.

## Bàn giao phiên gần nhất

Điền theo mẫu `../../ai-workflow/templates/session-handoff.md` khi dừng giữa chừng.
