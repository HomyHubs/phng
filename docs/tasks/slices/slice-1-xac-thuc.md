# Slice/Task slice-1 — Xác thực & phiên đăng nhập

- Cơ chế: Dọc
- Owner hiện tại: —
- Nhánh: —
- PR: —
- Trạng thái: xem `../MVP-BACKLOG.md`
- Phụ thuộc: slice-0
- Sửa mục gốc: —

## Mục tiêu bấm được / nghiệm thu được

Người dùng đăng nhập bằng tài khoản (có role admin/user), giữ được phiên, và các trang được bảo vệ yêu cầu đăng nhập. Đăng xuất huỷ phiên.

## Task

| # | Task | Tầng | Ghi chú |
| --- | --- | --- | --- |
| 1 | BE: bảng `user` (email, password hash, role admin/user), endpoint login/logout, session opaque | — | Không stub xác thực |
| 2 | FE: trang login, lưu session, điều hướng sau đăng nhập | — | Giao diện tối thiểu |
| 3 | Middleware/guard: route protected yêu cầu phiên hợp lệ (cả BE lẫn FE) | — | — |

## Stub cho phép

Giao diện tối thiểu, chưa cần style. Chưa cần đăng ký/quên mật khẩu (seed sẵn tài khoản admin).

## Không được stub

Xác thực và phiên phải thật (hash mật khẩu, session lưu server/DB), không hardcode qua mặt.

## Nợ kỹ thuật

| Marker | Vị trí | Nội dung | Dự kiến trả |
| --- | --- | --- | --- |

## Nhật ký thay đổi phạm vi của riêng Slice/Task này

| Ngày | Loại | Nội dung | Lý do | ADR |
| --- | --- | --- | --- | --- |

## Cách nghiệm thu

Đăng nhập bằng tài khoản seed → vào được trang protected; mở trang protected khi chưa đăng nhập → bị chặn về login; đăng xuất → phiên bị huỷ.

## Bàn giao phiên gần nhất

Điền theo mẫu `../../ai-workflow/templates/session-handoff.md` khi dừng giữa chừng.
