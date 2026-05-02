import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

export default function MeetingsBooked() {
  const [meetings, setMeetings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMyBookedMeetings();
  }, []);

  const fetchMyBookedMeetings = async () => {
    const userId = localStorage.getItem('USER_ID');
    
    if (!userId) {
      setError("User ID not found. Please log in again.");
      setIsLoading(false);
      return;
    }

    try {
      // Fetching live data from our backend
      const response = await axios.get(`http://localhost:8000/api/meetings/employee-booked/${userId}`);
      setMeetings(response.data);
    } catch (err) {
      console.error("Error fetching booked meetings:", err);
      setError("Failed to load your booked meetings from the server.");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Deal Closed': return 'bg-green-100 text-green-700 border-green-200';
      case 'Deal Lost': return 'bg-red-100 text-red-700 border-red-200';
      case 'Meeting Completed': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Upcoming': return 'bg-purple-100 text-[#7E3A99] border-purple-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="pt-28 px-8 pb-12 max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Booked Meetings</h1>
          <p className="text-gray-500 mt-2 font-medium">Track the live status of the meetings you have successfully scheduled.</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto"> 
            <table className="min-w-full text-sm text-left border-collapse">
              <thead className="bg-[#7E3A99] text-white select-none">
                <tr>
                  <th className="px-6 py-4 font-semibold tracking-wider whitespace-nowrap">Business Name</th>
                  <th className="px-6 py-4 font-semibold tracking-wider whitespace-nowrap text-center">Meeting Date</th>
                  <th className="px-6 py-4 font-semibold tracking-wider whitespace-nowrap text-center">Meeting Time</th>
                  <th className="px-6 py-4 font-semibold tracking-wider whitespace-nowrap text-center">Live Status</th>
                </tr>
              </thead>
              
              <tbody className="bg-white divide-y divide-gray-100">
                {isLoading ? (
                  <tr><td colSpan="4" className="px-6 py-16 text-center text-gray-500 font-medium">Loading your scheduled meetings...</td></tr>
                ) : error ? (
                  <tr><td colSpan="4" className="px-6 py-16 text-center text-red-500 font-bold">{error}</td></tr>
                ) : meetings.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-20 text-center">
                      <div className="text-gray-300 mb-3"><svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg></div>
                      <p className="text-gray-600 font-bold text-lg">No meetings booked yet</p>
                      <p className="text-gray-400 mt-1 font-medium">When you schedule a meeting with an Admin, it will appear here.</p>
                    </td>
                  </tr>
                ) : (
                  meetings.map((meeting, index) => (
                    <tr key={index} className="hover:bg-purple-50/40 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap font-bold text-[#7E3A99] text-base">{meeting.Business_Name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-gray-700 font-medium">{meeting.Meeting_Date ? new Date(meeting.Meeting_Date).toLocaleDateString() : 'TBD'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-gray-700 font-medium">{meeting.Meeting_Time || 'TBD'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className={`inline-flex px-3 py-1 text-[11px] font-bold uppercase tracking-wider rounded-full ${getStatusColor(meeting.Display_Status)}`}>
                          {meeting.Display_Status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}