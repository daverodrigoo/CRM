import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from '../assets/logo.png';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setErrorMsg('Please enter both your email and password.');
      return;
    }

    setErrorMsg('');

    try {
      // 1. Send the email and password to Laravel
      const response = await axios.post('http://localhost:8000/api/login', {
        email: email,
        password: password
      });

      // 2. If successful, Laravel sends back the user data and a secure token
      const { user, token } = response.data;

      // 3. Save the token and user role in the browser's local storage
      // This allows the browser to "remember" who is logged in and what their role is
      localStorage.setItem('AUTH_TOKEN', token);
      localStorage.setItem('USER_ROLE', user.role);
      localStorage.setItem('USER_NAME', user.name);

      // 4. Redirect the user to the Leads page!
      navigate('/dashboard');

    } catch (error) {
      console.error("Login error:", error);
      // Display the specific error message from Laravel (e.g., "Invalid email or password")
      const backendError = error.response?.data?.message || 'Failed to connect to the server.';
      setErrorMsg(backendError);
    }
  };

  const handleForgotPassword = () => {
    console.log('Forgot password clicked');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-gray-100">
        <div className="p-8 md:p-10">
          <div className="text-center mb-8">
            <img src={logo} alt="CHIMES CRM Logo" className="mx-auto h-16 w-auto mb-4 object-contain" />
          </div>

          {errorMsg && (
            <div className="mb-6 p-3 bg-red-50 text-red-600 rounded-lg text-sm text-center font-medium border border-red-100">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-600">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#7E3A99] focus:border-transparent transition-all"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-600">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#7E3A99] focus:border-transparent transition-all"
              />
            </div>

            <div className="flex justify-end pt-1">
              <button type="button" onClick={handleForgotPassword} className="text-sm font-semibold text-[#7E3A99] hover:text-[#19a828] transition-colors">
                Forgot Password?
              </button>
            </div>

            <button type="submit" className="w-full bg-[#7E3A99] hover:bg-[#19a828] text-white font-bold py-3 rounded-lg transition-colors shadow-md mt-2">
              Log In
            </button>
          </form>
        </div>
        
        <div className="bg-gray-50 px-8 py-4 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-400">Secure access for authorized personnel only.</p>
        </div>
      </div>
    </div>
  );
}