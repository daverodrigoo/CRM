import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

// Updated to exactly match your database columns
const emptyEmployeeForm = {
  id: '',
  name: '',
  email: '',
  role: 'Employee', 
  password: '',
};

const EmployeeForm = ({ formData, handleInputChange, isReadonly, isEditMode }) => {
  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-500">Full Name <span className="text-red-500">*</span></label>
          <input type="text" name="name" value={formData.name} onChange={handleInputChange} disabled={isReadonly} className="w-full border rounded p-2 text-sm disabled:bg-gray-50" placeholder="e.g. John Doe" />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-500">Email Address <span className="text-red-500">*</span></label>
          <input type="email" name="email" value={formData.email} onChange={handleInputChange} disabled={isReadonly} className="w-full border rounded p-2 text-sm disabled:bg-gray-50" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-500">User Role <span className="text-red-500">*</span></label>
          <select name="role" value={formData.role} onChange={handleInputChange} disabled={isReadonly} className="w-full border rounded p-2 text-sm disabled:bg-gray-50 bg-white">
            <option value="Employee">Employee</option>
            <option value="Admin">Admin</option>
            <option value="Super Admin">Super Admin</option>
          </select>
        </div>
        
        {!isReadonly && !isEditMode && (
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-500">Initial Password <span className="text-red-500">*</span></label>
            <input type="password" name="password" value={formData.password} onChange={handleInputChange} className="w-full border rounded p-2 text-sm" placeholder="Set account password..." />
          </div>
        )}
      </div>
    </div>
  );
};

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [formData, setFormData] = useState(emptyEmployeeForm);
  const [isEditMode, setIsEditMode] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState('10');

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Connected to real database
  const fetchEmployees = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/employees');
      setEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
      setErrorMsg("Failed to connect to the database to fetch employees.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    if (!formData.name || !formData.email) {
      setErrorMsg('Please fill out all required fields marked with an asterisk (*).');
      return false;
    }
    if (!isEditMode && !formData.password) {
      setErrorMsg('An initial password is required to create a new employee account.');
      return false;
    }
    setErrorMsg('');
    return true;
  };

  // Connected to real database
  const handleSaveNew = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    try {
      await axios.post('http://localhost:8000/api/employees', formData);
      fetchEmployees(); // Refresh the list from the database
      
      setIsAddOpen(false);
      setFormData(emptyEmployeeForm);
      setErrorMsg('');
    } catch (error) {
      console.error("Error saving employee:", error);
      setErrorMsg("Failed to save employee. Please try again.");
    }
  };

  const openViewModal = (employee) => {
    setSelectedEmployee(employee);
    setFormData({ ...employee, password: '' }); 
    setIsEditMode(false);
    setIsViewOpen(true);
    setErrorMsg('');
  };

  // Connected to real database
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    try {
      await axios.put(`http://localhost:8000/api/employees/${formData.id}`, formData);
      fetchEmployees(); // Refresh the list from the database
      
      setSelectedEmployee(formData);
      setIsEditMode(false);
      setErrorMsg('');
    } catch (error) {
      console.error("Error updating employee:", error);
      setErrorMsg("Failed to update employee.");
    }
  };

  // Connected to real database
  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:8000/api/employees/${selectedEmployee.id}`);
      fetchEmployees(); // Refresh the list from the database
      
      setIsDeleteOpen(false);
      setIsViewOpen(false);
      setErrorMsg('');
    } catch (error) {
      console.error("Error deleting employee:", error);
      setErrorMsg("Failed to delete employee.");
    }
  };

  const closeModals = () => {
    setIsAddOpen(false);
    setIsViewOpen(false);
    setIsEditMode(false);
    setErrorMsg('');
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
  };

  const filteredEmployees = employees.filter((emp) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      (emp.name || '').toLowerCase().includes(searchLower) ||
      (emp.email || '').toLowerCase().includes(searchLower) ||
      (emp.role || '').toLowerCase().includes(searchLower)
    );
  });

  const sortedEmployees = [...filteredEmployees].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const valA = (a[sortConfig.key] || '').toLowerCase();
    const valB = (b[sortConfig.key] || '').toLowerCase();
    if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
    if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const totalItems = sortedEmployees.length;
  const actualItemsPerPage = itemsPerPage === 'All' ? totalItems : parseInt(itemsPerPage, 10);
  const totalPages = actualItemsPerPage > 0 ? Math.ceil(totalItems / actualItemsPerPage) : 1;
  const startIndex = (currentPage - 1) * actualItemsPerPage;
  const endIndex = itemsPerPage === 'All' ? totalItems : Math.min(startIndex + actualItemsPerPage, totalItems);
  const currentEmployees = sortedEmployees.slice(startIndex, endIndex);

  const renderSortIcon = (columnKey) => {
    const isActive = sortConfig.key === columnKey;
    return (
      <span className={`text-xs ml-1 ${isActive ? 'text-white' : 'text-white/50 hover:text-white transition-colors'}`}>
        {isActive && sortConfig.direction === 'desc' ? '▲' : '▼'}
      </span>
    );
  };

  // Updated colors strictly for your 3 roles
  const getRoleBadgeColor = (role) => {
    switch(role) {
      case 'Super Admin': return 'bg-red-100 text-red-800';
      case 'Admin': return 'bg-orange-100 text-orange-800';
      case 'Employee': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="pt-28 px-8 pb-12 max-w-[96%] mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Employee Management</h1>
          
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7E3A99] focus:border-transparent text-sm w-64 shadow-sm"
            />
            <button 
              onClick={() => { setFormData(emptyEmployeeForm); setIsAddOpen(true); setErrorMsg(''); }} 
              className="bg-[#7E3A99] hover:bg-[#19a828] text-white px-5 py-2 rounded-md font-medium transition-colors shadow-sm text-sm"
            >
              + Add Employee
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm text-left">
            <thead className="bg-[#7E3A99] text-[#f8f7fa] font-semibold select-none">
              <tr>
                <th className="px-6 py-4 whitespace-nowrap cursor-pointer hover:bg-[#6c3282] transition-colors" onClick={() => handleSort('name')}>
                  <div className="flex items-center">Name {renderSortIcon('name')}</div>
                </th>
                <th className="px-6 py-4 whitespace-nowrap cursor-pointer hover:bg-[#6c3282] transition-colors" onClick={() => handleSort('email')}>
                  <div className="flex items-center">Email Address {renderSortIcon('email')}</div>
                </th>
                <th className="px-6 py-4 whitespace-nowrap cursor-pointer hover:bg-[#6c3282] transition-colors" onClick={() => handleSort('role')}>
                  <div className="flex items-center">Role {renderSortIcon('role')}</div>
                </th>
                <th className="px-6 py-4 text-center whitespace-nowrap">Action</th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-gray-200">
              {currentEmployees.map((emp) => (
                <tr key={emp.id} className="odd:bg-white even:bg-gray-50 hover:bg-gray-100 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{emp.name}</td>
                  <td className="px-6 py-4 text-gray-600">{emp.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getRoleBadgeColor(emp.role)}`}>
                      {emp.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button onClick={() => openViewModal(emp)} className="text-[#7E3A99] hover:text-[#19a828] font-bold transition-colors">
                      View / Edit
                    </button>
                  </td>
                </tr>
              ))}
              {currentEmployees.length === 0 && (
                <tr><td colSpan="4" className="px-6 py-8 text-center text-gray-500">No employees found.</td></tr>
              )}
            </tbody>
          </table>

          {/* Pagination Footer */}
          <div className="flex justify-end items-center px-6 py-3 border-t border-gray-200 bg-gray-50 text-sm text-gray-600 gap-6 select-none rounded-b-lg">
            <div className="flex items-center gap-2">
              <span className="font-medium">Items per page:</span>
              <select value={itemsPerPage} onChange={(e) => setItemsPerPage(e.target.value)} className="border border-gray-300 rounded p-1 focus:outline-none focus:ring-1 focus:ring-[#7E3A99] bg-white cursor-pointer">
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="All">All</option>
              </select>
            </div>
            <div className="font-medium min-w-[80px] text-right">
              {totalItems === 0 ? '0-0 of 0' : `${startIndex + 1}-${endIndex} of ${totalItems}`}
            </div>
            <div className="flex items-center gap-2 ml-2">
              <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1 || totalItems === 0} className="px-3 py-1.5 bg-white border border-gray-300 rounded shadow-sm text-gray-700 hover:bg-gray-50 disabled:opacity-40 font-bold">&lt;</button>
              <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages || totalItems === 0} className="px-3 py-1.5 bg-white border border-gray-300 rounded shadow-sm text-gray-700 hover:bg-gray-50 disabled:opacity-40 font-bold">&gt;</button>
            </div>
          </div>
        </div>
      </main>

      {/* Add Employee Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden">
            <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
              <h2 className="text-xl font-bold text-gray-800">Add New Employee</h2>
              <button onClick={closeModals} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
            </div>
            <div className="p-6">
              <EmployeeForm formData={formData} handleInputChange={handleInputChange} isReadonly={false} isEditMode={false} />
            </div>
            <div className="px-6 py-4 border-t bg-gray-50 flex justify-between items-center">
              <div className="text-red-600 text-sm font-semibold">{errorMsg && !errorMsg.includes('database') ? errorMsg : ''}</div>
              <div className="flex gap-3">
                <button onClick={closeModals} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md">Cancel</button>
                <button onClick={handleSaveNew} className="px-6 py-2 bg-[#7E3A99] hover:bg-[#19a828] text-white rounded-md font-medium transition-colors">Create Account</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View/Edit Employee Modal */}
      {isViewOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden">
            <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
              <h2 className="text-xl font-bold text-gray-800">{isEditMode ? 'Edit Employee' : 'Employee Details'}</h2>
              <button onClick={closeModals} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
            </div>
            <div className="p-6">
              <EmployeeForm formData={formData} handleInputChange={handleInputChange} isReadonly={!isEditMode} isEditMode={isEditMode} />
            </div>
            <div className="px-6 py-4 border-t bg-gray-50 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <button onClick={() => setIsDeleteOpen(true)} className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-md font-medium transition-colors">Delete Employee</button>
                <span className="text-red-600 text-sm font-semibold">{errorMsg && !errorMsg.includes('database') ? errorMsg : ''}</span>
              </div>
              <div className="flex gap-3">
                {!isEditMode ? (
                  <>
                    <button onClick={closeModals} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md">Close</button>
                    <button onClick={() => setIsEditMode(true)} className="px-6 py-2 bg-[#7E3A99] hover:bg-[#19a828] text-white rounded-md font-medium transition-colors">Edit Details</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => { setFormData(selectedEmployee); setIsEditMode(false); setErrorMsg(''); }} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md">Cancel</button>
                    <button onClick={handleSaveEdit} className="px-6 py-2 bg-[#7E3A99] hover:bg-[#19a828] text-white rounded-md font-medium transition-colors">Save Changes</button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[110] p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-sm p-6 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-500 text-3xl">⚠️</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Employee?</h3>
            <p className="text-sm text-gray-500 mb-6">Are you sure you want to delete {selectedEmployee?.name}? They will lose access to the system. This cannot be undone.</p>
            <div className="flex justify-center gap-3">
              <button onClick={() => setIsDeleteOpen(false)} className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md font-medium flex-1 transition-colors">No, Cancel</button>
              <button onClick={confirmDelete} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md font-medium flex-1 transition-colors">Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}