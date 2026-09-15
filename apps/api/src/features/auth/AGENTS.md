# AGENTS.md — feature auth (api)

Nhật ký này thuộc riêng feature auth. Cập nhật liên tục.

## Bối cảnh feature

- Nhiệm vụ: xác thực & phiên đăng nhập (username + password, session opaque lưu Postgres, cookie HttpOnly).
- Slice/Task đang triển khai: slice-1, xem `docs/tasks/slices/slice-1-xac-thuc.md`
- Phụ thuộc module: `../../db.ts` (Kysely). Đối tác FE gọi qua `/auth/*`.
- Owner hiện tại: —
- Nhánh: feature/slice-1-auth

## Contract (cửa công khai — chốt trước, không đổi giữa chừng)

`index.ts` export:
- `authRoutes(app)` — đăng ký `/auth/login`, `/auth/logout`, `/auth/me`
- `requireAuth(req, reply)` — preHandler guard, gắn `req.user`
- type `CurrentUser = { id, username, role }`

## Nhật ký liên tục

### 2026-09-15

**Đã xong**
- Migration `db/migrations/001_auth.sql`: bảng `app_user`, `session`.
- BE: repository/service/routes cho login/logout/me; hash argon2; session lưu DB; cookie HttpOnly.
- Seed `src/seed.ts`: tài khoản admin/user.
- FE: LoginPage, RequireAuth guard, useAuth hook, router.

**Đang làm dở**
- —

**Bước tiếp theo**
- Chạy cổng gác, verify runtime, commit lên dev, release qua main.

## Bàn giao phiên
