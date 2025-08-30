"use client";

import { useState, useEffect } from "react";
import authFetch from "@/lib/authFetch";

const LineSettingPage = () => {
  const [lineId, setLineId] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLineId = async () => {
      try {
        // This is the public endpoint, so standard fetch is fine.
        const res = await fetch("/api/line-setting");
        if (res.ok) {
          const { data } = await res.json();
          setLineId(data.value);
        } else {
          setError("Failed to fetch current Line ID.");
        }
      } catch (error) {
        console.error("Failed to fetch Line ID", error);
        setError("An error occurred while fetching the Line ID.");
      }
    };
    fetchLineId();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      // This is a protected endpoint, so we use authFetch.
      const res = await authFetch("/api/admin/line-setting", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value: lineId }),
      });
      if (res.ok) {
        setMessage("Line ID updated successfully!");
      } else {
        const errorData = await res.json().catch(() => null);
        setError(errorData?.message || "Failed to update Line ID");
      }
    } catch (err) {
      // AuthError is handled by authFetch (redirect), so we only catch other errors.
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
      console.error("An error occurred", err);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-4 text-2xl font-bold">Line ID Setting</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="lineId"
            className="block text-sm font-medium text-gray-700"
          >
            Line ID
          </label>
          <input
            type="text"
            id="lineId"
            value={lineId}
            onChange={(e) => setLineId(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none sm:text-sm"
          />
        </div>
        <button
          type="submit"
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          Save
        </button>
      </form>
      {message && <p className="mt-4 text-sm text-green-600">{message}</p>}
      {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default LineSettingPage;