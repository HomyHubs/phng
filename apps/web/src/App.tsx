import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { useCurrentUser, useLogout } from "./features/auth/useAuth.tsx";

interface Health {
  status: string;
  db: "up" | "down";
}

async function fetchHealth(): Promise<Health> {
  const res = await fetch("/health");
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

// slice-1: trang chủ protected. Hiển thị user đăng nhập + health (từ slice-0).
export function App() {
  const { data: user } = useCurrentUser();
  const logout = useLogout();
  const { data: health } = useQuery({ queryKey: ["health"], queryFn: fetchHealth });

  return (
    <main>
      <h1>phng — Trang chủ</h1>
      <p>
        Xin chào <b>{user?.username}</b> (vai trò: {user?.role})
        {" "}
        <button onClick={() => logout()}>Đăng xuất</button>
      </p>
      <p>
        <Link to="/violations">Danh sách vi phạm</Link>
      </p>
      {health && (
        <ul>
          <li>Backend: ok</li>
          <li>Database: {health.db === "up" ? "đã kết nối (up)" : "mất kết nối (down)"}</li>
        </ul>
      )}
    </main>
  );
}
