import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { apiLookupViolations, type LookupInput } from "./api.ts";

const EMPTY: LookupInput = { phoneNumber: "", licensePlates: "", vehicleType: 1 };

// slice-3: màn hình thô — form nhập biển số rồi tra cứu phạt nguội qua API đối tác.
// TODO(slice-3): kết quả hiển thị JSON thô, chưa chuẩn hoá bảng.
export function LookupPage() {
  const [form, setForm] = useState<LookupInput>(EMPTY);
  const lookup = useMutation({ mutationFn: apiLookupViolations });

  return (
    <main>
      <h1>Tra cứu phạt nguội</h1>
      <p>
        <Link to="/">← Trang chủ</Link>
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          lookup.mutate(form);
        }}
      >
        <div>
          <input
            placeholder="Số điện thoại"
            value={form.phoneNumber}
            onChange={(e) => setForm((f) => ({ ...f, phoneNumber: e.target.value }))}
          />
        </div>
        <div>
          <input
            placeholder="Biển số"
            value={form.licensePlates}
            onChange={(e) => setForm((f) => ({ ...f, licensePlates: e.target.value }))}
          />
        </div>
        <div>
          <input
            type="number"
            placeholder="Loại xe"
            value={form.vehicleType}
            onChange={(e) =>
              setForm((f) => ({ ...f, vehicleType: Number(e.target.value) || 1 }))
            }
          />
        </div>
        <button type="submit" disabled={lookup.isPending}>
          {lookup.isPending ? "Đang tra cứu…" : "Tra cứu"}
        </button>
      </form>

      {lookup.error && <p>Lỗi: {(lookup.error as Error).message}</p>}
      {lookup.data !== undefined && (
        <>
          <h2>Kết quả</h2>
          <pre>{JSON.stringify(lookup.data, null, 2)}</pre>
        </>
      )}
    </main>
  );
}
