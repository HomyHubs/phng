# MVP Backlog

Bảng chỉ mục cấp cao cho toàn bộ Slice / Task / layer-pass. Đây là bảng TÓM TẮT — chi tiết từng dòng nằm ở file riêng trong `docs/tasks/slices/`. Không viết mô tả dài trong bảng này để tránh xung đột khi nhiều dev cùng sửa.

## Quy tắc

- ID bất biến: chỉ thêm dòng mới, không xóa, không đánh số lại (xem `../../AGENTS.md`, mục "Quy trình thay đổi phạm vi").
- Mỗi dòng có đúng 1 Owner khi chuyển sang "Đang làm" — không nhận việc đã có Owner.
- Cột "Phụ thuộc" liệt kê ID phải Done trước khi bắt đầu — dùng để biết việc nào chạy song song được.
- Cập nhật cột Trạng thái ngay khi đổi, không chờ cuối ngày.
- Khi Slice/Task merge xong vào `dev`: chuyển Trạng thái = Done, xóa Owner, điền số PR, rồi cập nhật rollup ở `../../AGENTS.md`.

## Bảng chỉ mục

| ID | Tên | Cơ chế | Trạng thái | Owner | Nhánh | PR | Phụ thuộc | File chi tiết |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| slice-0 | Walking skeleton | Dọc | Done | — | dev | — | — | `slices/slice-0-walking-skeleton.md` |
| slice-1 | Xác thực & phiên đăng nhập | Dọc | Done | — | feature/slice-1-auth | — | slice-0 | `slices/slice-1-xac-thuc.md` |
| slice-2 | Mô hình dữ liệu vi phạm + ingest thủ công | Dọc | Chưa bắt đầu | — | — | — | slice-1 | `slices/slice-2-mo-hinh-vi-pham.md` |
| slice-3 | Webhook nhận dữ liệu đối tác + bóc tách | Dọc | Chưa bắt đầu | — | — | — | slice-2 | `slices/slice-3-webhook-ingest.md` |
| slice-4 | Dashboard hiển thị | Dọc | Chưa bắt đầu | — | — | — | slice-2 | `slices/slice-4-dashboard.md` |
| slice-5 | Tra cứu phạt nguội theo biển số | Dọc | Chưa bắt đầu | — | — | — | slice-2 | `slices/slice-5-tra-cuu-bien-so.md` |
| slice-6 | Export Excel | Dọc | Chưa bắt đầu | — | — | — | slice-4, slice-5 | `slices/slice-6-export-excel.md` |
| slice-7 | Phân quyền admin/user | Dọc | Chưa bắt đầu | — | — | — | slice-1, slice-6 | `slices/slice-7-phan-quyen.md` |
| slice-8 | Đăng ký dịch vụ thông báo tự động | Dọc | Chưa bắt đầu | — | — | — | slice-2 | `slices/slice-8-dang-ky-dich-vu-thong-bao.md` |

## Trạng thái hợp lệ

Chưa bắt đầu, Đang làm, Review, Done, Done (còn nợ), Hoãn, Đã hủy, Đã thay thế. Định nghĩa đầy đủ: xem `../../AGENTS.md`, mục "Quy trình thay đổi phạm vi".

## Cách thêm một Slice/Task mới

1. Tạo file từ `slices/_TEMPLATE.md`, đặt tên `slices/<id>-<slug>.md`.
2. Thêm đúng một dòng vào bảng trên, trạng thái "Chưa bắt đầu".
3. Nếu đây là thay đổi phạm vi của một Slice/Task đã có, đọc `../../AGENTS.md` mục "Quy trình thay đổi phạm vi" trước.
