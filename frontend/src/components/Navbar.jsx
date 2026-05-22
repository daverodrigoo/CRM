import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import { useState, useRef, useEffect } from 'react';

// Smart function to properly extract the role from your Login.jsx session
const getStoredRole = () => {
  try {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const userObj = JSON.parse(userStr);
      return userObj.role || 'Super Admin';
    }
  } catch (e) {
    console.error("Error parsing user from local storage", e);
  }
  return 'Super Admin'; // Fallback
};

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const userRole = localStorage.getItem('USER_ROLE') || getStoredRole();

  const getNavItems = () => {
    if (userRole === 'Super Admin') {
      return [
        { name: 'Dashboard', path: '/dashboard' },
        { 
          name: 'Leads', 
          path: '/leads',
          dropdown: [
            { name: 'Leads', path: '/leads' },
            { name: 'Assigned Leads', path: '/employee-assigned-leads'}
          ]
        },
        { 
          name: 'Meeting', 
          path: '/meeting',
          dropdown: [
            { name: 'My Meetings', path: '/meeting' },
            { name: 'Meetings Booked', path: '/meetings-booked'  }
          ]
        },
        { 
          name: 'Employees', 
          path: '/employees',
          dropdown: [
            { name: 'Management', path: '/employees' },
            { name: 'Assigned Leads', path: '/assigned-leads' }
          ]
        }
      ];
    } 
    else if (userRole === 'Admin') {
      return [
        { name: 'Dashboard', path: '/dashboard' },
        { name: 'Leads', path: '/leads' },
        { name: 'My Meetings', path: '/meeting' },
        { 
          name: 'Employees', 
          path: '/employees',
          dropdown: [
            { name: 'Management', path: '/employees' },
            { name: 'Assigned Leads', path: '/assigned-leads' }
          ]
        }
      ];
    } else if (userRole === 'Employee') {
      // Admin Role Navbar Configuration
      return [
        { name: 'Dashboard', path: '/dashboard' },
        { name: 'Leads', path: '/leads' },
        { name: 'Assigned Leads', path: '/employee-assigned-leads' },
        { name: 'Meetings Booked', path: '/meetings-booked' }
      ];
    } else {
      // Viewer Role Navbar Configuration
      return [
        { name: 'Dashboard', path: '/dashboard' },
        { name: 'Leads', path: '/leads' },
        // Updated to point strictly to AssignedLeads.jsx!
        { name: 'Assigned Leads', path: '/assigned-leads' }
      ];
    }
  };

  const navItems = getNavItems();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isItemActive = (item) => {
    if (location.pathname === item.path) return true;
    if (item.dropdown && item.dropdown.some(sub => location.pathname === sub.path)) return true;
    return false;
  };

  const handleLogout = () => {
    localStorage.removeItem('AUTH_TOKEN');
    localStorage.removeItem('USER_ROLE');
    localStorage.removeItem('USER_NAME');
    localStorage.removeItem('USER_EMAIL');
    localStorage.removeItem('USER_ID');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <nav className="flex items-center justify-between px-6 lg:px-12 py-4 bg-[#f8fbfa] shadow-sm sticky top-0 z-50">
      
      <div className="flex-1 flex items-center justify-start">
        <Link to="/dashboard" className="transition-transform hover:scale-105 duration-300">
          <img src={logo} alt="Company Logo" className="h-[45px] object-contain" />
        </Link>
      </div>

      <ul className="hidden md:flex justify-center items-center gap-12 m-0 p-0">
        {navItems.map((item) => (
          <li key={item.name} className={item.dropdown ? "relative group" : ""}>
            <Link
              to={item.path}
              className={`relative flex items-center gap-1 text-xs font-bold uppercase tracking-widest cursor-pointer pb-2 transition-colors duration-300 hover:text-[#19a828] ${
                isItemActive(item) ? 'text-[#7E3A99]' : 'text-gray-500'
              }`}
            >
              {item.name}
              
              {item.dropdown && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transition-transform duration-300 group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              )}
              
              {isItemActive(item) && (
                <span className="absolute left-0 -bottom-1 w-full h-[3px] bg-[#7E3A99] rounded-t-md"></span>
              )}
            </Link>

            {item.dropdown && (
              <div className="absolute left-1/2 -translate-x-1/2 top-full pt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 min-w-[180px]">
                <div className="bg-white border border-gray-100 rounded-lg shadow-xl py-2 flex flex-col">
                  {item.dropdown.map((subItem) => (
                    <Link 
                      key={subItem.name}
                      to={subItem.path} 
                      className={`px-5 py-3 text-xs font-bold uppercase tracking-widest transition-colors duration-300 hover:bg-[#f8fbfa] hover:text-[#19a828] ${
                        location.pathname === subItem.path ? 'text-[#7E3A99] bg-[#f8fbfa]' : 'text-gray-500'
                      }`}
                    >
                      {subItem.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>

      {/* Profile Dropdown */}
          <div className="flex-1 flex items-center justify-end" ref={dropdownRef}>
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-10 h-10 rounded-full bg-[#7E3A99] text-white flex items-center justify-center font-bold shadow-sm hover:bg-[#6c3182] transition-colors outline-none focus:ring-2 focus:ring-purple-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
              </svg>
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 top-[70%] mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50 animate-fade-in-down">
                <Link 
                  to="/account" 
                  onClick={() => setIsDropdownOpen(false)}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-[#7E3A99] transition-colors font-medium"
                >
                  My Account
                </Link>
                <button 
                  onClick={handleLogout} /* Replace handleLogout with your exact logout function name if it's different */
                  className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
      
    </nav>
  );
}