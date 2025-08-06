'use client';

import { useState, useEffect } from 'react';

export default function PromptPayPage() {
  const [promptpayNumber, setPromptpayNumber] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/admin/promptpay')
      .then((res) => res.json())
      .then((data) => setPromptpayNumber(data.promptpayNumber));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/admin/promptpay', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ promptpayNumber }),
    });
    const data = await res.json();
    setMessage(data.message);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit PromptPay Number</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="promptpayNumber" className="block text-sm font-medium text-gray-700">
            PromptPay Number
          </label>
          <input
            type="text"
            id="promptpayNumber"
            value={promptpayNumber}
            onChange={(e) => setPromptpayNumber(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Save
        </button>
      </form>
      {message && <p className="mt-4 text-green-600">{message}</p>}
    </div>
  );
}
