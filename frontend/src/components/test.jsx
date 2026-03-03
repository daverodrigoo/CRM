import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path) => {
    return location.pathname === path 
      ? "text-black font-semibold" 
      : "text-gray-500 hover:text-black";
  };

  return (
    <div className="fixed top-0 w-full z-50 px-4 py-4 sm:px-6 lg:px-8 transition-all duration-300">
      {/* Frosted Glass Pill Navbar */}
      <nav className={`mx-auto max-w-5xl rounded-full border border-gray-200/50 bg-white/70 backdrop-blur-md flex items-center justify-between px-6 py-3 transition-shadow duration-300 ${scrolled ? 'shadow-lg shadow-gray-200/40' : 'shadow-sm'}`}>
        
        {/* Left: Logo Area */}
        <Link to="/dashboard" className="flex items-center gap-2 group cursor-pointer">
          <div className="w-9 h-9 bg-black rounded-full flex items-center justify-center text-white font-bold text-lg group-hover:bg-gray-800 transition-colors">
            C
          </div>
          <span className="font-bold text-lg tracking-tight text-gray-900">
            CHIMES
          </span>
        </Link>

        {/* Center: Navigation Links */}
        <div className="hidden md:flex items-center space-x-8 text-sm font-medium">
          <Link to="/dashboard" className={`transition-all duration-200 ${isActive('/dashboard')}`}>
            Dashboard
          </Link>
          <Link to="/leads" className={`transition-all duration-200 ${isActive('/leads')}`}>
            Leads
          </Link>
          <Link to="/employees" className={`transition-all duration-200 ${isActive('/employees')}`}>
            Employees
          </Link>
        </div>

        {/* Right: Logout Button */}
        <div className="flex items-center">
          <Link 
            to="/" 
            className="bg-black hover:bg-gray-800 text-white text-sm font-semibold px-6 py-2.5 rounded-full transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
          >
            LOGOUT
          </Link>
        </div>
        
      </nav>
    </div>
  );
}