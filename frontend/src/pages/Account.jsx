import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

export default function Account() {
  const [user, setUser] = useState({ name: '', email: '', role: '', id: '' });
  const [passwords, setPasswords] = useState({ password: '', password_confirmation: '' });
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Retrieve user details from localStorage
    setUser({
      id: localStorage.getItem('USER_ID') || '',
      name: localStorage.getItem('USER_NAME') || 'System User',
      email: localStorage.getItem('USER_EMAIL') || 'user@company.com',
      role: localStorage.getItem('USER_ROLE') || 'Employee',
    });
  }, []);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });

    if (passwords.password !== passwords.password_confirmation) {
      setMessage({ text: 'Passwords do not match.', type: 'error' });
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.put(`http://localhost:8000/api/users/${user.id}/change-password`, passwords);
      setMessage({ text: response.data.message || 'Password changed successfully!', type: 'success' });
      setPasswords({ password: '', password_confirmation: '' }); // Clear form
    } catch (error) {
      setMessage({ 
        text: error.response?.data?.message || 'Failed to change password. Please ensure it is at least 8 characters long.', 
        type: 'error' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col">
      <Navbar />

      <main className="pt-28 px-8 pb-12 max-w-4xl mx-auto w-full flex-1">

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row">
          
          {/* User Details Section */}
          <div className="w-full md:w-1/2 p-8 border-b md:border-b-0 md:border-r border-gray-100 bg-gray-50/30">
            <h2 className="text-lg font-bold text-gray-800 mb-6">Profile Details</h2>
            
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Name</label>
                <div className="text-gray-800 font-medium text-lg">{user.name}</div>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Email Address</label>
                <div className="text-gray-800 font-medium text-lg">{user.email}</div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">System Role</label>
                <span className="inline-block bg-purple-100 text-[#7E3A99] font-bold px-3 py-1 rounded-full text-sm">
                  {user.role}
                </span>
              </div>
            </div>
          </div>

          {/* Change Password Section */}
          <div className="w-full md:w-1/2 p-8">
            <h2 className="text-lg font-bold text-gray-800 mb-6">Change Password</h2>

            {message.text && (
              <div className={`p-3 rounded-lg text-sm font-bold mb-6 ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {message.text}
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">New Password</label>
                <input 
                  type="password" 
                  required
                  minLength="8"
                  value={passwords.password}
                  onChange={(e) => setPasswords({...passwords, password: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-[#7E3A99] focus:border-[#7E3A99] transition-all"
                  placeholder="At least 8 characters"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Confirm New Password</label>
                <input 
                  type="password" 
                  required
                  value={passwords.password_confirmation}
                  onChange={(e) => setPasswords({...passwords, password_confirmation: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-[#7E3A99] focus:border-[#7E3A99] transition-all"
                  placeholder="Re-type new password"
                />
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-[#7E3A99] hover:bg-[#6c3182] text-white font-bold py-2.5 rounded-lg transition-colors mt-4 disabled:opacity-50"
              >
                {isLoading ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </div>

        </div>
      </main>
    </div>
  );
}