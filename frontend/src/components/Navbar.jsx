import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/logo.png';

export default function Navbar() {
  const location = useLocation();

  // UPDATED: Added the Meeting route here
  const navItems = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Leads', path: '/leads' },
    { name: 'Meeting', path: '/meeting' },
    { name: 'Employees', path: '/employees' }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="flex items-center justify-between px-6 lg:px-12 py-4 bg-[#f8fbfa] shadow-sm sticky top-0 z-50">
      
      <div className="flex-1 flex items-center justify-start">
        <Link to="/dashboard" className="transition-transform hover:scale-105 duration-300">
          <img src={logo} alt="Company Logo" className="h-[45px] object-contain" />
        </Link>
      </div>

      <ul className="hidden md:flex justify-center items-center gap-12 m-0 p-0">
        {navItems.map((item) => (
          <li key={item.name}>
            <Link
              to={item.path}
              className={`relative text-xs font-bold uppercase tracking-widest cursor-pointer pb-2 transition-colors duration-300 hover:text-[#19a828] ${
                isActive(item.path) ? 'text-[#7E3A99]' : 'text-gray-500'
              }`}
            >
              {item.name}
              
              {isActive(item.path) && (
                <span className="absolute left-0 -bottom-1 w-full h-[3px] bg-[#7E3A99] rounded-t-md"></span>
              )}
            </Link>
          </li>
        ))}
      </ul>

      <div className="flex-1 flex items-center justify-end">
        <Link to="/">
          <button className="bg-[#7E3A99] hover:bg-[#19a828] text-white uppercase tracking-widest rounded-full px-8 py-2.5 text-xs font-bold transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5">
            LOGOUT
          </button>
        </Link>
      </div>
      
    </nav>
  );
}