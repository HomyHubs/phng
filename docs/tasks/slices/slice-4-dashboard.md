# Slice/Task slice-4 — Dashboard hiển thị

- Cơ chế: Dọc
- Owner hiện tại: —
- Nhánh: —
- PR: —
- Trạng thái: xem `../MVP-BACKLOG.md`
- Phụ thuộc: slice-2
- Sửa mục gốc: —

## Mục tiêu bấm được / nghiệm thu được

Trang dashboard hiển thị: các panel KPI (tổng số vi phạm hiện có, tổng số vi phạm đã xử lý, thời gian cập nhật gần nhất) và một bảng 4 cột (thời gian, biển số xe, lỗi vi phạm, địa điểm vi phạm). Cho phép chọn khung thời gian để lọc.

## Task

| # | Task | Tầng | Ghi chú |
| --- | --- | --- | --- |
| 1 | BE: endpoint thống kê (tổng, đã xử lý, last-updated) + list vi phạm có filter theo khoảng thời gian | — | Filter server-side |
| 2 | FE: 3 KPI panel + date-range picker | — | — |
| 3 | FE: bảng 4 cột (thời gian, biển số, lỗi, địa điểm) + phân trang | — | — |

## Stub cho phép

Chưa cần biểu đồ nâng cao; style tối thiểu.

## Không được stub

Số liệu KPI và bảng phải lấy từ DB thật, không hardcode.

## Nợ kỹ thuật

| Marker | Vị trí | Nội dung | Dự kiến trả |
| --- | --- | --- | --- |

## Nhật ký thay đổi phạm vi của riêng Slice/Task này

| Ngày | Loại | Nội dung | Lý do | ADR |
| --- | --- | --- | --- | --- |

## Cách nghiệm thu

Mở dashboard → 3 KPI đúng với dữ liệu DB; chọn khung thời gian → bảng và KPI cập nhật theo khoảng đã chọn.

## Bàn giao phiên gần nhất

Điền theo mẫu `../../ai-workflow/templates/session-handoff.md` khi dừng giữa chừng.
