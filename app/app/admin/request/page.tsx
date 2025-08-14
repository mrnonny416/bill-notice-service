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
  outStandingBalance?: number;
  dueDate?: string;
  previousQuota?: number;
  currentQuota?: number;
  nextQuota?: number;
  extraQuota?: number;
  qrAccessedAt?: string;
  transactionId?: string;
  createdBy: {
    _id: string;
    username: string;
  };
};

const PAGE_SIZE = 30;

const QrTimerDisplay = ({ qrAccessedAt }: { qrAccessedAt?: string }) => {
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [qrExpired, setQrExpired] = useState(false);

  useEffect(() => {
    if (qrAccessedAt) {
      const interval = setInterval(() => {
        const now = new Date().getTime();
        const accessedAt = new Date(qrAccessedAt).getTime();
        const diff = now - accessedAt;
                const remaining = 10 * 60 * 1000 - diff;
        if (remaining > 0) {
          setTimeLeft(Math.floor(remaining / 1000));
        } else {
          setTimeLeft(0);
          setQrExpired(true);
          clearInterval(interval);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [qrAccessedAt]);

  if (!qrAccessedAt) {
    return <span className="text-gray-500">N/A</span>;
  }

  if (timeLeft === null) {
    return <span className="text-gray-500">Calculating...</span>;
  }

  if (qrExpired) {
    return <span className="font-bold text-red-600">Expired</span>;
  }

  const minutes = Math.floor(timeLeft / 60);
  const seconds = ("0" + (timeLeft % 60)).slice(-2);
  return <span className="font-bold text-cyan-700">{`${minutes}:${seconds}`}</span>;
};

interface UserOption {
  _id: string;
  username: string;
}

export default function AdminRequestPage() {
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selected, setSelected] = useState<RowData | null>(null);
  const [rows, setRows] = useState<RowData[]>([]);
  const [loading, setLoading] = useState(true);
  const [customPaidMessage, setCustomPaidMessage] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const DEFAULT_PAID_MESSAGE = "คุณไม่เหลือยอดค้างชำระสำหรับใบแจ้งหนี้นี้";

  const [editData, setEditData] = useState<Partial<RowData>>({});
  const [users, setUsers] = useState<UserOption[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>("");

  // ฟังก์ชันสำหรับโหลดข้อมูลใหม่
  const fetchRows = async (userId?: string) => {
    setRefreshing(true);
    setLoading(true);
    const token = localStorage.getItem("token");
    if (!token) {
      alert("ไม่พบ Token. กรุณาเข้าสู่ระบบใหม่");
      setLoading(false);
      setRefreshing(false);
      return;
    }

    let url = "/api/link?sort=desc";
    if (userId) {
      url += `&userId=${userId}`;
    }

    try {
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setRows(data);
      } else {
        console.error("API /api/link did not return an array:", data);
        setRows([]);
      }
    } catch (error) {
      console.error("Failed to fetch rows:", error);
      setRows([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // ดึงข้อมูลจาก API และผู้ใช้เมื่อโหลดหน้า
  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const res = await fetch("/api/admin/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (Array.isArray(data)) {
          setUsers(data);
        } else {
          console.error("API /api/admin/users did not return an array:", data);
          setUsers([]);
        }
      } catch (error) {
        console.error("Failed to fetch users:", error);
        setUsers([]);
      }
    };

    fetchUsers();
    fetchRows();
  }, []);

  useEffect(() => {
    fetchRows(selectedUserId);
  }, [selectedUserId]);

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

  const openEditModal = (row: RowData) => {
    setSelected(row);
    setEditData(row);
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    setSelected(null);
    setEditData({});
  };

  // เพิ่มฟังก์ชันสำหรับอัปเดตสถานะและข้อความ
  async function updateStatus(
    id: string,
    status: string,
    paidMessage?: string,
  ) {
    await fetch(`/api/link/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status,
        statusChangedAt: new Date().toISOString(),
        ...(paidMessage ? { paidMessage } : {}),
      }),
    });
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;

    try {
      await fetch(`/api/link/${selected._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData),
      });
      closeEditModal();
      fetchRows();
    } catch (error) {
      console.error("Failed to update data:", error);
      alert("Failed to update data");
    }
  };

  const StatusBadge = ({ status }: { status: string }) => {
    switch (status) {
      case "000":
        return <span className="font-semibold text-yellow-600">รอแนบสลิป</span>;
      case "100":
        return <span className="font-semibold text-blue-600">รอตรวจสอบ</span>;
      case "200":
        return (
          <span className="font-semibold text-green-600">ตรวจสอบผ่าน</span>
        );
      case "201":
        return (
          <span className="font-semibold text-green-700">ตรวจสอบผ่าน*</span>
        );
      case "300":
        return (
          <span className="font-semibold text-red-600">ตรวจสอบไม่ผ่าน</span>
        );
      case "301":
        return <span className="font-semibold text-gray-600">ยกเลิก Link</span>;
      default:
        return <span className="font-semibold text-gray-500">ไม่ระบุ</span>;
    }
  };

  return (
    <div className="mx-auto mt-4 w-full max-w-7xl rounded border border-gray-200 bg-white p-4 shadow md:mt-10 md:p-6">
      <div className="flex flex-col items-stretch justify-between gap-4 md:flex-row md:items-center">
        <h2 className="text-xl font-bold md:text-2xl">รายการสร้าง Link</h2>
        <div className="flex items-center justify-end gap-2">
          <select
            className="rounded border border-gray-300 bg-white px-3 py-2 text-sm"
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
          >
            <option value="">ผู้สร้างทั้งหมด</option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.username}
              </option>
            ))}
          </select>
          <a
            href="/admin"
            className="inline-block rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            สร้าง Link
          </a>
          <button
            className="inline-flex items-center rounded bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-300"
            onClick={() => fetchRows(selectedUserId)}
            disabled={refreshing}
          >
            {refreshing ? (
              <svg
                className="mr-2 -ml-1 h-5 w-5 animate-spin text-gray-600"
                viewBox="0 0 24 24"
              >
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
                  d="M4 12a8 8 0 018-8V8l3-3-3-3v4a8 8 0 00-8 8h4z"
                />
              </svg>
            ) : (
              <svg
                className="mr-2 -ml-1 h-5 w-5 text-gray-600"
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
      </div>

      {/* Mobile and Desktop Layout */}
      <div className="mt-6">
        {loading ? (
          <div className="py-8 text-center">กำลังโหลดข้อมูล...</div>
        ) : data.length === 0 ? (
          <div className="py-8 text-center">ไม่พบข้อมูล</div>
        ) : (
          <div className="space-y-4 md:hidden">
            {data.map((row) => (
              <div
                key={row._id}
                className="rounded-lg border bg-white p-4 shadow-sm"
              >
                <div className="flex justify-between">
                  <div className="font-bold text-gray-800">{row.name}</div>
                  <div className="text-sm text-gray-500">
                    {new Date(row.createdAt).toLocaleDateString("th-TH")}
                  </div>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <div className="text-lg font-semibold text-indigo-600">
                    {row.amount.toLocaleString()} บาท
                  </div>
                  <StatusBadge status={row.status} />
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <div className="text-sm font-semibold text-gray-700">QR Timer:</div>
                  <QrTimerDisplay qrAccessedAt={row.qrAccessedAt} />
                </div>
                <div className="mt-4 flex justify-end gap-2">
                  <a
                    href={`/invoice?id=${row._id}`}
                    className="text-sm text-blue-600 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    ดู Link
                  </a>
                  <button
                    className="rounded bg-blue-600 px-3 py-1 text-xs text-white hover:bg-blue-700"
                    onClick={() => openModal(row)}
                  >
                    รายละเอียด
                  </button>
                  <button
                    className="rounded bg-yellow-500 px-3 py-1 text-xs text-white hover:bg-yellow-600"
                    onClick={() => openEditModal(row)}
                  >
                    แก้ไข
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="hidden overflow-x-auto md:block">
          <table className="min-w-full border text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-2 py-2">ID</th>
                <th className="border px-2 py-2">Link</th>
                <th className="border px-2 py-2">วันที่สร้าง</th>
                <th className="border px-2 py-2">ชื่อ</th>
                <th className="border px-2 py-2">จำนวนเงิน</th>
                <th className="border px-2 py-2">ผู้สร้าง</th>
                <th className="border px-2 py-2">สถานะ</th>
                <th className="border px-2 py-2">QR Timer</th>
                <th className="border px-2 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, idx) => (
                <tr key={row._id} className="hover:bg-gray-50">
                  <td className="border px-2 py-1 text-center">
                    {(page - 1) * PAGE_SIZE + idx + 1}
                  </td>
                  <td className="border px-2 py-1">
                    <a
                      href={`/invoice?id=${row._id}`}
                      className="text-blue-700 underline"
                      target="_blank"
                    >
                      LINK
                    </a>
                  </td>
                  <td className="border px-2 py-1 text-center">
                    {new Date(row.createdAt).toLocaleString()}
                  </td>
                  <td className="border px-2 py-1">{row.name}</td>
                  <td className="border px-2 py-1 text-right">
                    {row.amount.toLocaleString()} บาท
                  </td>
                  <td className="border px-2 py-1 text-center">
                    {row.createdBy?.username}
                  </td>
                  <td className="border px-2 py-1 text-center">
                    <StatusBadge status={row.status} />
                  </td>
                  <td className="border px-2 py-1 text-center">
                    <QrTimerDisplay qrAccessedAt={row.qrAccessedAt} />
                  </td>
                  <td className="border px-2 py-1 text-center">
                    <button
                      className="rounded bg-blue-600 px-3 py-1 text-xs text-white hover:bg-blue-700"
                      onClick={() => openModal(row)}
                    >
                      ดูรายละเอียด
                    </button>
                    <button
                      className="ml-2 rounded bg-yellow-500 px-3 py-1 text-xs text-white hover:bg-yellow-600"
                      onClick={() => openEditModal(row)}
                    >
                      แก้ไข
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Paging */}
      <div className="mt-4 flex items-center justify-between">
        <button
          className="rounded bg-gray-200 px-3 py-1 hover:bg-gray-300 disabled:opacity-50"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          ก่อนหน้า
        </button>
        <span>
          หน้า {page} / {totalPage}
        </span>
        <button
          className="rounded bg-gray-200 px-3 py-1 hover:bg-gray-300 disabled:opacity-50"
          onClick={() => setPage((p) => Math.min(totalPage, p + 1))}
          disabled={page === totalPage}
        >
          ถัดไป
        </button>
      </div>

      {/* Details Modal */}
      {modalOpen && selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="relative w-full max-w-lg rounded-lg bg-white p-6 shadow-lg max-h-[90vh] overflow-y-auto">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={closeModal}
            >
              ✕
            </button>
            <h3 className="mb-4 text-xl font-bold">รายละเอียด</h3>
            <div className="space-y-2">
              <div>
                <b>ID:</b> {selected._id}
              </div>
              <div>
                <b>Link:</b>{" "}
                <a
                  href={`/invoice?id=${selected._id}`}
                  className="text-blue-700 underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LINK
                </a>
              </div>
              <div>
                <b>วันที่สร้าง:</b>{" "}
                {new Date(selected.createdAt).toLocaleString()}
              </div>
              <div>
                <b>ชื่อ:</b> {selected.name}
              </div>
              <div>
                <b>จำนวนเงิน:</b> {selected.amount.toLocaleString()} บาท
              </div>
              <div>
                <b>ผู้สร้าง:</b> {selected.createdBy?.username}
              </div>
              <div>
                <b>สถานะ:</b> <StatusBadge status={selected.status} />
              </div>
              <div>
                <b>QR Timer:</b> <QrTimerDisplay qrAccessedAt={selected.qrAccessedAt} />
              </div>
            </div>
            {selected.slip && (
              <div className="mt-4">
                <b>สลิปโอนเงิน:</b>
                <div className="relative mt-2 w-full max-w-xs mx-auto">
                  <Image
                    src={selected.slip}
                    alt="slip"
                    width={400}
                    height={800}
                    className="rounded border object-contain w-full h-auto"
                  />
                </div>
              </div>
            )}
            <div className="mt-4">
              <label className="mb-2 block font-semibold">
                ข้อความเมื่อ `ตรวจสอบผ่าน` (ถ้าไม่กรอกจะใช้ค่าเริ่มต้น)
              </label>
              <textarea
                className="w-full rounded border p-2"
                rows={2}
                placeholder={DEFAULT_PAID_MESSAGE}
                value={customPaidMessage}
                onChange={(e) => setCustomPaidMessage(e.target.value)}
              />
            </div>
            <div className="mt-6 flex flex-col gap-2 md:flex-row">
              <button
                className="flex-1 rounded bg-green-600 py-2 font-semibold text-white hover:bg-green-700"
                onClick={async () => {
                  await updateStatus(
                    selected._id,
                    customPaidMessage.trim() ? "201" : "200",
                    customPaidMessage.trim()
                      ? customPaidMessage
                      : DEFAULT_PAID_MESSAGE,
                  );
                  closeModal();
                  fetchRows();
                }}
              >
                ตรวจสอบผ่าน
              </button>
              <button
                className="flex-1 rounded bg-red-600 py-2 font-semibold text-white hover:bg-red-700"
                onClick={async () => {
                  await updateStatus(selected._id, "300");
                  closeModal();
                  fetchRows();
                }}
              >
                ตรวจสอบไม่ผ่าน
              </button>
              <button
                className="flex-1 rounded bg-gray-500 py-2 font-semibold text-white hover:bg-gray-700"
                onClick={async () => {
                  await updateStatus(selected._id, "301");
                  closeModal();
                  fetchRows();
                }}
              >
                ยกเลิกลิงค์
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editModalOpen && selected && (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
          <div className="relative h-full max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg bg-white p-6 shadow-lg">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              onClick={closeEditModal}
            >
              ✕
            </button>
            <h3 className="mb-4 text-xl font-bold">แก้ไขข้อมูล</h3>
            <form onSubmit={handleUpdate}>
              <div className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block font-medium">ชื่อผู้ใช้</label>
                  <input
                    type="text"
                    className="w-full rounded border border-gray-300 px-3 py-2"
                    value={editData.name || ""}
                    onChange={(e) =>
                      setEditData({ ...editData, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block font-medium">จำนวนเงิน</label>
                  <input
                    type="number"
                    className="w-full rounded border border-gray-300 px-3 py-2"
                    value={editData.amount || ""}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        amount: Number(e.target.value),
                      })
                    }
                    required
                    min={1}
                  />
                </div>
                <div>
                  <label className="mb-1 block font-medium">
                    ยอดที่ต้องชำระ
                  </label>
                  <input
                    type="number"
                    className="w-full rounded border border-gray-300 px-3 py-2"
                    value={editData.outStandingBalance || ""}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        outStandingBalance: Number(e.target.value),
                      })
                    }
                    required
                    min={1}
                  />
                </div>
                <div>
                  <label className="mb-1 block font-medium">
                    วันที่ครบกำหนด
                  </label>
                  <input
                    type="date"
                    className="w-full rounded border border-gray-300 px-3 py-2"
                    value={
                      editData.dueDate
                        ? new Date(editData.dueDate).toISOString().split("T")[0]
                        : ""
                    }
                    onChange={(e) =>
                      setEditData({ ...editData, dueDate: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block font-medium">
                    โควต้ารอบที่แล้ว
                  </label>
                  <input
                    type="number"
                    className="w-full rounded border border-gray-300 px-3 py-2"
                    value={editData.previousQuota || ""}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        previousQuota: Number(e.target.value),
                      })
                    }
                    required
                    min={1}
                  />
                </div>
                <div>
                  <label className="mb-1 block font-medium">โควต้ารอบนี้</label>
                  <input
                    type="number"
                    className="w-full rounded border border-gray-300 px-3 py-2"
                    value={editData.currentQuota || ""}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        currentQuota: Number(e.target.value),
                      })
                    }
                    required
                    min={1}
                  />
                </div>
                <div>
                  <label className="mb-1 block font-medium">
                    โควต้ารอบต่อไป
                  </label>
                  <input
                    type="number"
                    className="w-full rounded border border-gray-300 px-3 py-2"
                    value={editData.nextQuota || ""}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        nextQuota: Number(e.target.value),
                      })
                    }
                    required
                    min={1}
                  />
                </div>
                <div>
                  <label className="mb-1 block font-medium">วงเงินเพิ่ม</label>
                  <input
                    type="number"
                    className="w-full rounded border border-gray-300 px-3 py-2"
                    value={editData.extraQuota || ""}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        extraQuota: Number(e.target.value),
                      })
                    }
                    required
                    min={1}
                  />
                </div>
                <div>
                  <label className="mb-1 block font-medium">Transaction ID</label>
                  <input
                    type="text"
                    className="w-full rounded border border-gray-300 px-3 py-2"
                    value={editData.transactionId || ''}
                    onChange={(e) =>
                      setEditData({ ...editData, transactionId: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="mb-1 block font-medium">Status</label>
                  <input
                    type="text"
                    className="w-full rounded border border-gray-300 px-3 py-2"
                    value={editData.status || ""}
                    onChange={(e) =>
                      setEditData({ ...editData, status: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                className="mt-6 w-full rounded bg-green-600 py-2 font-semibold text-white hover:bg-green-700"
              >
                บันทึกการแก้ไข
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}