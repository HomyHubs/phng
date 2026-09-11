# Demo tra cuu case-by-case (dangkiemxe.com)

Script `lookup_demo.py` goi API case-by-case ma Truong An da demo qua curl:

```
POST https://tracuu.dangkiemxe.com/PartnerAPI/CustomerCriminalRecord/user/userCheckViolation
Headers: apiKey, ClientId, Content-Type: application/json
Body: { phoneNumber, licensePlates, vehicleType }
```

## Truoc khi chay

1. Xin Truong An cap **apiKey** va **ClientId** THAT cho tai khoan cua ban (gia tri trong
   curl demo ho gui la placeholder, ket thuc bang XXX, khong dung duoc).
2. Set 2 bien moi truong (khong hardcode, khong commit vao git):

```bash
export DANGKIEMXE_API_KEY="..."
export DANGKIEMXE_CLIENT_ID="..."
```

3. Chay thu:

```bash
python3 lookup_demo.py --phone 0999999999 --plate 52T7777 --vehicle-type 1
```

Ket qua tra ve se duoc in ra man hinh dang JSON. Dung ket qua nay de xac dinh
cac field can map vao bang `Violations` (slice-4/slice-5 trong ke hoach).

## Gioi han hien tai

- Day la script CLI don gian de test nhanh, chua phai UI web. Khi slice-5
  (Tra cuu phat nguoi don le) duoc code, day se tro thanh 1 API endpoint +
  form nhap bien so tren web app thuc.
- Neu chay trong moi truong khong co Internet (vi du sandbox bi khoa
  network), script se bao loi ket noi - hay chay tren may/server co Internet.
