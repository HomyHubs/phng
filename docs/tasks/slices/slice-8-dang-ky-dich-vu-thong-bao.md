# Slice/Task slice-8 — Đăng ký dịch vụ thông báo phạt nguội tự động

- Cơ chế: Dọc
- Owner hiện tại: —
- Nhánh: —
- PR: —
- Trạng thái: xem `../MVP-BACKLOG.md`
- Phụ thuộc: slice-2
- Sửa mục gốc: —

## Mục tiêu bấm được / nghiệm thu được

Đăng ký dịch vụ tự động thông báo phạt nguội với đối tác (MoMo/dangkiemxe.com) cho một biển số/khách hàng, để sau đó đối tác đẩy dữ liệu định kỳ về webhook (slice-3).

API tham khảo (đối tác): quy trình mua gói dịch vụ thông báo + API "đăng ký dịch vụ thông báo phạt nguội tự động".

## Task

| # | Task | Tầng | Ghi chú |
| --- | --- | --- | --- |
| 1 | BE: client gọi API đăng ký dịch vụ thông báo thật, lưu trạng thái đăng ký vào DB | — | apiKey/secret qua env |
| 2 | FE: màn hình đăng ký + theo dõi trạng thái dịch vụ của biển số | — | — |

## Stub cho phép

Chưa cần quản lý gia hạn/huỷ gói (chỉ đăng ký + xem trạng thái), đánh dấu `TODO(slice-8)`.

## Không được stub

Gọi API đăng ký phải thật; lưu trạng thái vào DB thật.

## Nợ kỹ thuật

| Marker | Vị trí | Nội dung | Dự kiến trả |
| --- | --- | --- | --- |

## Nhật ký thay đổi phạm vi của riêng Slice/Task này

| Ngày | Loại | Nội dung | Lý do | ADR |
| --- | --- | --- | --- | --- |

## Cách nghiệm thu

Đăng ký dịch vụ cho một biển số → API đối tác trả thành công → trạng thái đăng ký lưu DB và hiển thị trên FE.

## Bàn giao phiên gần nhất

Điền theo mẫu `../../ai-workflow/templates/session-handoff.md` khi dừng giữa chừng.
