'use client';

import { useState, useEffect } from 'react';

const LineSettingPage = () => {
  const [lineId, setLineId] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchLineId = async () => {
      try {
        const res = await fetch('/api/admin/line-setting');
        if (res.ok) {
          const { data } = await res.json();
          setLineId(data.value);
        }
      } catch (error) {
        console.error('Failed to fetch Line ID', error);
      }
    };
    fetchLineId();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/line-setting', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: lineId }),
      });
      if (res.ok) {
        setMessage('Line ID updated successfully!');
      } else {
        setMessage('Failed to update Line ID');
      }
    } catch (error) {
      console.error('An error occurred', error);
      setMessage('An error occurred');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Line ID Setting</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="lineId" className="block text-sm font-medium text-gray-700">Line ID</label>
          <input
            type="text"
            id="lineId"
            value={lineId}
            onChange={(e) => setLineId(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Save
        </button>
      </form>
      {message && <p className="mt-4 text-sm text-gray-600">{message}</p>}
    </div>
  );
};

export default LineSettingPage;