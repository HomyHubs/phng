# Slice/Task slice-7 — Phân quyền admin/user

- Cơ chế: Dọc
- Owner hiện tại: —
- Nhánh: —
- PR: —
- Trạng thái: xem `../MVP-BACKLOG.md`
- Phụ thuộc: slice-1, slice-6
- Sửa mục gốc: —

## Mục tiêu bấm được / nghiệm thu được

Phân quyền theo vai trò: admin toàn quyền (xem + export), user chỉ xem. Chặn ở cả API (BE) lẫn giao diện (FE).

## Task

| # | Task | Tầng | Ghi chú |
| --- | --- | --- | --- |
| 1 | BE: middleware phân quyền, chặn endpoint export/ghi cho role user | — | Không stub phân quyền |
| 2 | FE: ẩn/khoá nút export với user, guard route theo role | — | — |

## Stub cho phép

Chưa cần trang quản lý user chi tiết (thêm/xoá user) — để slice sau nếu cần.

## Không được stub

Phân quyền phải thật, kiểm tra ở BE (không chỉ ẩn nút ở FE).

## Nợ kỹ thuật

| Marker | Vị trí | Nội dung | Dự kiến trả |
| --- | --- | --- | --- |

## Nhật ký thay đổi phạm vi của riêng Slice/Task này

| Ngày | Loại | Nội dung | Lý do | ADR |
| --- | --- | --- | --- | --- |

## Cách nghiệm thu

Đăng nhập admin → export được; đăng nhập user → không thấy/không gọi được export (BE trả 403); cả hai đều xem được dashboard.

## Bàn giao phiên gần nhất

Điền theo mẫu `../../ai-workflow/templates/session-handoff.md` khi dừng giữa chừng.
