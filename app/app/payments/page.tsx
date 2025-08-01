"use client";

import BottomMenu from "@/components/BottomMenu";
import FloatingButton from "@/components/FloatingButton";
import { HiOutlineSpeakerWave } from "react-icons/hi2";
import { useRouter } from "next/navigation";

export default function Payments() {
  const router = useRouter();

  return (
    <>
      <div className="mx-auto flex w-full items-center justify-center bg-orange-100 text-orange-500">
        <div className="flex items-center justify-center gap-2 p-3">
          <HiOutlineSpeakerWave />
        </div>
        <div className="p-2">
          ชำระตรงเวลา ยืมใหม่ปลดล็อกจำนวนเงินที่สูงขึ้น
          และอันดับเครดิตก็จะดีขึ้นด้วย
        </div>
      </div>

      <div className="mx-auto mt-4 max-w-md">
        <div className="flex w-full flex-col items-center gap-2 p-3">
          <div className="text-sm text-gray-400">
            กรุณาใส่จำนวนเงินที่ชำระคืนของคุณ
            <span className="text-yellow-500">
              {" "}
              (จำนวนเงินที่ชำระคืนจะต้องสอดคล้องกับการโอนเงินจริง)
            </span>
          </div>
          <div className="relative w-full">
            <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-lg text-gray-400">
              ฿
            </span>
            <input
              type="number"
              className="w-full rounded-md border-1 border-gray-400 p-3 pl-8"
              placeholder="จำนวนเงินที่ต้องการชำระคืน"
            />
          </div>
          <div className="mt-2 flex w-full justify-start text-sm text-gray-400">
            โปรดเลือกบัตรธนาคาร
          </div>
          <div className="flex w-full justify-start text-gray-400">
            <div className="relative w-full">
              <select className="w-full rounded-md border-1 border-gray-400 p-3 pl-8">
                <option value="">โปรดเลือกบัตรธนาคาร</option>
                <option value="bank1">SCB</option>
                <option value="bank2">K BANK</option>
                <option value="bank3">THBANK</option>
              </select>
            </div>
          </div>
          <div className="mt-5 flex w-full justify-start text-gray-400">
            <button
              className="h-fit w-full rounded-4xl bg-indigo-600 py-3 text-white"
              type="button"
              onClick={() => router.push("/qr")}
            >
              ขั้นตอนต่อไป
            </button>
          </div>
        </div>
      </div>
      <FloatingButton />
      <BottomMenu active="right" />
    </>
  );
}
