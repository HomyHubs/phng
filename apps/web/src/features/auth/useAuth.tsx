import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiLogout, apiMe, type CurrentUser } from "./api.ts";

// slice-1: hook lấy user hiện tại từ phiên (cookie). Dùng cho guard.
export function useCurrentUser() {
  return useQuery<CurrentUser | null>({
    queryKey: ["me"],
    queryFn: apiMe,
    retry: false,
  });
}

export function useLogout() {
  const qc = useQueryClient();
  return async () => {
    await apiLogout();
    qc.setQueryData(["me"], null);
  };
}
