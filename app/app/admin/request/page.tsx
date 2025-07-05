"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";

type RowData = {
    _id: string;
    name: string;
    amount: number;
    status: string;
    createdAt: string;
    slip?: string;
    slipUploadedAt?: string;
    paidMessage?: string;
};

const PAGE_SIZE = 30;

export default function AdminRequestPage() {
    const [page, setPage] = useState(1);
    const [modalOpen, setModalOpen] = useState(false);
    const [selected, setSelected] = useState<RowData | null>(null);
    const [rows, setRows] = useState<RowData[]>([]);
    const [loading, setLoading] = useState(true);
    const [customPaidMessage, setCustomPaidMessage] = useState("");
    const [refreshing, setRefreshing] = useState(false);
    const DEFAULT_PAID_MESSAGE = "คุณไม่เหลือยอดค้างชำระสำหรับใบแจ้งหนี้นี้";

    // ฟังก์ชันสำหรับโหลดข้อมูลใหม่
    const fetchRows = async () => {
        setRefreshing(true);
        setLoading(true);
        const res = await fetch("/api/link?sort=desc");
        const data = await res.json();
        setRows(data);
        setLoading(false);
        setRefreshing(false);
    };

    // ดึงข้อมูลจาก API
    useEffect(() => {
        fetchRows();
        // eslint-disable-next-line
    }, []);

    const totalPage = Math.ceil(rows.length / PAGE_SIZE);
    const data = rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const openModal = (row: RowData) => {
        setSelected(row);
        setCustomPaidMessage(row.paidMessage || "");
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setSelected(null);
        setCustomPaidMessage("");
    };

    // เพิ่มฟังก์ชันสำหรับอัปเดตสถานะและข้อความ
    async function updateStatus(id: string, status: string, paidMessage?: string) {
        await fetch(`/api/link/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                status,
                statusChangedAt: new Date().toISOString(),
                ...(paidMessage ? { paidMessage } : {})
            })
        });
    }

    return (
        <div className="max-w-6xl mx-auto mt-10 p-6 bg-white rounded shadow border border-gray-200">
            {/* ปุ่มไปหน้าสร้าง Link และปุ่ม Refresh */}
            <div className="mt-8 text-center flex justify-between items-center">
                <a
                    href="/admin"
                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-semibold"
                >
                    ไปหน้าสร้าง Link
                </a>
                <button
                    className="inline-flex items-center bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded font-semibold ml-2"
                    onClick={fetchRows}
                    disabled={refreshing}
                >
                    {refreshing ? (
                        <svg className="animate-spin h-5 w-5 mr-2 text-gray-600" viewBox="0 0 24 24">
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                                fill="none"
                            />
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
                            />
                        </svg>
                    ) : (
                        <svg
                            className="h-5 w-5 mr-2 text-gray-600"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M4 4v5h.582M20 20v-5h-.581M5.21 17.293A8 8 0 1112 20v-1"
                            />
                        </svg>
                    )}
                    รีเฟรช
                </button>
            </div>
            <h2 className="text-2xl font-bold mb-6">รายการสร้าง Link</h2>

            <div className="overflow-x-auto">
                <table className="min-w-full border text-sm">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border px-2 py-2">ID</th>
                            <th className="border px-2 py-2">Link</th>
                            <th className="border px-2 py-2">วันที่สร้าง</th>
                            <th className="border px-2 py-2">ชื่อ</th>
                            <th className="border px-2 py-2">จำนวนเงิน</th>
                            <th className="border px-2 py-2">สถานะ</th>
                            <th className="border px-2 py-2">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={7} className="text-center py-8">
                                    กำลังโหลดข้อมูล...
                                </td>
                            </tr>
                        ) : data.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="text-center py-8">
                                    ไม่พบข้อมูล
                                </td>
                            </tr>
                        ) : (
                            data.map((row, idx) => (
                                <tr key={row._id} className="hover:bg-gray-50">
                                    <td className="border px-2 py-1 text-center">{(page - 1) * PAGE_SIZE + idx + 1}</td>
                                    <td className="border px-2 py-1">
                                        <a href={`/?id=${row._id}`} className="text-blue-700 underline" target="_blank">
                                            LINK
                                        </a>
                                    </td>
                                    <td className="border px-2 py-1 text-center">
                                        {new Date(row.createdAt).toLocaleString()}
                                    </td>
                                    <td className="border px-2 py-1">{row.name}</td>
                                    <td className="border px-2 py-1 text-right">{row.amount.toLocaleString()} บาท</td>
                                    <td className="border px-2 py-1 text-center">
                                        {row.status === "000" && (
                                            <span className="text-yellow-600 font-semibold">รอแนบสลิป</span>
                                        )}
                                        {row.status === "100" && (
                                            <span className="text-blue-600 font-semibold">รอตรวจสอบ</span>
                                        )}
                                        {row.status === "200" && "ตรวจสอบผ่าน"}
                                        {row.status === "201" && "ตรวจสอบผ่าน*"}
                                        {row.status === "300" && (
                                            <span className="text-red-600 font-semibold">ตรวจสอบไม่ผ่าน</span>
                                        )}
                                        {row.status === "301" && (
                                            <span className="text-gray-600 font-semibold">ยกเลิก Link</span>
                                        )}
                                    </td>
                                    <td className="border px-2 py-1 text-center">
                                        <button
                                            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs"
                                            onClick={() => openModal(row)}
                                        >
                                            ดูรายละเอียด
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            {/* Paging */}
            <div className="flex justify-between items-center mt-4">
                <button
                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                >
                    ก่อนหน้า
                </button>
                <span>
                    หน้า {page} / {totalPage}
                </span>
                <button
                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    onClick={() => setPage((p) => Math.min(totalPage, p + 1))}
                    disabled={page === totalPage}
                >
                    ถัดไป
                </button>
            </div>

            {/* Modal */}
            {modalOpen && selected && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
                        <button
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                            onClick={closeModal}
                        >
                            ✕
                        </button>
                        <h3 className="text-xl font-bold mb-4">รายละเอียด</h3>
                        <div className="mb-2">
                            <b>ID:</b> {selected._id}
                        </div>
                        <div className="mb-2">
                            <b>Link:</b>{" "}
                            <a href={`/?id=${selected._id}`} className="text-blue-700 underline" target="_blank">
                                LINK
                            </a>
                        </div>
                        <div className="mb-2">
                            <b>วันที่สร้าง:</b> {new Date(selected.createdAt).toLocaleString()}
                        </div>
                        <div className="mb-2">
                            <b>ชื่อ:</b> {selected.name}
                        </div>
                        <div className="mb-2">
                            <b>จำนวนเงิน:</b> {selected.amount.toLocaleString()} บาท
                        </div>
                        <div className="mb-2">
                            <b>สถานะ:</b> {selected.status === "000" && "รอแนบสลิป"}
                            {selected.status === "100" && "รอตรวจสอบ"}
                            {selected.status === "200" && "ตรวจสอบผ่าน"}
                            {selected.status === "201" && "ตรวจสอบผ่าน*"}
                            {selected.status === "300" && "ตรวจสอบไม่ผ่าน"}
                            {selected.status === "301" && "ยกเลิก Link"}
                        </div>
                        {selected.slip && (
                            <div className="mb-2">
                                <b>สลิปโอนเงิน:</b>
                                <Image
                                    src={selected.slip}
                                    alt="slip"
                                    className="mt-2 border rounded max-h-60"
                                    width={180}
                                    height={180}
                                />
                            </div>
                        )}

                        {/* Textbox สำหรับข้อความตรวจสอบผ่าน */}
                        <div className="mt-4">
                            <label className="block font-semibold mb-2">
                                ข้อความเมื่อ `ตรวจสอบผ่าน` (ถ้าไม่กรอกจะใช้ค่าเริ่มต้น)
                            </label>
                            <textarea
                                className="border rounded p-2 w-full"
                                rows={2}
                                placeholder={DEFAULT_PAID_MESSAGE}
                                value={customPaidMessage}
                                onChange={(e) => setCustomPaidMessage(e.target.value)}
                            />
                        </div>

                        <div className="flex gap-2 mt-6">
                            {/* ตรวจสอบผ่าน */}
                            <button
                                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded font-semibold"
                                onClick={async () => {
                                    await updateStatus(
                                        selected._id,
                                        customPaidMessage.trim() ? "201" : "200",
                                        customPaidMessage.trim() ? customPaidMessage : DEFAULT_PAID_MESSAGE
                                    );
                                    closeModal();
                                    fetchRows(); // รีเฟรชตาราง
                                }}
                            >
                                ตรวจสอบผ่าน
                            </button>
                            {/* ตรวจสอบไม่ผ่าน */}
                            <button
                                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded font-semibold"
                                onClick={async () => {
                                    await updateStatus(selected._id, "300");
                                    closeModal();
                                    fetchRows(); // รีเฟรชตาราง
                                }}
                            >
                                ตรวจสอบไม่ผ่าน
                            </button>
                            {/* ยกเลิกลิงค์ */}
                            <button
                                className="flex-1 bg-gray-500 hover:bg-gray-700 text-white py-2 rounded font-semibold"
                                onClick={async () => {
                                    await updateStatus(selected._id, "301");
                                    closeModal();
                                    fetchRows(); // รีเฟรชตาราง
                                }}
                            >
                                ยกเลิกลิงค์
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
