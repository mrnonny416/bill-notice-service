"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import BottomMenu from "@/components/BottomMenu"; // เพิ่ม import ด้านบน

type BillData = {
  name: string;
  amount: number;
  accountNumber: string;
  bankDetails: string;
  qrCodeUrl: string;
  status: string;
  paidMessage?: string;
};

export default function BillNoticePage() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [data, setData] = useState<BillData | null>(null);
  const [loading, setLoading] = useState(true);
  const [slipUploaded, setSlipUploaded] = useState(false);

  // เพิ่มฟังก์ชัน refresh ข้อมูล
  const refreshData = () => {
    if (!id) return;
    setLoading(true);
    fetch(`/api/link/${id}`)
      .then((res) => res.json())
      .then((bill) => {
        setData({
          name: bill.name,
          amount: bill.amount,
          accountNumber: bill.accountNumber || "123-4-56789-0",
          bankDetails: bill.bankDetails || "ธนาคารกรุงเทพ สาขาสีลม",
          qrCodeUrl: bill.qrCodeUrl || "/qrcode.png",
          status: bill.status,
          paidMessage: bill.paidMessage,
        });
        setSlipUploaded(
          bill.status === "100" ||
            bill.status === "200" ||
            bill.status === "201" ||
            bill.status === "300",
        );
        setLoading(false);
      });
  };

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`/api/link/${id}`)
      .then((res) => res.json())
      .then((bill) => {
        setData({
          name: bill.name,
          amount: bill.amount,
          accountNumber: bill.accountNumber || "123-4-56789-0",
          bankDetails: bill.bankDetails || "ธนาคารกรุงเทพ สาขาสีลม",
          qrCodeUrl: bill.qrCodeUrl || "/qrcode.png",
          status: bill.status,
          paidMessage: bill.paidMessage,
        });
        setSlipUploaded(
          bill.status === "100" ||
            bill.status === "200" ||
            bill.status === "201" ||
            bill.status === "300",
        );
        setLoading(false);
      });
  }, [id]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && id) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = async (ev) => {
        const slipBase64 = ev.target?.result as string;
        await fetch(`/api/link/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            slip: slipBase64,
            slipUploadedAt: new Date().toISOString(),
            status: "100",
            statusChangedAt: new Date().toISOString(),
          }),
        });
        setSlipUploaded(true);
        refreshData(); // <-- refresh หลังอัปโหลด slip
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto mt-10 max-w-md rounded-lg border border-gray-200 bg-white p-6 text-center shadow">
        กำลังโหลดข้อมูล...
        <BottomMenu />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="mx-auto mt-10 max-w-md rounded-lg border border-gray-200 bg-white p-6 text-center shadow">
        ไม่พบข้อมูล
        <BottomMenu />
      </div>
    );
  }

  if (data.status === "301") {
    return (
      <div className="mx-auto mt-10 max-w-md rounded-lg border border-gray-200 bg-white p-6 text-center shadow">
        ไม่มีรายการที่คุณต้องการ
        <BottomMenu />
      </div>
    );
  }

  // เฉพาะสถานะชำระแล้ว
  if (data.status === "200" || data.status === "201") {
    return (
      <div
        className="mx-auto mt-10 max-w-md rounded-lg bg-white p-6"
        style={{
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Helvetica Neue', Helvetica, 'Segoe UI', Arial, Roboto, 'PingFang SC', miui, 'Hiragino Sans GB', 'Microsoft Yahei', sans-serif",
        }}
      >
        <div className="mx-6 flex flex-col items-center">
          <div className="flex flex-row items-center gap-2">
            <div className="mb-2">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <circle cx="20" cy="20" r="20" fill="#E6F9EC" />
                <path
                  d="M14 20L18 24L26 16"
                  stroke="#22B573"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="mb-2 text-2xl font-bold text-[#303ac6]">
              ชำระเงินสำเร็จแล้ว
            </div>
          </div>
          <div className="text-md mb-2 text-center text-base font-bold text-[#444]">
            {data.status === "201" && data.paidMessage
              ? data.paidMessage
              : "คุณไม่เหลือยอดค้างชำระสำหรับใบแจ้งหนี้นี้"}
          </div>
          <div className="flex w-full">
            <div className="mb-2 ml-2 text-[#222]">ความคืบหน้าการชำระเงิน</div>
          </div>
          <div className="my-2 w-full border-1 border-slate-200"></div>
          <div className="mb-4 ml-16 w-full">
            <ul className="relative pl-1">
              {/* เส้นเชื่อมแนวตั้ง */}
              <div className="absolute top-2 bottom-2 left-[8.5px] z-0 w-0.5 bg-[#E0E0E0]" />
              <div className="absolute top-2 bottom-2 left-[8.5px] z-0 w-0.5 bg-[#303ac6]" />
              <li className="relative z-10 mb-2 ml-[1.5px] flex items-center">
                <span className="flex h-2 w-2 items-center justify-center rounded-full border-2 border-[#303ac6] bg-[#303ac6]"></span>
                <span className="ml-3 font-bold text-[#303ac6]">
                  รับหลักฐานการโอนเงิน
                </span>
              </li>
              <li className="relative z-10 mb-2 ml-[1.5px] flex items-center">
                <span className="flex h-2 w-2 items-center justify-center rounded-full border-2 border-[#303ac6] bg-[#303ac6]"></span>
                <span className="ml-3 font-bold text-[#303ac6]">
                  กำลังตรวจสอบหลักฐานการโอนเงิน
                </span>
              </li>
              <li className="relative z-10 flex items-center font-bold text-[#BDBDBD]">
                <span className="flex h-3 w-3 items-center justify-center rounded-full border-2 border-[#303ac6] bg-[#303ac6]"></span>
                <span className="ml-3 font-bold text-[#303ac6]">
                  ตรวจสอบแล้ว
                </span>
              </li>
            </ul>
          </div>
        </div>
        <BottomMenu />
      </div>
    );
  }

  // ตรวจสอบไม่ผ่าน
  if (data.status === "300") {
    return (
      <div
        className="mx-auto mt-10 max-w-md rounded-lg border border-gray-200 bg-white p-6 shadow"
        style={{
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Helvetica Neue', Helvetica, 'Segoe UI', Arial, Roboto, 'PingFang SC', miui, 'Hiragino Sans GB', 'Microsoft Yahei', sans-serif",
        }}
      >
        <div className="flex flex-col items-center">
          <div className="mb-2">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <circle cx="24" cy="24" r="24" fill="#FFE6E6" />
              <path
                d="M16 16L32 32M32 16L16 32"
                stroke="#E02424"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="mb-2 text-2xl font-bold text-[#E02424]">
            ตรวจสอบไม่ผ่าน
          </div>
          <div className="mb-2 text-[#222]">
            กรุณาส่งสลิปใหม่ เนื่องจากไม่ผ่านการตรวจสอบ
          </div>
          <div className="mb-2 text-[#666]">ความคืบหน้าการชำระเงิน</div>
          <hr className="my-2" />
          <div className="mb-4 w-full">
            <ul className="relative pl-6">
              <li className="mb-2 flex items-center">
                <span className="absolute -left-6 flex h-4 w-4 items-center justify-center rounded-full border-2 border-[#303ac6] bg-white">
                  <span className="block h-2 w-2 rounded-full bg-[#303ac6]"></span>
                </span>
                <span className="font-bold text-[#303ac6]">ตรวจสอบ</span>
              </li>
              <li className="flex items-center font-bold text-[#E02424]">
                <span className="absolute -left-6 flex h-4 w-4 items-center justify-center rounded-full border-2 border-[#E02424] bg-white">
                  <span className="block h-2 w-2 rounded-full bg-[#E02424]"></span>
                </span>
                ตรวจสอบไม่ผ่าน
              </li>
            </ul>
          </div>
          {/* ส่วนเดิมสำหรับแนบสลิปใหม่ */}
          <div className="mb-4">
            <strong>จำนวนเงินค้างชำระ:</strong>{" "}
            <span className="text-red-600">
              {data.amount.toLocaleString()} บาท
            </span>
          </div>
          <div className="mb-4 text-center">
            <Image
              src={data.qrCodeUrl}
              alt="QR Code"
              className="inline-block rounded border border-gray-300"
              width={180}
              height={180}
            />
            <div>
              <a
                href={data.qrCodeUrl}
                download="qrcode.png"
                className="mt-3 inline-block rounded bg-blue-700 px-5 py-2 text-base font-medium text-white hover:bg-blue-800"
              >
                Save QR
              </a>
            </div>
          </div>
          <div className="mb-2">
            <strong>เลขบัญชี:</strong> {data.accountNumber}
          </div>
          <div className="mb-4">
            <strong>รายละเอียดบัญชี:</strong> {data.bankDetails}
          </div>
          <div className="mb-4">
            <label className="mb-2 block font-semibold">
              แนบสลิปโอนเงิน:
              <input
                type="file"
                accept="image/*"
                onChange={handleUpload}
                className="mt-2 block w-full rounded border border-gray-300 p-2 file:mr-4 file:rounded file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:text-blue-700"
              />
            </label>
          </div>
        </div>
        <BottomMenu />
      </div>
    );
  }

  // เฉพาะสถานะ "รอตรวจสอบ"
  if (data.status === "100") {
    return (
      <div
        className="mx-auto mt-10 max-w-md rounded-lg bg-white p-6"
        style={{
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Helvetica Neue', Helvetica, 'Segoe UI', Arial, Roboto, 'PingFang SC', miui, 'Hiragino Sans GB', 'Microsoft Yahei', sans-serif",
        }}
      >
        <div className="mx-6 flex flex-col items-center">
          <div className="flex flex-row items-center gap-2">
            <div className="mb-2">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <circle cx="20" cy="20" r="20" fill="#E6F0FA" />
                <path
                  d="M20 10v12"
                  stroke="#303ac6"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="20" cy="30" r="2" fill="#303ac6" />
              </svg>
            </div>
            <div className="mb-2 text-[30px] font-bold text-[#303ac6]">
              รอตรวจสอบ
            </div>
          </div>
          <div className="text-md mb-2 font-bold text-[#222]">
            ระบบกำลังตรวจสอบข้อมูลการชำระเงินของคุณ
          </div>
          <div className="flex w-full">
            <div className="mb-2 ml-2 text-[#222]">ความคืบหน้าการชำระเงิน</div>
          </div>
          <div className="my-2 w-full border-1 border-slate-200"></div>
          <div className="mb-4 ml-16 w-full">
            <ul className="relative pl-1">
              {/* เส้นเชื่อมแนวตั้ง */}
              <div className="absolute top-2 bottom-2 left-[8.5px] z-0 w-0.5 bg-[#E0E0E0]" />
              <div className="absolute top-2 bottom-2 left-[8.5px] z-0 h-10 w-0.5 bg-[#303ac6]" />
              <li className="relative z-10 mb-2 ml-[1.5px] flex items-center">
                <span className="flex h-2 w-2 items-center justify-center rounded-full border-2 border-[#303ac6] bg-[#303ac6]"></span>
                <span className="ml-3 font-bold text-[#303ac6]">
                  รับหลักฐานการโอนเงิน
                </span>
              </li>
              <li className="relative z-10 mb-2 flex items-center">
                <span className="flex h-3 w-3 items-center justify-center rounded-full border-2 border-[#303ac6] bg-[#303ac6]"></span>
                <span className="ml-3 font-bold text-[#303ac6]">
                  กำลังตรวจสอบหลักฐานการโอนเงิน
                </span>
              </li>
              <li className="relative z-10 ml-[1.5px] flex items-center font-bold text-[#BDBDBD]">
                <span className="flex h-2 w-2 items-center justify-center rounded-full border-2 border-[#BDBDBD] bg-white"></span>
                <span className="ml-3">ตรวจสอบแล้ว</span>
              </li>
            </ul>
          </div>
        </div>
        <BottomMenu />
      </div>
    );
  }

  return (
    <div className="mx-auto mt-10 max-w-md rounded-lg border border-gray-200 bg-white p-6 shadow">
      <h2 className="mb-6 text-center text-2xl font-bold">แจ้งชำระเงิน</h2>
      <div className="mb-4">
        <strong>ชื่อ:</strong> {data.name}
      </div>
      {data.status === "200" || data.status === "201" ? (
        <>
          <div className="mb-6 text-center text-xl font-bold text-green-700">
            คุณชำระแล้ว
          </div>
          <div className="mb-4 text-center text-lg">
            {data.status === "201" && data.paidMessage
              ? data.paidMessage
              : "คุณไม่เหลือยอดค้างชำระสำหรับใบแจ้งหนี้นี้"}
          </div>
        </>
      ) : data.status === "300" ? (
        <>
          <div className="mb-4 text-center font-bold text-red-600">
            กรุณาส่งสลิปใหม่ เนื่องจากไม่ผ่านการตรวจสอบ
          </div>
          <div className="mb-4">
            <strong>จำนวนเงินค้างชำระ:</strong>{" "}
            <span className="text-red-600">
              {data.amount.toLocaleString()} บาท
            </span>
          </div>
          <div className="mb-4 text-center">
            <Image
              src={data.qrCodeUrl}
              alt="QR Code"
              className="inline-block rounded border border-gray-300"
              width={180}
              height={180}
            />
            <div>
              <a
                href={data.qrCodeUrl}
                download="qrcode.png"
                className="mt-3 inline-block rounded bg-blue-700 px-5 py-2 text-base font-medium text-white hover:bg-blue-800"
              >
                Save QR
              </a>
            </div>
          </div>
          <div className="mb-2">
            <strong>เลขบัญชี:</strong> {data.accountNumber}
          </div>
          <div className="mb-4">
            <strong>รายละเอียดบัญชี:</strong> {data.bankDetails}
          </div>
          <div className="mb-4">
            <label className="mb-2 block font-semibold">
              แนบสลิปโอนเงิน:
              <input
                type="file"
                accept="image/*"
                onChange={handleUpload}
                className="mt-2 block w-full rounded border border-gray-300 p-2 file:mr-4 file:rounded file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:text-blue-700"
              />
            </label>
          </div>
        </>
      ) : (
        <>
          <div className="mb-4">
            <strong>จำนวนเงินค้างชำระ:</strong>{" "}
            <span className="text-red-600">
              {data.amount.toLocaleString()} บาท
            </span>
          </div>
          <div className="mb-4 text-center">
            <Image
              src={data.qrCodeUrl}
              alt="QR Code"
              className="inline-block rounded border border-gray-300"
              width={180}
              height={180}
            />
            <div>
              <a
                href={data.qrCodeUrl}
                download="qrcode.png"
                className="mt-3 inline-block rounded bg-blue-700 px-5 py-2 text-base font-medium text-white hover:bg-blue-800"
              >
                Save QR
              </a>
            </div>
          </div>
          <div className="mb-2">
            <strong>เลขบัญชี:</strong> {data.accountNumber}
          </div>
          <div className="mb-4">
            <strong>รายละเอียดบัญชี:</strong> {data.bankDetails}
          </div>
          {!slipUploaded ? (
            <div className="mb-4">
              <label className="mb-2 block font-semibold">
                แนบสลิปโอนเงิน:
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleUpload}
                  className="mt-2 block w-full rounded border border-gray-300 p-2 file:mr-4 file:rounded file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:text-blue-700"
                />
              </label>
            </div>
          ) : (
            <div className="mt-6 text-center font-bold text-green-600">
              รอตรวจสอบ
            </div>
          )}
        </>
      )}
      <BottomMenu />
    </div>
  );
}