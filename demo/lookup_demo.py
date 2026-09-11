#!/usr/bin/env python3
"""
Demo script: goi API tra cuu phat nguoi case-by-case cua Truong An (dangkiemxe.com).

Cach dung:
    export DANGKIEMXE_API_KEY="<api key THAT do Truong An cap cho tai khoan cua ban>"
    export DANGKIEMXE_CLIENT_ID="<client id THAT>"
    python3 lookup_demo.py --phone 0999999999 --plate 52T7777 --vehicle-type 1

Ghi chu quan trong:
- Cac gia tri apiKey/ClientId trong curl demo Truong An gui (...-XXX, DANGKIEMXEXXXXX)
  la gia tri da che/redacted, KHONG dung de goi thuc te duoc. Ban can xin key thuc
  cho tai khoan cua minh.
- KHONG commit apiKey/ClientId thuc vao git. Luu trong bien moi truong hoac file
  .env duoc them vao .gitignore.
- Script nay goi ra Internet thuc su toi tracuu.dangkiemxe.com. Neu chay trong
  sandbox/agent bi khoa network, script se bao loi ket noi - hay chay tren may
  co Internet (may ca nhan, server, hoac sandbox da duoc cap quyen network).
"""
import argparse
import json
import os
import sys
import urllib.request
import urllib.error

API_URL = "https://tracuu.dangkiemxe.com/PartnerAPI/CustomerCriminalRecord/user/userCheckViolation"


def lookup(phone: str, plate: str, vehicle_type: int, api_key: str, client_id: str) -> dict:
    payload = json.dumps({
        "phoneNumber": phone,
        "licensePlates": plate,
        "vehicleType": vehicle_type,
    }).encode("utf-8")

    req = urllib.request.Request(
        API_URL,
        data=payload,
        method="POST",
        headers={
            "apiKey": api_key,
            "ClientId": client_id,
            "Content-Type": "application/json",
        },
    )
    with urllib.request.urlopen(req, timeout=30) as resp:
        body = resp.read().decode("utf-8")
        return json.loads(body)


def main():
    parser = argparse.ArgumentParser(description="Tra cuu phat nguoi case-by-case (dangkiemxe.com)")
    parser.add_argument("--phone", required=True, help="So dien thoai (phoneNumber)")
    parser.add_argument("--plate", required=True, help="Bien so xe (licensePlates)")
    parser.add_argument("--vehicle-type", type=int, default=1, help="Loai xe (vehicleType), mac dinh 1")
    args = parser.parse_args()

    api_key = os.environ.get("DANGKIEMXE_API_KEY")
    client_id = os.environ.get("DANGKIEMXE_CLIENT_ID")
    if not api_key or not client_id:
        print("Thieu DANGKIEMXE_API_KEY / DANGKIEMXE_CLIENT_ID trong environment. Xem huong dan trong docstring.", file=sys.stderr)
        sys.exit(1)

    try:
        result = lookup(args.phone, args.plate, args.vehicle_type, api_key, client_id)
        print(json.dumps(result, ensure_ascii=False, indent=2))
    except urllib.error.HTTPError as e:
        print(f"HTTP {e.code}: {e.read().decode('utf-8', errors='replace')}", file=sys.stderr)
        sys.exit(1)
    except urllib.error.URLError as e:
        print(f"Loi ket noi: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
