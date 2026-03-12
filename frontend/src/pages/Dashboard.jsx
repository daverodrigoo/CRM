import React from 'react';
import Navbar from '../components/Navbar'; // Assuming your Navbar is in the components folder!

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* This uses the exact same padding and margin as the Leads page 
        so the layout stays perfectly consistent across your app.
      */}
      <main className="pt-28 px-8 pb-12 max-w-[96%] mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        </div>

        {/* Placeholder container for when we build the dashboard later */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 flex flex-col items-center justify-center text-gray-400 min-h-[400px]">
          <span className="text-4xl mb-3">📊</span>
          <p className="font-medium">Dashboard metrics and charts will go here...</p>
        </div>
      </main>
    </div>
  );
}