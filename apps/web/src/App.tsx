import { useQuery } from "@tanstack/react-query";

interface Health {
  status: string;
  db: "up" | "down";
}

async function fetchHealth(): Promise<Health> {
  const res = await fetch("/health");
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

// Slice-0 walking skeleton: FE gọi BE thật, BE trả trạng thái DB thật.
// Giao diện tối thiểu, chưa cần style (theo "Stub cho phép" của slice-0).
export function App() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["health"],
    queryFn: fetchHealth,
  });

  return (
    <main>
      <h1>phng — Health Check</h1>
      {isLoading && <p>Đang kiểm tra kết nối…</p>}
      {isError && <p>Lỗi gọi backend: {(error as Error).message}</p>}
      {data && (
        <ul>
          <li>Backend: ok</li>
          <li>Database: {data.db === "up" ? "đã kết nối (up)" : "mất kết nối (down)"}</li>
          <li>Trạng thái tổng: {data.status}</li>
        </ul>
      )}
    </main>
  );
}
