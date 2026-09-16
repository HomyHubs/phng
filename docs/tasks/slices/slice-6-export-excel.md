# Slice/Task slice-6 — Export Excel

- Cơ chế: Dọc
- Owner hiện tại: —
- Nhánh: —
- PR: —
- Trạng thái: xem `../MVP-BACKLOG.md`
- Phụ thuộc: slice-4, slice-5
- Sửa mục gốc: —

## Mục tiêu bấm được / nghiệm thu được

Người dùng export ra file Excel (.xlsx) thông tin vi phạm đã được bóc tách theo các field có nghĩa; mỗi biển số xe có nhiều cột diễn tả thông tin (nội dung, địa điểm, thời gian, hạn đăng kiểm, phù hiệu, bảo hiểm dân sự...).

## Task

| # | Task | Tầng | Ghi chú |
| --- | --- | --- | --- |
| 1 | BE: endpoint export .xlsx theo filter hiện tại, mỗi biển số nhiều cột đã bóc tách | — | Stream file, không giữ toàn bộ trong RAM nếu lớn |
| 2 | FE: nút export gắn với filter/khung thời gian đang xem | — | — |

## Stub cho phép

Chưa cần chọn cột tuỳ biến (export bộ cột mặc định), đánh dấu `TODO(slice-6)`.

## Không được stub

Dữ liệu export lấy từ DB thật, khớp với filter đang hiển thị.

## Nợ kỹ thuật

| Marker | Vị trí | Nội dung | Dự kiến trả |
| --- | --- | --- | --- |

## Nhật ký thay đổi phạm vi của riêng Slice/Task này

| Ngày | Loại | Nội dung | Lý do | ADR |
| --- | --- | --- | --- | --- |

## Cách nghiệm thu

Bấm export trên dashboard/kết quả tra cứu → tải về .xlsx mở được, mỗi biển số có đủ các cột đã bóc tách, khớp filter.

## Bàn giao phiên gần nhất

Điền theo mẫu `../../ai-workflow/templates/session-handoff.md` khi dừng giữa chừng.
