import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

const emptyForm = {
  Lead_ID: '', Date_Added: '', Business_Name: '', 
  Contact_Person_First_Name: '', Contact_Last_Name: '', Contact_Person_Phone: '', Contact_Person_Email: '',
  Business_Owner_First_Name: '', Business_Owner_Last_Name: '', Business_Owner_Phone: '', Business_Owner_Email: '',
  Business_Phone: '', Business_Email: '', Tab_Category: '',
  Solution_Needed: '', Website_Link: '', Industry: '', Source: '', 
  Social_Media: [''], Remarks: ''
};

const LeadForm = ({ formData, handleInputChange, handleSocialMediaChange, addSocialMedia, removeSocialMedia, isReadonly, isEditMode }) => {
  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1"><label className="text-xs font-semibold text-gray-500">Business Name <span className="text-red-500">*</span></label><input type="text" name="Business_Name" value={formData.Business_Name} onChange={handleInputChange} disabled={isReadonly} className="w-full border rounded p-2 text-sm disabled:bg-gray-50" /></div>
        <div className="space-y-1"><label className="text-xs font-semibold text-gray-500">Industry <span className="text-red-500">*</span></label><input type="text" name="Industry" value={formData.Industry} onChange={handleInputChange} disabled={isReadonly} className="w-full border rounded p-2 text-sm disabled:bg-gray-50" /></div>
        <div className="space-y-1"><label className="text-xs font-semibold text-gray-500">Date Added</label><input type="date" name="Date_Added" value={formData.Date_Added} onChange={handleInputChange} disabled={true} className="w-full border rounded p-2 text-sm disabled:bg-gray-50" /></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1"><label className="text-xs font-semibold text-gray-500">Business Phone</label><input type="text" name="Business_Phone" value={formData.Business_Phone} onChange={handleInputChange} disabled={isReadonly} className="w-full border rounded p-2 text-sm disabled:bg-gray-50" /></div>
        <div className="space-y-1"><label className="text-xs font-semibold text-gray-500">Business Email</label><input type="email" name="Business_Email" value={formData.Business_Email} onChange={handleInputChange} disabled={isReadonly} className="w-full border rounded p-2 text-sm disabled:bg-gray-50" /></div>
        <div className="space-y-1"><label className="text-xs font-semibold text-gray-500">Website Link</label><input type="text" name="Website_Link" value={formData.Website_Link} onChange={handleInputChange} disabled={isReadonly} className="w-full border rounded p-2 text-sm disabled:bg-gray-50" /></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 border border-gray-200 rounded-lg p-4 bg-gray-50/50">
        <h3 className="col-span-1 md:col-span-4 text-sm font-bold text-gray-700 border-b pb-2 mb-2">Business Owner</h3>
        <div className="space-y-1"><label className="text-xs font-semibold text-gray-500">First Name</label><input type="text" name="Business_Owner_First_Name" value={formData.Business_Owner_First_Name} onChange={handleInputChange} disabled={isReadonly} className="w-full border rounded p-2 text-sm disabled:bg-gray-50 bg-white" /></div>
        <div className="space-y-1"><label className="text-xs font-semibold text-gray-500">Last Name</label><input type="text" name="Business_Owner_Last_Name" value={formData.Business_Owner_Last_Name} onChange={handleInputChange} disabled={isReadonly} className="w-full border rounded p-2 text-sm disabled:bg-gray-50 bg-white" /></div>
        <div className="space-y-1"><label className="text-xs font-semibold text-gray-500">Phone</label><input type="text" name="Business_Owner_Phone" value={formData.Business_Owner_Phone} onChange={handleInputChange} disabled={isReadonly} className="w-full border rounded p-2 text-sm disabled:bg-gray-50 bg-white" /></div>
        <div className="space-y-1"><label className="text-xs font-semibold text-gray-500">Email</label><input type="email" name="Business_Owner_Email" value={formData.Business_Owner_Email} onChange={handleInputChange} disabled={isReadonly} className="w-full border rounded p-2 text-sm disabled:bg-gray-50 bg-white" /></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 border border-gray-200 rounded-lg p-4 bg-gray-50/50">
        <h3 className="col-span-1 md:col-span-4 text-sm font-bold text-gray-700 border-b pb-2 mb-2">Contact Person</h3>
        <div className="space-y-1"><label className="text-xs font-semibold text-gray-500">First Name</label><input type="text" name="Contact_Person_First_Name" value={formData.Contact_Person_First_Name} onChange={handleInputChange} disabled={isReadonly} className="w-full border rounded p-2 text-sm disabled:bg-gray-50 bg-white" /></div>
        <div className="space-y-1"><label className="text-xs font-semibold text-gray-500">Last Name</label><input type="text" name="Contact_Last_Name" value={formData.Contact_Last_Name} onChange={handleInputChange} disabled={isReadonly} className="w-full border rounded p-2 text-sm disabled:bg-gray-50 bg-white" /></div>
        <div className="space-y-1"><label className="text-xs font-semibold text-gray-500">Phone</label><input type="text" name="Contact_Person_Phone" value={formData.Contact_Person_Phone} onChange={handleInputChange} disabled={isReadonly} className="w-full border rounded p-2 text-sm disabled:bg-gray-50 bg-white" /></div>
        <div className="space-y-1"><label className="text-xs font-semibold text-gray-500">Email</label><input type="email" name="Contact_Person_Email" value={formData.Contact_Person_Email} onChange={handleInputChange} disabled={isReadonly} className="w-full border rounded p-2 text-sm disabled:bg-gray-50 bg-white" /></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1"><label className="text-xs font-semibold text-gray-500">Source</label>
          <select name="Source" value={formData.Source} onChange={handleInputChange} disabled={isReadonly} className="w-full border rounded p-2 text-sm disabled:bg-gray-50 bg-white">
            <option value="">Select a source...</option>
            <option value="Instagram">Instagram</option>
            <option value="Facebook">Facebook</option>
            <option value="TikTok">TikTok</option>
            <option value="Email">Email</option>
            <option value="LinkedIn">LinkedIn</option>
            <option value="Twitter/X">Twitter/X</option>
            <option value="Website">Website</option>
            <option value="Referral">Referral</option>
            <option value="WhatsApp">WhatsApp</option>
            <option value="Cold Call">Cold Call</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="space-y-1"><label className="text-xs font-semibold text-gray-500">Tab Category</label><input type="text" name="Tab_Category" value={formData.Tab_Category} onChange={handleInputChange} disabled={isReadonly} className="w-full border rounded p-2 text-sm disabled:bg-gray-50" /></div>
      </div>

      <div className="space-y-2 border-t pt-4 mt-2">
        <label className="text-xs font-semibold text-gray-500 block">Social Media Links</label>
        {formData.Social_Media.map((url, index) => (
          <div key={index} className="flex gap-2">
            <input type="text" placeholder="https://..." value={url} onChange={(e) => handleSocialMediaChange(index, e.target.value)} disabled={isReadonly} className="flex-1 border rounded p-2 text-sm disabled:bg-gray-50" />
            {!isReadonly && formData.Social_Media.length > 1 && (
              <button type="button" onClick={() => removeSocialMedia(index)} className="px-3 py-2 bg-red-100 text-red-600 hover:bg-red-200 rounded text-sm font-semibold transition-colors">X</button>
            )}
          </div>
        ))}
        {!isReadonly && (
          <button type="button" onClick={addSocialMedia} className="text-xs font-bold text-[#7E3A99] hover:text-[#19a828] transition-colors mt-1 inline-block">+ Add Social Media</button>
        )}
      </div>

      <div className="space-y-1 border-t pt-4 mt-2"><label className="text-xs font-semibold text-gray-500">Solution Needed</label><textarea name="Solution_Needed" value={formData.Solution_Needed} onChange={handleInputChange} disabled={isReadonly} className="w-full border rounded p-2 text-sm disabled:bg-gray-50 h-24"></textarea></div>
      <div className="space-y-1"><label className="text-xs font-semibold text-gray-500">Remarks</label><textarea name="Remarks" value={formData.Remarks} onChange={handleInputChange} disabled={isReadonly} className="w-full border rounded p-2 text-sm disabled:bg-gray-50 h-24"></textarea></div>
    </div>
  );
};

export default function AssignedLeads() {
  const [leads, setLeads] = useState([]); 
  const [searchTerm, setSearchTerm] = useState(''); 
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false); 
  
  const [selectedLead, setSelectedLead] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [isEditMode, setIsEditMode] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState('10');
  const [selectedLeads, setSelectedLeads] = useState([]);

  useEffect(() => {
    fetchLeads();
  }, []);

  useEffect(() => {
    setSelectedLeads([]);
  }, [currentPage, searchTerm, itemsPerPage]);

const fetchLeads = async () => {
    try {
      // Temporarily disabled the API call so it doesn't load the main Leads data.
      // Later, we will change this to fetch only leads assigned to specific employees 
      // (e.g., axios.get('http://localhost:8000/api/assigned-leads'))
      
      setLeads([]); // Keeps the table completely empty for now
      
    } catch (error) {
      console.error("Error fetching leads:", error);
      setErrorMsg("Failed to connect to the database.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSocialMediaChange = (index, value) => {
    const newSocialMedia = [...formData.Social_Media];
    newSocialMedia[index] = value;
    setFormData({ ...formData, Social_Media: newSocialMedia });
  };

  const addSocialMedia = () => setFormData({ ...formData, Social_Media: [...formData.Social_Media, ''] });
  
  const removeSocialMedia = (index) => {
    const newSocialMedia = formData.Social_Media.filter((_, i) => i !== index);
    setFormData({ ...formData, Social_Media: newSocialMedia });
  };

  const validateForm = () => {
    if (!formData.Business_Name || String(formData.Business_Name).trim() === '' || !formData.Industry || String(formData.Industry).trim() === '') {
      setErrorMsg('Please fill out all required fields marked with an asterisk (*).');
      return false;
    }
    setErrorMsg('');
    return true;
  };

  const openViewModal = (lead) => {
    setSelectedLead(lead);
    setFormData({ ...lead, Social_Media: Array.isArray(lead.Social_Media) ? lead.Social_Media : [''] });
    setIsEditMode(false);
    setIsViewOpen(true);
    setErrorMsg('');
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLeads(leads.map(l => l.Lead_ID === formData.Lead_ID ? formData : l));
    setSelectedLead(formData);
    setIsEditMode(false);
    setErrorMsg('');
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:8000/api/leads/${selectedLead.Lead_ID}`);
      setLeads(leads.filter(l => l.Lead_ID !== selectedLead.Lead_ID));
      setIsDeleteOpen(false);
      setIsViewOpen(false);
      setErrorMsg('');
    } catch (error) {
      console.error("Error deleting lead:", error);
      setErrorMsg("Failed to delete the lead from the database.");
    }
  };

  const confirmBulkDelete = async () => {
    try {
      await Promise.all(
        selectedLeads.map(id => axios.delete(`http://localhost:8000/api/leads/${id}`))
      );
      setLeads(leads.filter(l => !selectedLeads.includes(l.Lead_ID)));
      setSelectedLeads([]);
      setIsBulkDeleteOpen(false);
    } catch (error) {
      console.error("Error bulk deleting leads:", error);
      alert("There was an error deleting some leads. Please refresh the page.");
    }
  };

  const closeModals = () => {
    setIsViewOpen(false);
    setIsEditMode(false);
    setErrorMsg('');
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
  };

  const filteredLeads = leads.filter((lead) => {
    const searchLower = searchTerm.toLowerCase();
    const socialMediaMatch = (lead.Social_Media || []).some(link => (link || '').toLowerCase().includes(searchLower));

    return (
      (lead.Lead_ID || '').toLowerCase().includes(searchLower) ||
      (lead.Business_Name || '').toLowerCase().includes(searchLower) ||
      (lead.Industry || '').toLowerCase().includes(searchLower) ||
      (lead.Date_Added || '').toLowerCase().includes(searchLower) ||
      (lead.Business_Owner_First_Name || '').toLowerCase().includes(searchLower) ||
      (lead.Business_Owner_Email || '').toLowerCase().includes(searchLower) ||
      (lead.Contact_Person_Email || '').toLowerCase().includes(searchLower) ||
      socialMediaMatch
    );
  });

  const sortedLeads = [...filteredLeads].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const valA = (a[sortConfig.key] || '').toLowerCase();
    const valB = (b[sortConfig.key] || '').toLowerCase();
    if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
    if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const totalItems = sortedLeads.length;
  const actualItemsPerPage = itemsPerPage === 'All' ? totalItems : parseInt(itemsPerPage, 10);
  const totalPages = actualItemsPerPage > 0 ? Math.ceil(totalItems / actualItemsPerPage) : 1;

  const startIndex = (currentPage - 1) * actualItemsPerPage;
  const endIndex = itemsPerPage === 'All' ? totalItems : Math.min(startIndex + actualItemsPerPage, totalItems);

  const currentLeads = sortedLeads.slice(startIndex, endIndex);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allVisibleIds = currentLeads.map(lead => lead.Lead_ID);
      setSelectedLeads(allVisibleIds);
    } else {
      setSelectedLeads([]);
    }
  };

  const handleSelectOne = (e, leadId) => {
    if (e.target.checked) {
      setSelectedLeads(prev => [...prev, leadId]);
    } else {
      setSelectedLeads(prev => prev.filter(id => id !== leadId));
    }
  };

  const renderSortIcon = (columnKey) => {
    const isActive = sortConfig.key === columnKey;
    return (
      <span className={`text-xs ml-1 ${isActive ? 'text-white' : 'text-white/50 hover:text-white transition-colors'}`}>
        {isActive && sortConfig.direction === 'desc' ? '▲' : '▼'}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="pt-28 px-8 pb-12 max-w-[96%] mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Assigned Leads</h1>
          
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Search leads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7E3A99] focus:border-transparent text-sm w-64 shadow-sm"
            />
            {/* The Add and Import buttons were completely removed from here */}
          </div>
        </div>

        {errorMsg && errorMsg.includes('Failed to connect') && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded border border-red-300">{errorMsg}</div>
        )}

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm text-left relative">
            <thead className="bg-[#7E3A99] text-[#f8f7fa] font-semibold select-none">
              <tr>
                <th className="px-6 py-4 whitespace-nowrap w-10">
                  <input
                    type="checkbox"
                    checked={currentLeads.length > 0 && selectedLeads.length === currentLeads.length}
                    onChange={handleSelectAll}
                    className="w-4 h-4 cursor-pointer accent-white rounded border-white/50"
                  />
                </th>

                {selectedLeads.length > 0 ? (
                  <th colSpan="8" className="px-4 py-4 whitespace-nowrap bg-[#6c3282]">
                    <div className="flex items-center gap-6">
                      <span className="font-bold bg-white/20 px-3 py-1 rounded-full text-xs">
                        {selectedLeads.length} selected
                      </span>
                      
                      <div className="flex items-center gap-4 border-l border-white/20 pl-6">
                        <button 
                          onClick={() => console.log('Assign clicked for:', selectedLeads)}
                          title="Assign" 
                          className="hover:text-[#19a828] transition-colors flex items-center gap-2"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                          </svg>
                          <span className="text-sm">Assign</span>
                        </button>

                        <button 
                          onClick={() => setIsBulkDeleteOpen(true)}
                          title="Delete Selected" 
                          className="hover:text-red-300 transition-colors flex items-center gap-2"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                          </svg>
                          <span className="text-sm">Delete</span>
                        </button>
                      </div>
                    </div>
                  </th>
                ) : (
                  <>
                    <th className="px-6 py-4 whitespace-nowrap cursor-pointer hover:bg-[#6c3282] transition-colors" onClick={() => handleSort('Lead_ID')}>
                      <div className="flex items-center">Business Name {renderSortIcon('Lead_ID')}</div>
                    </th>
                    <th className="px-6 py-4 whitespace-nowrap cursor-pointer hover:bg-[#6c3282] transition-colors" onClick={() => handleSort('Industry')}>
                      <div className="flex items-center">Industry {renderSortIcon('Industry')}</div>
                    </th>
                    <th className="px-6 py-4 whitespace-nowrap cursor-pointer hover:bg-[#6c3282] transition-colors" onClick={() => handleSort('Tab_Category')}>
                      <div className="flex items-center">Tab Category {renderSortIcon('Tab_Category')}</div>
                    </th>
                    <th className="px-6 py-4 whitespace-nowrap">Business Owner Info</th>
                    <th className="px-6 py-4 whitespace-nowrap">Business Info</th>
                    <th className="px-6 py-4 whitespace-nowrap">Contact Person Info</th>
                    <th className="px-6 py-4 whitespace-nowrap cursor-pointer hover:bg-[#6c3282] transition-colors" onClick={() => handleSort('Date_Added')}>
                      <div className="flex items-center">Date Added {renderSortIcon('Date_Added')}</div>
                    </th>
                    <th className="px-6 py-4 text-center whitespace-nowrap">Action</th>
                  </>
                )}
              </tr>
            </thead>
            
            <tbody className="divide-y divide-gray-200">
              {currentLeads.map((lead) => {
                const isSelected = selectedLeads.includes(lead.Lead_ID);
                return (
                  <tr key={lead.Lead_ID} className={`transition-colors ${isSelected ? 'bg-purple-50 hover:bg-purple-100' : 'odd:bg-white even:bg-gray-50 hover:bg-gray-100'}`}>
                    <td className="px-6 py-4 w-10">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => handleSelectOne(e, lead.Lead_ID)}
                        className="w-4 h-4 cursor-pointer accent-[#7E3A99] rounded border-gray-300"
                      />
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">{lead.Business_Name}</td>
                    <td className="px-6 py-4 text-gray-600">{lead.Industry}</td>
                    <td className="px-6 py-4 text-gray-600">{lead.Tab_Category || 'N/A'}</td>
                    <td className="px-6 py-4 text-gray-500 text-xs"><div>📞 {lead.Business_Owner_Phone || 'N/A'}</div><div>✉️ {lead.Business_Owner_Email || 'N/A'}</div></td>
                    <td className="px-6 py-4 text-gray-500 text-xs"><div>📞 {lead.Business_Phone || 'N/A'}</div><div>✉️ {lead.Business_Email || 'N/A'}</div></td>
                    <td className="px-6 py-4 text-gray-500 text-xs"><div>📞 {lead.Contact_Person_Phone || 'N/A'}</div><div>✉️ {lead.Contact_Person_Email || 'N/A'}</div></td>
                    <td className="px-6 py-4 text-gray-600 whitespace-nowrap">{lead.Date_Added || 'N/A'}</td>
                    <td className="px-6 py-4 text-center">
                      <button onClick={() => openViewModal(lead)} className="text-[#7E3A99] hover:text-[#19a828] font-bold transition-colors">
                        View Details
                      </button>
                    </td>
                  </tr>
                );
              })}
              {currentLeads.length === 0 && (
                <tr><td colSpan="9" className="px-6 py-8 text-center text-gray-500">No assigned leads found.</td></tr>
              )}
            </tbody>
          </table>

          <div className="flex justify-end items-center px-6 py-3 border-t border-gray-200 bg-gray-50 text-sm text-gray-600 gap-6 select-none rounded-b-lg">
            <div className="flex items-center gap-2">
              <span className="font-medium">Items per page:</span>
              <select value={itemsPerPage} onChange={(e) => setItemsPerPage(e.target.value)} className="border border-gray-300 rounded p-1 focus:outline-none focus:ring-1 focus:ring-[#7E3A99] bg-white cursor-pointer">
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
                <option value="All">All</option>
              </select>
            </div>

            <div className="font-medium min-w-[80px] text-right">
              {totalItems === 0 ? '0-0 of 0' : `${startIndex + 1}-${endIndex} of ${totalItems}`}
            </div>

            <div className="flex items-center gap-2 ml-2">
              <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1 || totalItems === 0} className="px-3 py-1.5 bg-white border border-gray-300 rounded shadow-sm text-gray-700 hover:bg-gray-50 hover:text-[#7E3A99] hover:border-[#7E3A99] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-700 disabled:hover:border-gray-300 transition-all font-bold" title="First Page">|&lt;</button>
              <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1 || totalItems === 0} className="px-3 py-1.5 bg-white border border-gray-300 rounded shadow-sm text-gray-700 hover:bg-gray-50 hover:text-[#7E3A99] hover:border-[#7E3A99] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-700 disabled:hover:border-gray-300 transition-all font-bold" title="Previous Page">&lt;</button>
              <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages || totalItems === 0} className="px-3 py-1.5 bg-white border border-gray-300 rounded shadow-sm text-gray-700 hover:bg-gray-50 hover:text-[#7E3A99] hover:border-[#7E3A99] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-700 disabled:hover:border-gray-300 transition-all font-bold" title="Next Page">&gt;</button>
              <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages || totalItems === 0} className="px-3 py-1.5 bg-white border border-gray-300 rounded shadow-sm text-gray-700 hover:bg-gray-50 hover:text-[#7E3A99] hover:border-[#7E3A99] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-700 disabled:hover:border-gray-300 transition-all font-bold" title="Last Page">&gt;|</button>
            </div>
          </div>
        </div>
      </main>

      {/* View/Edit Modal */}
      {isViewOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
              <h2 className="text-xl font-bold text-gray-800">{isEditMode ? 'Edit Lead' : 'Lead Details'} - {selectedLead?.Lead_ID}</h2>
              <button onClick={closeModals} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
            </div>
            <div className="p-6 overflow-y-auto">
              <LeadForm formData={formData} handleInputChange={handleInputChange} handleSocialMediaChange={handleSocialMediaChange} addSocialMedia={addSocialMedia} removeSocialMedia={removeSocialMedia} isReadonly={!isEditMode} isEditMode={isEditMode} />
            </div>
            <div className="px-6 py-4 border-t bg-gray-50 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <button onClick={() => setIsDeleteOpen(true)} className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-md font-medium transition-colors">Delete Lead</button>
                <span className="text-red-600 text-sm font-semibold">{errorMsg && !errorMsg.includes('Failed to connect') ? errorMsg : ''}</span>
              </div>
              <div className="flex gap-3">
                {!isEditMode ? (
                  <>
                    <button onClick={closeModals} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md">Close</button>
                    <button onClick={() => { setIsEditMode(true); setErrorMsg(''); }} className="px-6 py-2 bg-[#7E3A99] hover:bg-[#19a828] text-white rounded-md font-medium transition-colors">Edit Details</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => { setFormData(selectedLead); setIsEditMode(false); setErrorMsg(''); }} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md">Cancel</button>
                    <button onClick={handleSaveEdit} className="px-6 py-2 bg-[#7E3A99] hover:bg-[#19a828] text-white rounded-md font-medium transition-colors">Save Changes</button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Delete Modal */}
      {isBulkDeleteOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[110] p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-sm p-6 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-500 text-3xl">⚠️</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete {selectedLeads.length} Leads?</h3>
            <p className="text-sm text-gray-500 mb-6">Are you sure you want to delete the selected leads? This action cannot be undone.</p>
            <div className="flex justify-center gap-3">
              <button onClick={() => setIsBulkDeleteOpen(false)} className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md font-medium flex-1 transition-colors">No, Cancel</button>
              <button onClick={confirmBulkDelete} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md font-medium flex-1 transition-colors">Yes, Delete All</button>
            </div>
          </div>
        </div>
      )}
      
      {/* Single Delete Modal */}
      {isDeleteOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[110] p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-sm p-6 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-500 text-3xl">⚠️</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete this Lead?</h3>
            <p className="text-sm text-gray-500 mb-6">Are you sure you want to delete this lead? This action cannot be undone.</p>
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