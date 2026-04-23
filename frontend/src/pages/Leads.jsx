import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

// Helper to get today's date in YYYY-MM-DD format
const getTodayDate = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Helper to check for duplicates
const checkIsDuplicate = (newLead, existingList) => {
  return existingList.some(lead => {
    const isIdMatch = newLead.Lead_ID && lead.Lead_ID === newLead.Lead_ID;
    const isNameMatch = (lead.Business_Name || '').trim().toLowerCase() === (newLead.Business_Name || '').trim().toLowerCase();
    const isIndustryMatch = (lead.Industry || '').trim().toLowerCase() === (newLead.Industry || '').trim().toLowerCase();
    return isIdMatch || (isNameMatch && isIndustryMatch);
  });
};

// Helper to safely generate the next Lead ID
const generateNextId = (allLeads) => {
  let maxId = 0;
  allLeads.forEach(l => {
    if (l.Lead_ID && l.Lead_ID.startsWith('CHIMES-')) {
      const num = parseInt(l.Lead_ID.replace('CHIMES-', ''), 10);
      if (!isNaN(num) && num > maxId) maxId = num;
    }
  });
  return `CHIMES-${String(maxId + 1).padStart(5, '0')}`;
};

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

export default function Leads() {
  const [leads, setLeads] = useState([]); 
  const [searchTerm, setSearchTerm] = useState(''); 
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false); 
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [isEmployeeSelectOpen, setIsEmployeeSelectOpen] = useState(false);
  const [admins, setAdmins] = useState([]);
  const [selectedAdminId, setSelectedAdminId] = useState('');
  const [batchName, setBatchName] = useState('');
  
  const [selectedLead, setSelectedLead] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [isEditMode, setIsEditMode] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [modalTab, setModalTab] = useState('details'); 
  const [leadHistory, setLeadHistory] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState('10');
  const [selectedLeads, setSelectedLeads] = useState([]);

  const fileInputRef = useRef(null);

useEffect(() => {
    fetchLeads();
    fetchAdmins();
  }, []);

  useEffect(() => {
    setSelectedLeads([]);
    setIsAssignOpen(false);
    setIsEmployeeSelectOpen(false);
  }, [currentPage, searchTerm, itemsPerPage]);

  const fetchAdmins = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/employees');
      const adminUsers = response.data.filter(emp => (emp.role || '').toLowerCase() === 'admin');
      setAdmins(adminUsers);
    } catch (error) {
      console.error("Error fetching admins:", error);
    }
  };

  const fetchLeads = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/leads');
      const formattedLeads = response.data.map(lead => {
        const business = lead.business || {};
        return {
          Lead_ID: lead.Lead_ID, user_id: lead.user_id, Date_Added: lead.Date_Added, Source: lead.Source || '',
          Tab_Category: lead.Tab_Category || '', Solution_Needed: lead.Solution_Needed || '', Remarks: lead.Remarks || '',
          Business_Name: business.Business_Name || '', Industry: business.Industry || '', Website_Link: business.Website_Link || '',
          Contact_Person_First_Name: business.Contact_Person_First_Name || '', Contact_Last_Name: business.Contact_Last_Name || '',
          Contact_Person_Phone: business.Contact_Person_Phone || '', Contact_Person_Email: business.Contact_Person_Email || '',
          Business_Owner_First_Name: business.Business_Owner_First_Name || '', Business_Owner_Last_Name: business.Business_Owner_Last_Name || '',
          Business_Owner_Phone: business.Business_Owner_Phone || '', Business_Owner_Email: business.Business_Owner_Email || '',
          Business_Phone: business.Business_Phone || '', Business_Email: business.Business_Email || '',
          Social_Media: business.social_media && business.social_media.length > 0 ? business.social_media.map(sm => sm.URL) : [''],
          Assigned_To: lead.assigned_to ? lead.assigned_to.name : 'Unassigned'
        };
      });
      setLeads(formattedLeads);
    } catch (error) {
      setErrorMsg("Failed to connect to the database. Please make sure the backend is running.");
    }
  };

  const fetchLeadHistory = async (leadId) => {
    setIsLoadingHistory(true);
    try {
      const response = await axios.get(`http://localhost:8000/api/leads/${leadId}/history`);
      setLeadHistory(response.data);
    } catch (error) {
      console.error("Error fetching lead history:", error);
    } finally {
      setIsLoadingHistory(false);
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

  const handleSaveNew = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (checkIsDuplicate(formData, leads)) {
      setErrorMsg('A lead with this Business Name and Industry already exists.');
      return;
    }
    try {
      const newLeadData = { ...formData, Lead_ID: generateNextId(leads) };
      await axios.post('http://localhost:8000/api/leads', newLeadData);
      fetchLeads(); 
      setIsAddOpen(false);
      setFormData(emptyForm);
      setErrorMsg('');
    } catch (error) {
      setErrorMsg("Failed to save lead to the database. Please try again.");
    }
  };

  const openViewModal = (lead) => {
      setSelectedLead(lead);
      setFormData({ ...lead, Social_Media: Array.isArray(lead.Social_Media) ? lead.Social_Media : [''] });
      setIsEditMode(false);
      setModalTab('details'); // Reset tab to details
      fetchLeadHistory(lead.Lead_ID); // Fetch the history
      setIsViewOpen(true);
      setErrorMsg('');
    };

  const handleSaveEdit = async (e) => {
      e.preventDefault();
      if (!validateForm()) return;
      
      try {
        // 1. Send the updated data to your Laravel database
        await axios.put(`http://localhost:8000/api/leads/${formData.Lead_ID}`, formData);
        
        // 2. If successful, update the React screen
        setLeads(leads.map(l => l.Lead_ID === formData.Lead_ID ? formData : l));
        setSelectedLead(formData);
        setIsEditMode(false);
        setErrorMsg('');
      } catch (error) {
        console.error("Error updating lead:", error);
        setErrorMsg("Failed to update lead in the database.");
      }
    };

// Delete a single lead from the database
  const confirmDelete = async () => {
    try {
      // 1. Tell Laravel to delete it from the database
      await axios.delete(`http://localhost:8000/api/leads/${selectedLead.Lead_ID}`);
      
      // 2. If successful, remove it from the React screen
      setLeads(leads.filter(l => l.Lead_ID !== selectedLead.Lead_ID));
      setIsDeleteOpen(false);
      setIsViewOpen(false);
      setErrorMsg('');
    } catch (error) {
      console.error("Error deleting lead:", error);
      setErrorMsg("Failed to delete the lead from the database.");
    }
  };

  // Delete multiple leads from the database
  const confirmBulkDelete = async () => {
    try {
      // 1. Fire off a delete request to Laravel for EVERY selected ID simultaneously
      await Promise.all(
        selectedLeads.map(id => axios.delete(`http://localhost:8000/api/leads/${id}`))
      );

      // 2. Once the database is wiped, remove them from the React screen
      setLeads(leads.filter(l => !selectedLeads.includes(l.Lead_ID)));
      setSelectedLeads([]);
      setIsBulkDeleteOpen(false);
    } catch (error) {
      console.error("Error bulk deleting leads:", error);
      alert("There was an error deleting some leads. Please refresh the page.");
    }
  };

const confirmAssign = async () => {
    if (!batchName.trim()) {
      alert("Please enter a Batch Name for these leads.");
      return;
    }

    try {
      await axios.post('http://localhost:8000/api/leads/assign', {
        lead_ids: selectedLeads,
        employee_id: selectedAdminId,
        batch_name: batchName
      });
      
      alert(`Successfully assigned ${selectedLeads.length} leads to ${batchName}!`);
      
      setIsAssignOpen(false);
      setIsEmployeeSelectOpen(false);
      setSelectedLeads([]); 
      setSelectedAdminId(''); 
      setBatchName(''); // Reset the batch name
      fetchLeads();
    } catch (error) {
      console.error("Error assigning leads:", error);
      alert("Failed to assign leads. Please check backend connection.");
    }
  };

  const closeModals = () => {
      setIsAddOpen(false);
      setIsViewOpen(false);
      setIsEditMode(false);
      setModalTab('details'); // Reset tab state
      setErrorMsg('');
    };

  const handleImportClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  // RESTORED: Full File Upload Logic
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target.result;
      const { newLeads, skipped } = parseCSVToLeads(text, leads);
      
      if (newLeads.length > 0) {
        let successCount = 0;
        let failCount = 0;

        for (const lead of newLeads) {
          try {
            await axios.post('http://localhost:8000/api/leads', lead);
            successCount++;
          } catch (err) {
            failCount++;
          }
        }
        
        fetchLeads();
        alert(`Import complete!\nSuccessfully added: ${successCount}\nFailed to add: ${failCount}\nSkipped (Duplicates): ${skipped}`);
      } else if (skipped > 0) {
        alert(`No new leads imported. Skipped ${skipped} duplicate(s).`);
      } else {
        alert('No valid leads found in the CSV.');
      }
    };
    reader.readAsText(file);
    e.target.value = null; 
  };

  // RESTORED: Full CSV Parser Logic
  const parseCSVToLeads = (text, currentLeads) => {
    const lines = text.split('\n').filter(line => line.trim() !== '');
    if (lines.length < 2) return { newLeads: [], skipped: 0 }; 
    
    const headers = lines[0].split(',').map(h => h.trim());
    const newLeads = [];
    let skippedCount = 0;

    for (let i = 1; i < lines.length; i++) {
      const values = [];
      let inQuotes = false;
      let currentValue = '';
      
      for (let char of lines[i]) {
        if (char === '"') inQuotes = !inQuotes;
        else if (char === ',' && !inQuotes) {
          values.push(currentValue.trim());
          currentValue = '';
        } else {
          currentValue += char;
        }
      }
      values.push(currentValue.trim());

      const leadObj = { ...emptyForm }; 
      headers.forEach((header, index) => {
        let val = values[index] || '';
        if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
        if (header === 'Lead_ID') return; 

        if (header === 'Social_Media') {
           leadObj[header] = val.split(';').map(s => s.trim()).filter(Boolean);
           if (leadObj[header].length === 0) leadObj[header] = [''];
        } else if (leadObj.hasOwnProperty(header)) {
           leadObj[header] = val;
        }
      });

      const isDuplicate = checkIsDuplicate(leadObj, [...currentLeads, ...newLeads]);
      if (isDuplicate) {
        skippedCount++;
        continue;
      }

      leadObj.Lead_ID = generateNextId([...currentLeads, ...newLeads]);
      if (!leadObj.Date_Added) leadObj.Date_Added = getTodayDate();
      newLeads.push(leadObj);
    }
    return { newLeads, skipped: skippedCount };
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

  const getSelectedAdminName = () => {
    if (!selectedAdminId) return 'Select an employee...';
    const admin = admins.find(a => String(a.id || a.User_ID || a.Employee_ID) === String(selectedAdminId));
    return admin ? admin.name : 'Select an employee...';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="pt-28 px-8 pb-12 max-w-[96%] mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Leads Management</h1>
          
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Search leads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7E3A99] focus:border-transparent text-sm w-64 shadow-sm"
            />
            <input type="file" accept=".csv" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
            <button onClick={handleImportClick} className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-md font-medium transition-colors shadow-sm text-sm">Import</button>
            <button onClick={() => { setFormData({ ...emptyForm, Date_Added: getTodayDate() }); setIsAddOpen(true); setErrorMsg(''); }} className="bg-[#7E3A99] hover:bg-[#19a828] text-white px-5 py-2 rounded-md font-medium transition-colors shadow-sm text-sm">+ Add Lead</button>
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
                      
                      <div className="flex items-center gap-4 border-l border-white/20 pl-6 relative">
                        
                        {/* --- ASSIGN DROPDOWN --- */}
                        <div className="relative">
                          <button onClick={() => { setIsAssignOpen(!isAssignOpen); setIsEmployeeSelectOpen(false); }} title="Assign" className="hover:text-[#19a828] transition-colors flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
                            <span className="text-sm">Assign</span>
                          </button>
                          
                          {isAssignOpen && (
                            <div className="absolute top-full left-0 mt-3 w-64 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-visible text-gray-800">
                              <div className="p-4">
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Batch Name</label>
                                <input 
                                  type="text" 
                                  value={batchName} 
                                  onChange={(e) => setBatchName(e.target.value)} 
                                  placeholder="Tab Name"
                                  className="w-full border border-gray-300 rounded-lg p-2 text-sm mb-4 outline-none focus:border-[#7E3A99] focus:ring-2 focus:ring-[#7E3A99]/20"
                                />

                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Assign to</label>
                                <div className="relative mb-4">
                                  <button type="button" onClick={(e) => { e.stopPropagation(); setIsEmployeeSelectOpen(!isEmployeeSelectOpen); }} className={`w-full flex items-center justify-between border ${isEmployeeSelectOpen ? 'border-[#7E3A99] ring-2 ring-[#7E3A99]/20' : 'border-gray-300 hover:border-gray-400'} rounded-lg p-2 text-sm bg-white transition-all cursor-pointer outline-none relative z-50`}>
                                    <span className={`block truncate ${selectedAdminId ? 'text-gray-800 font-medium' : 'text-gray-400'}`}>{getSelectedAdminName()}</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" className={`w-4 h-4 text-gray-500 transition-transform duration-200 flex-shrink-0 ${isEmployeeSelectOpen ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                                  </button>
                                  
                                  {isEmployeeSelectOpen && (
                                    <>
                                      <div className="fixed inset-0 z-40" onClick={(e) => { e.stopPropagation(); setIsEmployeeSelectOpen(false); }}></div>
                                      <div className="absolute left-0 top-full mt-1.5 w-full bg-white rounded-xl shadow-lg border border-gray-100 z-50 py-1.5 max-h-48 overflow-y-auto">
                                        {admins.length === 0 ? (
                                          <div className="px-4 py-3 text-sm text-gray-500 text-center italic">No Admins available</div>
                                        ) : (
                                          admins.map(admin => {
                                            const adminId = admin.id || admin.User_ID || admin.Employee_ID;
                                            return (
                                              <div key={adminId} onClick={(e) => { e.stopPropagation(); setSelectedAdminId(adminId); setIsEmployeeSelectOpen(false); }} className={`px-4 py-2.5 text-sm font-medium cursor-pointer transition-colors relative z-50 ${selectedAdminId === adminId ? 'bg-purple-50 text-[#7E3A99]' : 'text-gray-700 hover:bg-gray-50'}`}>{admin.name}</div>
                                            );
                                          })
                                        )}
                                      </div>
                                    </>
                                  )}
                                </div>
                                <div className="flex justify-end gap-2 relative z-0">
                                  <button onClick={() => { setIsAssignOpen(false); setIsEmployeeSelectOpen(false); }} className="px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-100 rounded-md font-medium transition-colors">Cancel</button>
                                  <button onClick={confirmAssign} disabled={!selectedAdminId} className="px-3 py-1.5 text-xs bg-[#7E3A99] hover:bg-[#19a828] text-white rounded-md font-medium transition-colors disabled:opacity-50">Assign</button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* --- DELETE BUTTON --- */}
                        <button 
                          onClick={() => setIsBulkDeleteOpen(true)}
                          title="Delete Selected" 
                          className="hover:text-red-300 transition-colors flex items-center gap-2 ml-4"
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
                <tr><td colSpan="8" className="px-6 py-8 text-center text-gray-500">No leads found.</td></tr>
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

      {/* RESTORED: Add Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
              <h2 className="text-xl font-bold text-gray-800">Add New Lead</h2>
              <button onClick={closeModals} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
            </div>
            <div className="p-6 overflow-y-auto">
              <LeadForm formData={formData} handleInputChange={handleInputChange} handleSocialMediaChange={handleSocialMediaChange} addSocialMedia={addSocialMedia} removeSocialMedia={removeSocialMedia} isReadonly={false} isEditMode={false} />
            </div>
            <div className="px-6 py-4 border-t bg-gray-50 flex justify-between items-center">
              <div className="text-red-600 text-sm font-semibold">{errorMsg && !errorMsg.includes('Failed to connect') ? errorMsg : ''}</div>
              <div className="flex gap-3">
                <button onClick={closeModals} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md">Cancel</button>
                <button onClick={handleSaveNew} className="px-6 py-2 bg-[#7E3A99] hover:bg-[#19a828] text-white rounded-md font-medium transition-colors">Save Lead</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- View/Edit Modal with Tab Switcher --- */}
      {isViewOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-7xl max-h-[90vh] flex flex-col overflow-hidden">
            
            {/* Modal Header with Tabs */}
            <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setModalTab('details')}
                  className={`text-xl transition-colors outline-none ${modalTab === 'details' ? 'font-bold text-gray-800' : 'font-semibold text-gray-400 hover:text-gray-600'}`}
                >
                  {isEditMode ? 'Edit Lead' : 'Lead Details'} - {selectedLead?.Lead_ID}
                </button>
                {!isEditMode && (
                  <>
                    <span className="text-gray-300 text-xl font-light">|</span>
                    <button
                      onClick={() => setModalTab('history')}
                      className={`text-xl transition-colors outline-none ${modalTab === 'history' ? 'font-bold text-[#7E3A99]' : 'font-semibold text-gray-400 hover:text-gray-600'}`}
                    >
                      History
                    </button>
                  </>
                )}
              </div>
              <button onClick={closeModals} className="text-gray-400 hover:text-gray-600 text-2xl outline-none">&times;</button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto">
              {modalTab === 'details' ? (
                <LeadForm formData={formData} handleInputChange={handleInputChange} handleSocialMediaChange={handleSocialMediaChange} addSocialMedia={addSocialMedia} removeSocialMedia={removeSocialMedia} isReadonly={!isEditMode} isEditMode={isEditMode} />
              ) : (
                <div className="space-y-4">
                  {isLoadingHistory ? (
                    <p className="text-gray-500 text-center py-8">Loading lead history...</p>
                  ) : leadHistory.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500 italic">No history records found for this lead.</p>
                      <p className="text-xs text-gray-400 mt-2">Only fully processed assignments (completed with all pipeline fields filled) are recorded here.</p>
                    </div>
                  ) : (
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <table className="min-w-full divide-y divide-gray-200 text-sm text-left">
                        <thead className="bg-[#7E3A99] text-white">
                          <tr>
                            <th className="px-4 py-3 font-semibold">Batch Name</th>
                            <th className="px-4 py-3 font-semibold text-center">Inquiry Type</th>
                            <th className="px-4 py-3 font-semibold text-center">Responded</th>
                            <th className="px-4 py-3 font-semibold text-center">Agree Meeting</th>
                            <th className="px-4 py-3 font-semibold text-center">Point of Contact</th>
                            <th className="px-4 py-3 font-semibold">Assigned To</th>
                            <th className="px-4 py-3 font-semibold text-center">Date Completed</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                          {leadHistory.map((record, idx) => (
                            <tr key={idx} className="hover:bg-purple-50 transition-colors">
                              <td className="px-4 py-3 font-bold text-gray-800">{record.Batch_Name}</td>
                              <td className="px-4 py-3 text-center font-medium text-gray-600">{record.Inquiry_Type}</td>
                              <td className="px-4 py-3 text-center">
                                <span className={record.Responded === 'Yes' ? 'bg-green-100 text-green-700 px-2.5 py-1 rounded text-[11px] font-bold uppercase tracking-wider' : 'bg-red-100 text-red-700 px-2.5 py-1 rounded text-[11px] font-bold uppercase tracking-wider'}>{record.Responded}</span>
                              </td>
                              <td className="px-4 py-3 text-center">
                                <span className={record.Meeting_Booked === 'Yes' ? 'bg-green-100 text-green-700 px-2.5 py-1 rounded text-[11px] font-bold uppercase tracking-wider' : 'bg-red-100 text-red-700 px-2.5 py-1 rounded text-[11px] font-bold uppercase tracking-wider'}>{record.Meeting_Booked}</span>
                              </td>
                              <td className="px-4 py-3 text-center text-gray-600 font-medium whitespace-nowrap">{record.Point_of_Contact}</td>
                              <td className="px-4 py-3 text-gray-600 capitalize font-medium">{record.Assigned_To}</td>
                              <td className="px-4 py-3 text-center text-gray-600 font-medium">{record.Date_Completed}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t bg-gray-50 flex justify-between items-center">
              {modalTab === 'details' ? (
                <>
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
                </>
              ) : (
                <div className="w-full flex justify-end">
                  <button onClick={closeModals} className="px-6 py-2 bg-[#7E3A99] hover:bg-[#19a828] text-white rounded-md font-medium transition-colors">Close</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

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