import React, { useState } from 'react';
import axios from 'axios';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setErrorMsg('');
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:8000/api/forgot-password', { email });
      setMessage(response.data.message);
      setEmail(''); // Clear the input
    } catch (error) {
      setErrorMsg(error.response?.data?.error || "Failed to connect to the server.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">Forgot Password?</h2>
        <p className="text-sm text-gray-500 text-center mb-6">
          Enter your email address and we'll send you a link to reset your password.
        </p>

        {message && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded border border-green-300 text-sm font-medium text-center">{message}</div>}
        {errorMsg && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded border border-red-300 text-sm font-medium text-center">{errorMsg}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7E3A99] focus:border-transparent outline-none transition-all"
              placeholder="admin@chimescrm.com"
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-[#7E3A99] hover:bg-[#6c3282] text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <a href="/login" className="text-sm font-semibold text-[#7E3A99] hover:text-[#19a828] transition-colors">
            &larr; Back to Login
          </a>
        </div>
      </div>
    </div>
  );
}