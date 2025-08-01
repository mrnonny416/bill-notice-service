"use client";
import { useState } from "react";
import { SlArrowDown } from "react-icons/sl";
import { BsFillInfoCircleFill } from "react-icons/bs";
import FloatingButton from "@/components/FloatingButton";
import BottomMenu from "@/components/BottomMenu";
import { useRouter } from "next/navigation";

type Props = {
  outStandingBalance: number;
  dueDate: Date;
  previousQuota: number;
  currentQuota: number;
  nextQuota: number;
  extraQuota: number;
};

const invoiceData: Props = {
  outStandingBalance: 1250.0,
  dueDate: new Date(new Date("2025-8-3").setHours(0, 0, 0, 0)),
  previousQuota: 3800.0,
  currentQuota: 3800.0,
  nextQuota: 5400.0,
  extraQuota: 1750.0,
};

export default function Invoice() {
  const [openInfo, setOpenInfo] = useState(false);
  const [openLimit, setOpenLimit] = useState(false);
  const router = useRouter();

  return (
    <>
      <div className="mx-auto mt-4 max-w-md">
        <div className="flex w-full flex-col items-center gap-2 p-3">
          <div
            className="relative flex w-full flex-col items-center justify-center gap-3 overflow-hidden rounded-3xl py-4 text-center text-white"
            style={{
              backgroundImage: "url('/card-bg-sportlight.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              minHeight: "180px",
            }}
          >
            <p className="text-2xl">ยอดที่ต้องชำระ</p>
            <p className="text-4xl font-bold">
              ฿ {invoiceData.outStandingBalance.toLocaleString("th-TH")}
            </p>
            <p className="text-md">
              วันที่ครบกำหนด: {invoiceData.dueDate.toLocaleDateString("th-TH")}
            </p>
            <button className="text-md w-fit rounded-4xl bg-orange-300 px-4 py-2">
              {(() => {
                const today = new Date();
                const due = new Date(invoiceData.dueDate);
                const diffTime =
                  due.setHours(0, 0, 0, 0) - today.setHours(0, 0, 0, 0);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                return `อีก ${diffDays} วันครบกำหนด`;
              })()}
            </button>
          </div>
          <div className="flex w-full flex-col">
            <button
              className="flex w-full items-center justify-between rounded-t-lg px-4 py-3 text-xl focus:outline-none"
              onClick={() => setOpenInfo((event) => !event)}
              type="button"
            >
              ข้อมูลเงินกู้
              <span
                className={`transition-transform ${openInfo ? "rotate-180" : ""}`}
              >
                <SlArrowDown />
              </span>
            </button>
            {openInfo && (
              <div className="flex w-full flex-col px-4 py-3">
                ข้อมูลเงินกู้
              </div>
            )}
          </div>
          <div className="flex w-full flex-col">
            <button
              className="flex w-full items-center justify-between rounded-t-lg px-4 py-3 text-xl focus:outline-none"
              onClick={() => setOpenLimit((event) => !event)}
              type="button"
            >
              ชำระเงินกู้คืน วงเงินเพิ่ม
              <span
                className={`transition-transform ${openLimit ? "rotate-180" : ""}`}
              >
                <SlArrowDown />
              </span>
            </button>
            {openLimit && (
              <div className="flex w-full flex-col px-4 py-3">
                <div className="relative w-full rounded-lg bg-slate-200 px-4 py-3">
                  {/* Arrow/triangle head */}
                  <div
                    className="absolute -top-2 left-4 h-0 w-0"
                    style={{
                      borderLeft: "10px solid transparent",
                      borderRight: "10px solid transparent",
                      borderBottom: "10px solid #e5e7eb",
                    }}
                  />
                  <p className="text-sm text-slate-600">
                    ชำระเงินกู้คืน วงเงินเพิ่ม
                  </p>
                </div>
                <div className="my-4 flex w-full justify-center gap-8">
                  <div className="flex flex-col items-center gap-3 text-slate-600">
                    <div>โควต้ารอบที่แล้ว</div>
                    <div>โควต้ารอบนี้</div>
                    <div>โควต้ารอบต่อไป</div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="rounded-full border-4 border-indigo-600 p-1"></div>
                    <div className="border-2 border-slate-300 py-2.5"></div>
                    <div className="rounded-full border-4 border-indigo-600 p-1"></div>
                    <div className="border-2 border-slate-300 py-2.5"></div>
                    <div className="rounded-full border-4 border-indigo-600 p-1"></div>
                  </div>
                  <div className="text-bold flex flex-col gap-3 font-bold">
                    <div className="text-slate-600">
                      ฿ {invoiceData.previousQuota.toLocaleString("th-TH")}
                    </div>
                    <div className="text-slate-600">
                      ฿ {invoiceData.currentQuota.toLocaleString("th-TH")}
                    </div>
                    <div className="text-slate-600">
                      ฿ {invoiceData.nextQuota.toLocaleString("th-TH")}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 self-center text-sm text-slate-400">
                  <BsFillInfoCircleFill color="orange" />
                  ชำระตรงเวลา ขอกู้ใหม่ได้
                  <p className="text-red-500">
                    ฿ {invoiceData.extraQuota.toLocaleString("th-TH")}
                  </p>
                </div>
              </div>
            )}
          </div>
          <div className="flex w-full flex-col gap-6">
            <button
              className="h-fit w-full rounded-4xl bg-indigo-600 py-3 text-white"
              onClick={() => router.push("/payments")}
            >
              ชำระเงินกู้
            </button>
            <button className="border-inner-2 h-fit w-full rounded-4xl border-1 border-indigo-600 bg-white py-3 text-indigo-600">
              ขยายเวลาชำระคืน
            </button>
          </div>
        </div>
      </div>
      <FloatingButton />
      <BottomMenu active="left" />
    </>
  );
}
