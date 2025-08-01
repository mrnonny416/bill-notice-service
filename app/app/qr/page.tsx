"use client";

import React, { useEffect, useState } from "react";
import FloatingButton from "@/components/FloatingButton";
import BottomMenu from "@/components/BottomMenu";
import { LuClock3 } from "react-icons/lu";
import { FaCheckCircle } from "react-icons/fa";
type BillData = {
  name: string;
  amount: number;
  accountNumber: string;
  bankDetails: string;
  qrCodeUrl: string;
  status: string;
  paidMessage?: string;
};

const mockData: BillData = {
  name: "สมชาย ใจดี",
  amount: 1250,
  accountNumber: "123-4-56789-0",
  bankDetails: "ธนาคารกรุงเทพ สาขาสีลม",
  qrCodeUrl: "/qrcode.png",
  status: "100", // เปลี่ยนเป็น "200", "201", "300" เพื่อทดสอบแต่ละสถานะ
  paidMessage: "ขอบคุณที่ชำระเงิน",
};

export default function BillNoticePage() {
  const [data, setData] = useState<BillData | null>(mockData);
  const [loading] = useState(false);

  useEffect(() => {
    setData(mockData);
  }, []);

  if (loading) {
    return (
      <div className="mx-auto mt-10 max-w-md rounded-lg border border-gray-200 bg-white p-6 text-center shadow">
        กำลังโหลดข้อมูล...
        <FloatingButton />
        <BottomMenu active="right" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="mx-auto mt-10 max-w-md rounded-lg border border-gray-200 bg-white p-6 text-center shadow">
        ไม่พบข้อมูล
        <FloatingButton />
        <BottomMenu active="right" />
      </div>
    );
  }

  // เฉพาะสถานะ "รอตรวจสอบ"
  if (data.status === "100") {
    return (
      <div className="mx-auto mt-10 max-w-md">
        <div className="flex flex-col items-center p-3">
          <div className="flex flex-row items-center gap-2">
            <div className="mb-2 text-orange-400">
              <LuClock3 size={40} />
            </div>
            <div className="mb-2 text-[30px] font-bold text-orange-400">
              กำลังรอการคืนเงิน
            </div>
          </div>
          <div className="text-md mb-2 font-bold text-[#222]">
            หากชำระตรงเวลา คุณสามารถกู้ยืม{" "}
            <span className="text-indigo-600">฿ 1,500</span> ได้ในรอบถัดไป
          </div>
          <div className="font flex w-full">
            <div className="mb-2 ml-2 text-[#222]">ความคืบหน้าการชำระเงิน</div>
          </div>
          <div className="my-2 w-full border-1 border-gray-200"></div>
          <div className="my-4 flex w-full justify-start gap-4">
            <div className="flex flex-col items-center justify-center">
              <div className="rounded-full text-indigo-600">
                <FaCheckCircle />
              </div>
              <div className="border-1 border-gray-300 py-4"></div>
              <div className="rounded-full border-1 border-gray-300 bg-gray-400 p-1"></div>
              <div className="border-1 border-gray-300 py-4"></div>
              <div className="rounded-full border-1 border-gray-300 bg-gray-400 p-1"></div>
            </div>
            <div className="text-bold flex flex-col gap-3 text-[20px] font-bold">
              <div className="text-indigo-600">การโอนเงินคืน</div>
              <div className="text-gray-500">การตรวจสอบระบบ</div>
              <div className="text-gray-500">สินเชื่อเพื่อการชำระบัญชี</div>
            </div>
          </div>
          <div className="flex w-full flex-col gap-6">
            <button
              className="h-fit w-full rounded-4xl bg-indigo-600 py-3 text-white"
              onClick={() => {}}
            >
              ดูรายละเอียดการสั่งซื้อ
            </button>
          </div>
        </div>
        <FloatingButton />
        <BottomMenu active="right" />
      </div>
    );
  }
}
