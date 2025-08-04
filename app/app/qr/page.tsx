'use client';

import Image from 'next/image';
import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import BottomMenu from '@/components/BottomMenu';
import FloatingButton from '@/components/FloatingButton';
import { LuClock3 } from 'react-icons/lu';
import { FaCheckCircle } from 'react-icons/fa';
import { IoAlertCircle } from 'react-icons/io5';
type BillData = {
  name: string;
  amount: number;
  accountNumber: string;
  bankDetails: string;
  qrCodeUrl: string;
  status: string;
  paidMessage?: string;
  transactionId?: string;
  promptPayId?: string; // Optional field for PromptPay ID
};

function BillNoticeContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const amount = searchParams.get('amount');

  const [data, setData] = useState<BillData | null>(null);
  const [loading, setLoading] = useState(true);
  // const [slipUploaded, setSlipUploaded] = useState(false);

  const fetchData = async () => {
    if (!id) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/link/${id}`);
      const bill = await res.json();
      setData({
        name: bill.name,
        amount: parseFloat(amount || bill.amount.toString()),
        accountNumber: bill.accountNumber || '123-4-56789-0',
        bankDetails: bill.bankDetails || 'ธนาคารกรุงเทพ สาขาสีลม',
        qrCodeUrl: bill.qrCodeUrl || '/thpp.png',
        status: bill.status,
        paidMessage: bill.paidMessage,
        transactionId: bill.transactionId || '255502025025025020520',
        promptPayId: bill.promptPayId || '1234567890', // Optional field for PromptPay ID
      });
      // setSlipUploaded(["100", "200", "201", "300"].includes(bill.status));
    } catch (error) {
      console.error('Failed to fetch bill data:', error);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && id) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = async (ev) => {
        const slipBase64 = ev.target?.result as string;
        await fetch(`/api/link/${id}`,
          {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              slip: slipBase64,
              slipUploadedAt: new Date().toISOString(),
              status: '100',
              statusChangedAt: new Date().toISOString(),
            }),
          });
        // setSlipUploaded(true);
        fetchData();
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto mt-10 max-w-md rounded-lg p-6 text-center">
        กำลังโหลดข้อมูล...
        <FloatingButton />
        <BottomMenu active="right" />
      </div>
    );
  }

  // ถ้าไม่มีข้อมูลหรือสถานะ 301
  if (!data || data.status === '301') {
    return (
      <div className="mx-auto mt-10 max-w-md">
        <div className="flex flex-col items-center p-3">
          <div className="flex flex-row items-center gap-2">
            <div className="mb-2 text-red-400">
              <IoAlertCircle size={40} />
            </div>
            <div className="mb-2 text-[30px] font-bold text-red-400">
              ไม่พบข้อมูลการชำระเงิน
            </div>
          </div>
          <div className="text-md mb-2 font-bold text-[#222]">
            หากชำระตรงเวลา คุณสามารถกู้ยืม{" "}
            <span className="text-indigo-600">฿ 0</span> ได้ในรอบถัดไป
          </div>
          <div className="font flex w-full">
            <div className="mb-2 ml-2 text-[#222]">ความคืบหน้าการชำระเงิน</div>
          </div>
          <div className="my-2 w-full border-1 border-gray-200"></div>
          <div className="my-4 flex w-full justify-start gap-4">
            <div className="flex flex-col items-center justify-center">
              <div className="rounded-full border-1 border-gray-300 bg-gray-400 p-1"></div>
              <div className="border-1 border-gray-300 py-4"></div>
              <div className="rounded-full border-1 border-gray-300 bg-gray-400 p-1"></div>
              <div className="border-1 border-gray-300 py-4"></div>
              <div className="rounded-full border-1 border-gray-300 bg-gray-400 p-1"></div>
            </div>
            <div className="text-bold flex flex-col gap-3 text-[20px] font-bold">
              <div className="text-gray-500">การโอนเงินคืน</div>
              <div className="text-gray-500">การตรวจสอบระบบ</div>
              <div className="text-gray-500">สินเชื่อเพื่อการชำระบัญชี</div>
            </div>
          </div>
        </div>
        <FloatingButton />
        <BottomMenu active="right" />
      </div>
    );
  }

  // เฉพาะสถานะ "รอตรวจสอบ"
  if (data.status === '100') {
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

  // เฉพาะสถานะชำระแล้ว
  if (data.status === '200' || data.status === '201') {
    return (
      <div className="mx-auto mt-10 max-w-md">
        <div className="flex flex-col items-center p-3">
          <div className="flex flex-row items-center gap-2">
            <div className="mb-2 text-green-600">
              <FaCheckCircle size={40} />
            </div>
            <div className="mb-2 text-[30px] font-bold text-green-600">
              ชำระเงินสำเร็จแล้ว
            </div>
          </div>
          <div className="text-md mb-2 font-bold text-[#222]">
            {data.status === '201' && data.paidMessage
              ? data.paidMessage
              : 'คุณไม่เหลือยอดค้างชำระสำหรับใบแจ้งหนี้นี้'}
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
              <div className="rounded-full text-indigo-600">
                <FaCheckCircle />
              </div>
              <div className="border-1 border-gray-300 py-4"></div>
              <div className="rounded-full text-indigo-600">
                <FaCheckCircle />
              </div>
            </div>
            <div className="text-bold flex flex-col gap-3 text-[20px] font-bold">
              <div className="text-indigo-600">การโอนเงินคืน</div>
              <div className="text-indigo-600">การตรวจสอบระบบ</div>
              <div className="text-indigo-600">สินเชื่อเพื่อการชำระบัญชี</div>
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

  // ตรวจสอบไม่ผ่าน
  if (data.status === '300') {
    return (
      <div className="mx-auto mt-10 max-w-md">
        <div className="flex flex-col items-center p-3">
          <div className="flex flex-row items-center gap-2">
            <div className="mb-2 text-red-400">
              <LuClock3 size={40} />
            </div>
            <div className="mb-2 text-[30px] font-bold text-red-400">
              ตรวจสอบไม่ผ่าน
            </div>
          </div>
          <div className="text-md mb-2 font-bold text-[#222]">
            กรุณาส่งสลิปใหม่ เนื่องจากไม่ผ่านการตรวจสอบ
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
        <FloatingButton />
        <BottomMenu active="right" />
      </div>
    );
  }

  return (
    <div className="mx-auto mt-10 max-w-md">
      <div className="flex flex-col items-center">
        <h2 className="text-center text-[12px] text-orange-600">
          หมายเหตุ: หน้านี้จ่ายได้เพียงครั้งเดียว
        </h2>
        <div className="text-cyan-700">หมดอายุ</div>
        <div className="text-sm font-bold text-green-600">
          *** แสกนคิวอาร์โค้ดเพื่อชำระเงิน ***
        </div>
        <div className="my-1">
          <a href={data.qrCodeUrl} download="data.qrCodeUrl" className="">
            <Image
              src={data.qrCodeUrl}
              alt="QR Code Payment"
              width={300}
              height={300}
            />
          </a>
        </div>
        <div className="">หมายเลขธุรกรรม: {data.transactionId}</div>
        <div className="">จำนวนเงิน: THB {data.amount.toLocaleString()}</div>
        <div className="">
          หมายเลขพร้อมเพย์:
          {data.promptPayId && data.promptPayId.length > 7
            ? `${data.promptPayId.slice(0, 3)}***${data.promptPayId.slice(-4)}`
            : data.promptPayId}
        </div>
        <div className="text-cyan-700">หมายแสกนซ้ำใช้ได้แค่ครั้งเดียว</div>
      </div>
      <FloatingButton />
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