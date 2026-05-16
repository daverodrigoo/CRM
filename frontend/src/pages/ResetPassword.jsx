import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Extract the hidden credentials from the email link
  const email = searchParams.get('email');
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [message, setMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setErrorMsg('');

    // Safety check before hitting the API
    if (password !== passwordConfirmation) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      // Send the token, email, and the new password back to the Laravel route we built earlier
      const response = await axios.post('http://localhost:8000/api/reset-password', {
        email: email,
        token: token,
        password: password,
        password_confirmation: passwordConfirmation 
      });

      setMessage(response.data.message + " Redirecting to login...");
      
      // Send them back to the login page after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);

    } catch (error) {
      setErrorMsg(error.response?.data?.error || "Failed to reset password. The link may be expired.");
    } finally {
      setIsLoading(false);
    }
  };

  // If someone manually types /reset-password without clicking an email link, stop them.
  if (!email || !token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center">
          <h2 className="text-xl font-bold text-red-600 mb-2">Invalid Link</h2>
          <p className="text-gray-600">Please request a new password reset link.</p>
          <button onClick={() => navigate('/forgot-password')} className="mt-4 text-[#7E3A99] font-bold hover:underline">
            Go back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">Create New Password</h2>
        <p className="text-sm text-gray-500 text-center mb-6">
          Please enter your new password for <br/><span className="font-bold text-[#7E3A99]">{email}</span>
        </p>

        {message && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded border border-green-300 text-sm font-medium text-center">{message}</div>}
        {errorMsg && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded border border-red-300 text-sm font-medium text-center">{errorMsg}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">New Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required
              minLength="8"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7E3A99] focus:border-transparent outline-none transition-all"
              placeholder="Minimum 8 characters"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Confirm New Password</label>
            <input 
              type="password" 
              value={passwordConfirmation} 
              onChange={(e) => setPasswordConfirmation(e.target.value)} 
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7E3A99] focus:border-transparent outline-none transition-all"
              placeholder="Confirm new password"
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading || message}
            className="w-full bg-[#7E3A99] hover:bg-[#6c3282] text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 mt-2"
          >
            {isLoading ? 'Updating...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
}