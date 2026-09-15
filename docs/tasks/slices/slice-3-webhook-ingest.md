# Slice/Task slice-3 — Webhook nhận dữ liệu đối tác + bóc tách

- Cơ chế: Dọc
- Owner hiện tại: —
- Nhánh: —
- PR: —
- Trạng thái: xem `../MVP-BACKLOG.md`
- Phụ thuộc: slice-2
- Sửa mục gốc: —

## Mục tiêu bấm được / nghiệm thu được

Đối tác đẩy payload phạt nguội định kỳ về webhook của mình; hệ thống xác thực, bóc tách payload thành các field có nghĩa (1 biển số → nhiều bản ghi: nội dung, địa điểm, thời gian, hạn đăng kiểm, phù hiệu, bảo hiểm dân sự...) và lưu DB idempotent.

Tham khảo tài liệu callback đối tác: `Callback_CustomerCriminalRecord`.

## Task

| # | Task | Tầng | Ghi chú |
| --- | --- | --- | --- |
| 1 | BE: endpoint `POST /webhooks/partner/criminal-record`, verify apiKey/secret của đối tác | — | Không stub xác thực |
| 2 | Parser: map payload đối tác → schema nội bộ (vehicle + violation), validate bằng Zod | — | 1 biển số → nhiều bản ghi |
| 3 | Lưu DB idempotent (chống trùng khi đẩy định kỳ) + log có cấu trúc | — | Dùng khoá tự nhiên để dedup |

## Stub cho phép

Chưa cần retry/queue nền (xử lý đồng bộ trong request là đủ cho MVP), đánh dấu `TODO(slice-3)` nếu tạm bỏ.

## Không được stub

Xác thực webhook và bóc tách/lưu DB phải thật. Validate mọi input bằng schema.

## Nợ kỹ thuật

| Marker | Vị trí | Nội dung | Dự kiến trả |
| --- | --- | --- | --- |

## Nhật ký thay đổi phạm vi của riêng Slice/Task này

| Ngày | Loại | Nội dung | Lý do | ADR |
| --- | --- | --- | --- | --- |

## Cách nghiệm thu

Gửi một payload mẫu đúng định dạng đối tác tới webhook → dữ liệu được bóc tách và lưu DB; gửi lại cùng payload → không tạo bản ghi trùng.

## Bàn giao phiên gần nhất

Điền theo mẫu `../../ai-workflow/templates/session-handoff.md` khi dừng giữa chừng.
