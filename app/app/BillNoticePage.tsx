"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

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
                    paidMessage: bill.paidMessage
                });
                setSlipUploaded(
                    bill.status === "100" || bill.status === "200" || bill.status === "201" || bill.status === "300"
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
                        statusChangedAt: new Date().toISOString()
                    })
                });
                setSlipUploaded(true);
            };
            reader.readAsDataURL(file);
        }
    };

    if (loading) {
        return (
            <div className="max-w-md mx-auto mt-10 p-6 border border-gray-200 rounded-lg bg-white shadow text-center">
                กำลังโหลดข้อมูล...
            </div>
        );
    }

    if (!data) {
        return (
            <div className="max-w-md mx-auto mt-10 p-6 border border-gray-200 rounded-lg bg-white shadow text-center">
                ไม่พบข้อมูล
            </div>
        );
    }

    if (data.status === "301") {
        return (
            <div className="max-w-md mx-auto mt-10 p-6 border border-gray-200 rounded-lg bg-white shadow text-center">
                ไม่มีรายการที่คุณต้องการ
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto mt-10 p-6 border border-gray-200 rounded-lg bg-white shadow">
            <h2 className="text-2xl font-bold mb-6 text-center">แจ้งชำระเงิน</h2>
            <div className="mb-4">
                <strong>ชื่อ:</strong> {data.name}
            </div>
            {data.status === "200" || data.status === "201" ? (
                <>
                    <div className="mb-6 text-green-700 font-bold text-center text-xl">คุณชำระแล้ว</div>
                    <div className="mb-4 text-center text-lg">
                        {data.status === "201" && data.paidMessage
                            ? data.paidMessage
                            : "คุณไม่เหลือยอดค้างชำระสำหรับใบแจ้งหนี้นี้"}
                    </div>
                </>
            ) : data.status === "300" ? (
                <>
                    <div className="mb-4 text-red-600 font-bold text-center">
                        กรุณาส่งสลิปใหม่ เนื่องจากไม่ผ่านการตรวจสอบ
                    </div>
                    <div className="mb-4">
                        <strong>จำนวนเงินค้างชำระ:</strong>{" "}
                        <span className="text-red-600">{data.amount.toLocaleString()} บาท</span>
                    </div>
                    <div className="mb-4 text-center">
                        <Image
                            src={data.qrCodeUrl}
                            alt="QR Code"
                            className="inline-block border border-gray-300 rounded"
                            width={180}
                            height={180}
                        />
                        <div>
                            <a
                                href={data.qrCodeUrl}
                                download="qrcode.png"
                                className="inline-block mt-3 px-5 py-2 bg-blue-700 text-white rounded hover:bg-blue-800 text-base font-medium"
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
                        <label className="block font-semibold mb-2">
                            แนบสลิปโอนเงิน:
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleUpload}
                                className="block mt-2 border border-gray-300 p-2 rounded w-full file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700"
                            />
                        </label>
                    </div>
                </>
            ) : (
                <>
                    <div className="mb-4">
                        <strong>จำนวนเงินค้างชำระ:</strong>{" "}
                        <span className="text-red-600">{data.amount.toLocaleString()} บาท</span>
                    </div>
                    <div className="mb-4 text-center">
                        <Image
                            src={data.qrCodeUrl}
                            alt="QR Code"
                            className="inline-block border border-gray-300 rounded"
                            width={180}
                            height={180}
                        />
                        <div>
                            <a
                                href={data.qrCodeUrl}
                                download="qrcode.png"
                                className="inline-block mt-3 px-5 py-2 bg-blue-700 text-white rounded hover:bg-blue-800 text-base font-medium"
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
                            <label className="block font-semibold mb-2">
                                แนบสลิปโอนเงิน:
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleUpload}
                                    className="block mt-2 border border-gray-300 p-2 rounded w-full file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700"
                                />
                            </label>
                        </div>
                    ) : (
                        <div className="text-green-600 font-bold text-center mt-6">รอตรวจสอบ</div>
                    )}
                </>
            )}
        </div>
    );
}
