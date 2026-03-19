import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

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
        { name: 'Leads', path: '/leads' },
        { name: 'Meeting', path: '/meeting' },
        { 
          name: 'Employees', 
          path: '/employees',
          dropdown: [
            { name: 'Management', path: '/employees' },
            { name: 'Assigned Leads', path: '/assigned-leads' }
          ]
        }
      ];
    } else if (userRole === 'Admin') {
      // Admin Role Navbar Configuration
      return [
        { name: 'Dashboard', path: '/dashboard' },
        { name: 'Leads', path: '/leads' },
        { name: 'Assigned Leads', path: '/employee-assigned-leads' }
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

  const isItemActive = (item) => {
    if (location.pathname === item.path) return true;
    if (item.dropdown && item.dropdown.some(sub => location.pathname === sub.path)) return true;
    return false;
  };

  const handleLogout = () => {
    localStorage.clear(); 
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

      <div className="flex-1 flex items-center justify-end">
        <button onClick={handleLogout} className="bg-[#7E3A99] hover:bg-[#19a828] text-white uppercase tracking-widest rounded-full px-8 py-2.5 text-xs font-bold transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5">
          LOGOUT
        </button>
      </div>
      
    </nav>
  );
}