import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {
  apiCreateViolation,
  apiListViolations,
  type CreateViolationInput,
} from "./api.ts";

const EMPTY: CreateViolationInput = {
  plate: "",
  vehicle_type: "",
  content: "",
  location: "",
  occurred_at: "",
};

// slice-2: màn hình thô — bảng danh sách vi phạm + form nhập tay tối thiểu để verify DB thật.
export function ViolationsPage() {
  const qc = useQueryClient();
  const { data: violations, isLoading, error } = useQuery({
    queryKey: ["violations"],
    queryFn: apiListViolations,
  });
  const [form, setForm] = useState<CreateViolationInput>(EMPTY);

  const create = useMutation({
    mutationFn: apiCreateViolation,
    onSuccess: () => {
      setForm(EMPTY);
      qc.invalidateQueries({ queryKey: ["violations"] });
    },
  });

  function set<K extends keyof CreateViolationInput>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  return (
    <main>
      <h1>Vi phạm</h1>
      <p>
        <Link to="/">← Trang chủ</Link>
      </p>

      <h2>Nhập vi phạm</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          create.mutate({ ...form, location: form.location || undefined });
        }}
      >
        <div>
          <input
            placeholder="Biển số"
            value={form.plate}
            onChange={(e) => set("plate", e.target.value)}
          />
        </div>
        <div>
          <input
            placeholder="Loại xe"
            value={form.vehicle_type}
            onChange={(e) => set("vehicle_type", e.target.value)}
          />
        </div>
        <div>
          <input
            placeholder="Nội dung vi phạm"
            value={form.content}
            onChange={(e) => set("content", e.target.value)}
          />
        </div>
        <div>
          <input
            placeholder="Địa điểm"
            value={form.location ?? ""}
            onChange={(e) => set("location", e.target.value)}
          />
        </div>
        <div>
          <input
            type="datetime-local"
            value={form.occurred_at}
            onChange={(e) => set("occurred_at", e.target.value)}
          />
        </div>
        {create.error && <p>Lỗi: {(create.error as Error).message}</p>}
        <button type="submit" disabled={create.isPending}>
          {create.isPending ? "Đang lưu…" : "Thêm vi phạm"}
        </button>
      </form>

      <h2>Danh sách vi phạm</h2>
      {isLoading && <p>Đang tải…</p>}
      {error && <p>Lỗi tải: {(error as Error).message}</p>}
      {violations && violations.length === 0 && <p>Chưa có vi phạm nào.</p>}
      {violations && violations.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Biển số</th>
              <th>Loại xe</th>
              <th>Nội dung</th>
              <th>Địa điểm</th>
              <th>Thời gian</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {violations.map((v) => (
              <tr key={v.id}>
                <td>{v.plate}</td>
                <td>{v.vehicle_type}</td>
                <td>{v.content}</td>
                <td>{v.location ?? ""}</td>
                <td>{new Date(v.occurred_at).toLocaleString("vi-VN")}</td>
                <td>{v.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
