"use client";

import Image from "next/image";
import React, { Suspense, useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import BottomMenu from "@/components/BottomMenu";
import FlipClockCountdown from "@leenguyen/react-flip-clock-countdown";
import "@leenguyen/react-flip-clock-countdown/dist/index.css";

// The main data structure for the bill page
type BillData = {
  name: string;
  amount: number;
  status: string;
  paidMessage?: string;
  transactionId?: string;
  qrAccessedAt?: string;
  promptpayNumber?: string; // This will be populated from the API
};

function BillNoticeContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const amountFromQuery = searchParams.get("amount");

  const [data, setData] = useState<BillData | null>(null);
  const [loading, setLoading] = useState(true);
  const [qrExpired, setQrExpired] = useState(false);
  const [toTime, setToTime] = useState(new Date().getTime());

  const fetchData = useCallback(async () => {
    if (!id) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/link/${id}`);
      if (!res.ok) {
        throw new Error("Failed to fetch link data");
      }
      const bill = await res.json();

      // The API now returns promptpayNumber inside the createdBy object
      const promptpayNumber = bill.createdBy?.promptpayNumber;

      setData({
        name: bill.name,
        amount: parseFloat(amountFromQuery || bill.amount.toString()),
        status: bill.status,
        paidMessage: bill.paidMessage,
        transactionId: bill.transactionId || "xxxx-xxxx-xxxx-xxxx",
        qrAccessedAt: bill.qrAccessedAt,
        promptpayNumber: promptpayNumber,
      });

      if (bill.qrAccessedAt) {
        const accessedAt = new Date(bill.qrAccessedAt).getTime();
        const newToTime = accessedAt + 10 * 60 * 1000;
        setToTime(newToTime);
      }
    } catch (error) {
      console.error("Failed to fetch bill data:", error);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [id, amountFromQuery]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const qrCodeUrl =
    data?.promptpayNumber && data?.amount
      ? `https://promptpay.io/${data.promptpayNumber}/${data.amount}`
      : "/thpp.png";

  if (loading) {
    return (
      <div className="mx-auto mt-10 max-w-md rounded-lg p-6 text-center">
        กำลังโหลดข้อมูล...
        <BottomMenu active="right" />
      </div>
    );
  }

  if (!data || data.status === "301") {
    // ... (JSX for 'Not Found' state remains the same)
    return <div>ไม่พบข้อมูลการชำระเงิน</div>;
  }

  if (data.status === "100") {
    // ... (JSX for 'Pending Review' state remains the same)
    return <div>กำลังรอการคืนเงิน</div>;
  }

  if (data.status === "200" || data.status === "201") {
    // ... (JSX for 'Paid' state remains the same)
    return <div>ชำระเงินสำเร็จแล้ว</div>;
  }

  if (data.status === "300") {
    // ... (JSX for 'Rejected' state remains the same)
    return <div>ตรวจสอบไม่ผ่าน</div>;
  }

  // Default state (Waiting for payment)
  return (
    <div className="mx-auto mt-10 max-w-md">
      <div className="flex flex-col items-center gap-2">
        <h2 className="text-center text-[12px] text-orange-600">
          หมายเหตุ: หน้านี้จ่ายได้เพียงครั้งเดียว
        </h2>
        <div className="text-cyan-700">
          {qrExpired ? (
            <span className="font-bold text-red-600">QR Code หมดอายุแล้ว</span>
          ) : (
            <div className="flex items-center gap-2">
              หมดอายุ
              <FlipClockCountdown
                to={toTime}
                showLabels={false}
                labelStyle={{ fontSize: "12px" }}
                digitBlockStyle={{
                  width: 20,
                  height: 30,
                  fontSize: 12,
                  background: "#5d85f5",
                }}
                dividerStyle={{ color: "#5d85f5", height: 0 }}
                separatorStyle={{ color: "#5d85f5", size: "3px" }}
                duration={0.5}
                onComplete={() => setQrExpired(true)}
                renderMap={[false, true, true, true]}
              />
            </div>
          )}
        </div>
        <div className="text-sm font-bold text-green-600">
          *** แสกนคิวอาร์โค้ดเพื่อชำระเงิน ***
        </div>
        <div className="my-1">
          <Image src="/qr-header.png" alt="QR Header" width={300} height={50} />
          {!qrExpired && qrCodeUrl !== "/thpp.png" ? (
            <a href={qrCodeUrl} download="qrcode.png">
              <Image
                src={qrCodeUrl}
                alt="QR Code Payment"
                width={300}
                height={300}
              />
            </a>
          ) : (
            <div className="flex h-[300px] w-[300px] items-center justify-center bg-gray-100 text-gray-500">
              {qrExpired ? "QR Code หมดอายุแล้ว" : "กำลังสร้าง QR Code..."}
            </div>
          )}
        </div>
        <div>หมายเลขธุรกรรม: {data.transactionId || "ยังไม่พบธุรกรรม"}</div>
        <div>จำนวนเงิน: THB {data.amount.toLocaleString()}</div>
        <div>
          หมายเลขพร้อมเพย์:
          {data.promptpayNumber && data.promptpayNumber.length > 7
            ? `${data.promptpayNumber.slice(0, 3)}***${data.promptpayNumber.slice(-4)}`
            : data.promptpayNumber}
        </div>
        <div className="text-cyan-700">หมายแสกนซ้ำใช้ได้แค่ครั้งเดียว</div>
      </div>
      <BottomMenu active="right" />
    </div>
  );
}

export default function BillNoticePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BillNoticeContent />
    </Suspense>
  );
}
