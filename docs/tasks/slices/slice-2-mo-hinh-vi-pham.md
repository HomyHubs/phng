# Slice/Task slice-2 — Mô hình dữ liệu vi phạm + ingest thủ công

- Cơ chế: Dọc
- Owner hiện tại: An Vo
- Nhánh: feature/slice-2-vi-pham
- PR: —
- Trạng thái: xem `../MVP-BACKLOG.md`
- Phụ thuộc: slice-1
- Sửa mục gốc: —

## Mục tiêu bấm được / nghiệm thu được

Có mô hình dữ liệu vi phạm thật trong DB (xe + vi phạm), nhập tay/seed được ít nhất một bản ghi và xem lại được qua API + một màn hình thô.

## Task

| # | Task | Tầng | Ghi chú |
| --- | --- | --- | --- |
| 1 | Migration: bảng `vehicle` (biển số, loại xe) và `violation` (nội dung, địa điểm, thời gian, trạng thái xử lý, hạn đăng kiểm, phù hiệu, bảo hiểm dân sự...) | — | 1 xe → nhiều vi phạm |
| 2 | BE: repository + service + endpoint tạo/liệt kê vi phạm | — | Qua cửa công khai index.ts |
| 3 | FE: màn hình xem danh sách vi phạm thô để verify DB thật | — | Tối thiểu |

## Stub cho phép

Màn hình xem thô chưa cần lọc/sắp xếp. Chưa cần dashboard đẹp (để slice-4).

## Không được stub

Ghi/đọc DB phải thật. Migration append-only, đảo ngược được.

## Nợ kỹ thuật

| Marker | Vị trí | Nội dung | Dự kiến trả |
| --- | --- | --- | --- |

## Nhật ký thay đổi phạm vi của riêng Slice/Task này

| Ngày | Loại | Nội dung | Lý do | ADR |
| --- | --- | --- | --- | --- |

## Cách nghiệm thu

Tạo một vi phạm qua API/seed → gọi endpoint list → thấy bản ghi; mở màn hình thô → thấy đúng dữ liệu từ DB thật.

## Bàn giao phiên gần nhất

Điền theo mẫu `../../ai-workflow/templates/session-handoff.md` khi dừng giữa chừng.
