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
| slice-0 | Walking skeleton | Dọc | Chưa bắt đầu | — | — | — | — | `slices/slice-0-walking-skeleton.md` |

## Trạng thái hợp lệ

Chưa bắt đầu, Đang làm, Review, Done, Done (còn nợ), Hoãn, Đã hủy, Đã thay thế. Định nghĩa đầy đủ: xem `../../AGENTS.md`, mục "Quy trình thay đổi phạm vi".

## Cách thêm một Slice/Task mới

1. Tạo file từ `slices/_TEMPLATE.md`, đặt tên `slices/<id>-<slug>.md`.
2. Thêm đúng một dòng vào bảng trên, trạng thái "Chưa bắt đầu".
3. Nếu đây là thay đổi phạm vi của một Slice/Task đã có, đọc `../../AGENTS.md` mục "Quy trình thay đổi phạm vi" trước.
