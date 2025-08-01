"use client";

import React, { useState } from "react";
import Link from "next/link";

// เพิ่มฟังก์ชันสำหรับบันทึกข้อมูลไปยัง API
async function saveLinkToDB(data: {
  name: string;
  amount: number;
  status: string;
}) {
  const res = await fetch("/api/link", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("บันทึกข้อมูลไม่สำเร็จ");
  return res.json();
}

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState("");
  const [amount, setAmount] = useState("");
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);

  // Mock login handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // ตัวอย่างตรวจสอบ username/password แบบง่าย
    if (username === "admin" && password === "1234") {
      setIsLoggedIn(true);
    } else {
      alert("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
    }
  };

  // สร้าง Link และบันทึกลงฐานข้อมูล
  const handleGenerateLink = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // สร้างข้อมูลสำหรับบันทึก
      const data = {
        name: user,
        amount: Number(amount),
        status: "000", // รอslip
        slip: null, // base64 string หรือ null
        slipUploadedAt: null,
        statusChangedAt: new Date().toISOString(),
      };
      // บันทึกข้อมูลไปยังฐานข้อมูล
      const result = await saveLinkToDB(data);
      // สร้าง query string สำหรับส่งไปหน้า bill
      const params = new URLSearchParams({
        id: result._id, // สมมติ API คืน _id กลับมา
      }).toString();
      setGeneratedLink(`/qr?${params}`);
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert("เกิดข้อผิดพลาด");
      }
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="mx-auto mt-20 max-w-sm rounded-lg border border-gray-200 bg-white p-6 shadow">
        <h2 className="mb-6 text-center text-xl font-bold">Admin Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="mb-1 block font-medium">Username</label>
            <input
              type="text"
              className="w-full rounded border border-gray-300 px-3 py-2"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label className="mb-1 block font-medium">Password</label>
            <input
              type="password"
              className="w-full rounded border border-gray-300 px-3 py-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full rounded bg-blue-700 py-2 font-semibold text-white hover:bg-blue-800"
          >
            Login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="mx-auto mt-20 max-w-md rounded-lg border border-gray-200 bg-white p-6 shadow">
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
          />
        </div>
        <div className="mb-6">
          <label className="mb-1 block font-medium">จำนวนเงิน</label>
          <input
            type="number"
            className="w-full rounded border border-gray-300 px-3 py-2"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            min={1}
          />
        </div>
        <button
          type="submit"
          className="w-full rounded bg-green-600 py-2 font-semibold text-white hover:bg-green-700"
        >
          สร้าง Link
        </button>
      </form>
      {generatedLink && (
        <div className="mt-6 text-center">
          <span className="mb-2 block font-medium">Link ที่สร้าง:</span>
          <div className="flex flex-col items-center gap-2">
            <Link
              href={
                typeof window !== "undefined"
                  ? window.location.origin + generatedLink
                  : generatedLink
              }
              className="break-all text-blue-700 underline"
              target="_blank"
            >
              {typeof window !== "undefined"
                ? window.location.origin + generatedLink
                : generatedLink}
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
