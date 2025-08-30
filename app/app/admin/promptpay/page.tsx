"use client";

import { useState, useEffect } from "react";
import authFetch from "@/lib/authFetch";

export default function PromptPayPage() {
  const [promptpayNumber, setPromptpayNumber] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPromptPay = async () => {
      try {
        const res = await authFetch("/api/admin/promptpay");
        if (res.ok) {
          const data = await res.json();
          setPromptpayNumber(data.promptpayNumber || "");
        } else {
          const errData = await res.json();
          setError(errData.message || "Failed to fetch PromptPay number.");
        }
      } catch (err: unknown) {
        setError("An unexpected error occurred.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPromptPay();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const res = await authFetch("/api/admin/promptpay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ promptpayNumber }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage(data.message);
      } else {
        setError(data.message || "Failed to save PromptPay number.");
      }
    } catch (err: unknown) {
      setError("An unexpected error occurred.");
      console.error(err);
    }
  };

  if (loading) {
    return <div className="container mx-auto p-4">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-4 text-2xl font-bold">Edit PromptPay Number</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="promptpayNumber"
            className="block text-sm font-medium text-gray-700"
          >
            PromptPay Number
          </label>
          <input
            type="text"
            id="promptpayNumber"
            value={promptpayNumber}
            onChange={(e) => setPromptpayNumber(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none sm:text-sm"
          />
        </div>
        <button
          type="submit"
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none"
        >
          Save
        </button>
      </form>
      {message && <p className="mt-4 text-green-600">{message}</p>}
      {error && <p className="mt-4 text-red-500">{error}</p>}
    </div>
  );
}
