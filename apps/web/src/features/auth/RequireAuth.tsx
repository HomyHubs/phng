import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useCurrentUser } from "./useAuth.tsx";

// slice-1: guard route — chưa đăng nhập thì đẩy về /login.
export function RequireAuth({ children }: { children: ReactNode }) {
  const { data, isLoading } = useCurrentUser();
  if (isLoading) return <p>Đang tải…</p>;
  if (!data) return <Navigate to="/login" replace />;
  return <>{children}</>;
}
