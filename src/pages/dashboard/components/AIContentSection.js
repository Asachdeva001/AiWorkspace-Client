import React from 'react';

export default function AIContentSection() {
  return (
    <section className="mb-10">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
        <h2 className="text-2xl font-bold text-gray-800">AI Content Generation</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">New Content</button>
      </div>
      <div className="w-full bg-white rounded shadow overflow-hidden p-6 text-gray-500 text-center">
        {'AI content will be shown here.'}
      </div>
      <div className="mt-6">
        <h3 className="font-semibold text-lg mb-2">Prompt Templates</h3>
        <div className="flex gap-2 mb-2">
          <input className="border rounded px-3 py-2 flex-1" placeholder="New template name..." />
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Add Template</button>
        </div>
        <ul className="list-disc list-inside text-gray-700">
          <li>Prompt templates will be shown here.</li>
        </ul>
      </div>
    </section>
  );
} 