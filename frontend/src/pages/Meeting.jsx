import React from 'react';
import Navbar from '../components/Navbar';

export default function Meeting() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="pt-28 px-8 pb-12 max-w-[96%] mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Meetings</h1>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center text-gray-500">
          <p>This is the blank Meetings page. Content coming soon!</p>
        </div>
      </main>
    </div>
  );
}