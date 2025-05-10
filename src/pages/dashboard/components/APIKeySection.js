import React from 'react';

export default function APIKeySection() {
  return (
    <section className="mb-10">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">API Key Management</h2>
      <div className="bg-white rounded shadow p-4 flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex-1">
          <div className="mb-2 font-semibold">Current API Key (Azure OpenAI):</div>
          <input className="border rounded px-3 py-2 w-full" type="password" value="••••••••••••••••" readOnly />
        </div>
        <div className="flex flex-col gap-2 md:ml-4">
          <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300">Show</button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Change Key</button>
          <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Use My Own Key</button>
        </div>
      </div>
    </section>
  );
} 