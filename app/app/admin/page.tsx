"use client";

import React, { useState } from "react";
import Link from "next/link";
import authFetch from "@/lib/authFetch";

interface LinkData {
  name: string;
  amount: number;
  status: string;
  slip: string | null;
  slipUploadedAt: string | null;
  statusChangedAt: string;
  outStandingBalance: number;
  dueDate: Date;
  previousQuota: number;
  currentQuota: number;
  nextQuota: number;
  extraQuota: number;
}

async function saveLinkToDB(data: Omit<LinkData, 'slip' | 'slipUploadedAt' | 'statusChangedAt'>) {
  // The endpoint is POST /api/link, which is now protected.
  const res = await authFetch("/api/link", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
      const errorData = await res.json().catch(() => ({ message: "An unknown error occurred" }));
      throw new Error(errorData.message || "บันทึกข้อมูลไม่สำเร็จ");
  }
  return res.json();
}

export default function AdminPage() {
  const [user, setUser] = useState("");
  const [amount, setAmount] = useState("");
  const [outStandingBalance, setOutStandingBalance] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [previousQuota, setPreviousQuota] = useState("");
  const [currentQuota, setCurrentQuota] = useState("");
  const [nextQuota, setNextQuota] = useState("");
  const [extraQuota, setExtraQuota] = useState("");
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // This page now assumes the user is already logged in.
  // The authFetch utility will handle redirects if the user is not authenticated.

  const handleGenerateLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setGeneratedLink(null);
    try {
      const data = {
        name: user,
        amount: Number(amount),
        status: "000", // รอslip
        outStandingBalance: Number(outStandingBalance),
        dueDate: new Date(dueDate),
        previousQuota: Number(previousQuota),
        currentQuota: Number(currentQuota),
        nextQuota: Number(nextQuota),
        extraQuota: Number(extraQuota),
      };
      
      const result = await saveLinkToDB(data);
      
      const params = new URLSearchParams({
        id: result._id,
      }).toString();
      setGeneratedLink(`/invoice?${params}`);
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert("เกิดข้อผิดพลาดที่ไม่รู้จัก");
      }
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="mx-auto mt-10 max-w-md rounded-lg border border-gray-200 bg-white p-6 shadow">
      <h2 className="mb-6 text-center text-2xl font-bold">สร้าง Link</h2>
      <form onSubmit={handleGenerateLink}>
        <div className="mb-4">
          <label className="mb-1 block font-medium">ชื่อผู้ใช้</label>
          <input
            type="text"
            className="w-full rounded border border-gray-300 px-3 py-2"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <div className="mb-4">
          <label className="mb-1 block font-medium">จำนวนเงิน</label>
          <input
            type="number"
            className="w-full rounded border border-gray-300 px-3 py-2"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            min={1}
            disabled={loading}
          />
        </div>
        <div className="mb-4">
          <label className="mb-1 block font-medium">ยอดที่ต้องชำระ</label>
          <input
            type="number"
            className="w-full rounded border border-gray-300 px-3 py-2"
            value={outStandingBalance}
            onChange={(e) => setOutStandingBalance(e.target.value)}
            required
            min={1}
            disabled={loading}
          />
        </div>
        <div className="mb-4">
          <label className="mb-1 block font-medium">วันที่ครบกำหนด</label>
          <input
            type="date"
            className="w-full rounded border border-gray-300 px-3 py-2"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <div className="mb-4">
          <label className="mb-1 block font-medium">โควต้ารอบที่แล้ว</label>
          <input
            type="number"
            className="w-full rounded border border-gray-300 px-3 py-2"
            value={previousQuota}
            onChange={(e) => setPreviousQuota(e.target.value)}
            required
            min={1}
            disabled={loading}
          />
        </div>
        <div className="mb-4">
          <label className="mb-1 block font-medium">โควต้ารอบนี้</label>
          <input
            type="number"
            className="w-full rounded border border-gray-300 px-3 py-2"
            value={currentQuota}
            onChange={(e) => setCurrentQuota(e.target.value)}
            required
            min={1}
            disabled={loading}
          />
        </div>
        <div className="mb-4">
          <label className="mb-1 block font-medium">โควต้ารอบต่อไป</label>
          <input
            type="number"
            className="w-full rounded border border-gray-300 px-3 py-2"
            value={nextQuota}
            onChange={(e) => setNextQuota(e.target.value)}
            required
            min={1}
            disabled={loading}
          />
        </div>
        <div className="mb-4">
          <label className="mb-1 block font-medium">วงเงินเพิ่ม</label>
          <input
            type="number"
            className="w-full rounded border border-gray-300 px-3 py-2"
            value={extraQuota}
            onChange={(e) => setExtraQuota(e.target.value)}
            required
            min={1}
            disabled={loading}
          />
        </div>
        <button
          type="submit"
          className="w-full rounded bg-green-600 py-2 font-semibold text-white hover:bg-green-700 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'กำลังสร้าง...' : 'สร้าง Link'}
        </button>
      </form>
      {generatedLink && (
        <div className="mt-6 text-center">
          <span className="mb-2 block font-medium">Link ที่สร้าง:</span>
          <div className="flex flex-col items-center gap-2">
            <Link
              href={generatedLink}
              className="break-all text-blue-700 underline"
              target="_blank"
            >
              {generatedLink}
            </Link>
            <button
              type="button"
              className="mt-1 rounded bg-gray-200 px-4 py-1 text-sm hover:bg-gray-300"
              onClick={() => {
                if (typeof window !== "undefined") {
                  navigator.clipboard.writeText(
                    window.location.origin + generatedLink,
                  );
                  alert("คัดลอกลิงก์เรียบร้อยแล้ว");
                }
              }}
            >
              Copy
            </button>
          </div>
        </div>
      )}
      <div className="mt-8 text-center">
        <Link
          href="/admin/request"
          className="inline-block rounded bg-blue-600 px-6 py-2 font-semibold text-white hover:bg-blue-700"
        >
          ดูคำขอทั้งหมด
        </Link>
      </div>
    </div>
  );
}