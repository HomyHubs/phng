-- slice-1: xác thực & phiên đăng nhập
-- TODO(slice-later): chuyển sang dbmate khi thêm tool migration chính thức.
-- Idempotent để chạy an toàn nhiều lần lúc khởi động (walking skeleton).

CREATE TABLE IF NOT EXISTS app_user (
  id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  username      TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role          TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS session (
  id         TEXT PRIMARY KEY,
  user_id    BIGINT NOT NULL REFERENCES app_user(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_session_user_id ON session(user_id);
