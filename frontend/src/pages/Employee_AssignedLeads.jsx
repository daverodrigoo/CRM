import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

// --- Helper Data & Components ---
const emptyForm = {
  Lead_ID: '', Date_Added: '', Business_Name: '', 
  Contact_Person_First_Name: '', Contact_Last_Name: '', Contact_Person_Phone: '', Contact_Person_Email: '',
  Business_Owner_First_Name: '', Business_Owner_Last_Name: '', Business_Owner_Phone: '', Business_Owner_Email: '',
  Business_Phone: '', Business_Email: '', Tab_Category: '',
  Solution_Needed: '', Website_Link: '', Industry: '', Source: '', 
  Social_Media: [''], Remarks: ''
};

const OPTIONS = {
  Inquiry_Type: ['Cold Call', 'Email', 'Message'], // LinkedIn is removed
  Responded: ['Yes', 'No'],
  Meeting_Booked: ['Yes', 'No']
};

// FIX: Switched to standard Tailwind colors to guarantee they compile and render!
const getChipColor = (value) => {
  const safeVal = value ? String(value).trim() : 'None';
  switch (safeVal) {
    case 'Yes': return 'bg-green-100 text-green-700 hover:bg-green-200'; 
    case 'No': return 'bg-red-100 text-red-700 hover:bg-red-200'; 
    case 'Cold Call': return 'bg-orange-100 text-orange-700 hover:bg-orange-200'; 
    case 'Email': return 'bg-blue-100 text-blue-700 hover:bg-blue-200'; 
    case 'Message': return 'bg-purple-100 text-purple-700 hover:bg-purple-200'; 
    case 'None': return 'bg-white text-gray-400 border border-gray-200 hover:bg-gray-50';
    default: return 'bg-gray-100 text-gray-600 hover:bg-gray-200';
  }
};

const LeadForm = ({ formData, isReadonly }) => {
  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1"><label className="text-xs font-semibold text-gray-500">Business Name</label><input type="text" value={formData.Business_Name || ''} disabled={isReadonly} className="w-full border rounded p-2 text-sm disabled:bg-gray-50" /></div>
        <div className="space-y-1"><label className="text-xs font-semibold text-gray-500">Industry</label><input type="text" value={formData.Industry || ''} disabled={isReadonly} className="w-full border rounded p-2 text-sm disabled:bg-gray-50" /></div>
        <div className="space-y-1"><label className="text-xs font-semibold text-gray-500">Date Added</label><input type="date" value={formData.Date_Added || ''} disabled={true} className="w-full border rounded p-2 text-sm disabled:bg-gray-50" /></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1"><label className="text-xs font-semibold text-gray-500">Business Phone</label><input type="text" value={formData.Business_Phone || ''} disabled={isReadonly} className="w-full border rounded p-2 text-sm disabled:bg-gray-50" /></div>
        <div className="space-y-1"><label className="text-xs font-semibold text-gray-500">Business Email</label><input type="email" value={formData.Business_Email || ''} disabled={isReadonly} className="w-full border rounded p-2 text-sm disabled:bg-gray-50" /></div>
        <div className="space-y-1"><label className="text-xs font-semibold text-gray-500">Website Link</label><input type="text" value={formData.Website_Link || ''} disabled={isReadonly} className="w-full border rounded p-2 text-sm disabled:bg-gray-50" /></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 border border-gray-200 rounded-lg p-4 bg-gray-50/50">
        <h3 className="col-span-1 md:col-span-4 text-sm font-bold text-gray-700 border-b pb-2 mb-2">Contact Person</h3>
        <div className="space-y-1"><label className="text-xs font-semibold text-gray-500">First Name</label><input type="text" value={formData.Contact_Person_First_Name || ''} disabled={isReadonly} className="w-full border rounded p-2 text-sm disabled:bg-gray-50 bg-white" /></div>
        <div className="space-y-1"><label className="text-xs font-semibold text-gray-500">Last Name</label><input type="text" value={formData.Contact_Last_Name || ''} disabled={isReadonly} className="w-full border rounded p-2 text-sm disabled:bg-gray-50 bg-white" /></div>
        <div className="space-y-1"><label className="text-xs font-semibold text-gray-500">Phone</label><input type="text" value={formData.Contact_Person_Phone || ''} disabled={isReadonly} className="w-full border rounded p-2 text-sm disabled:bg-gray-50 bg-white" /></div>
        <div className="space-y-1"><label className="text-xs font-semibold text-gray-500">Email</label><input type="email" value={formData.Contact_Person_Email || ''} disabled={isReadonly} className="w-full border rounded p-2 text-sm disabled:bg-gray-50 bg-white" /></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1"><label className="text-xs font-semibold text-gray-500">Source</label><input type="text" value={formData.Source || ''} disabled={isReadonly} className="w-full border rounded p-2 text-sm disabled:bg-gray-50 bg-white" /></div>
        <div className="space-y-1"><label className="text-xs font-semibold text-gray-500">Tab Category</label><input type="text" value={formData.Tab_Category || ''} disabled={isReadonly} className="w-full border rounded p-2 text-sm disabled:bg-gray-50" /></div>
      </div>

      <div className="space-y-1 border-t pt-4 mt-2"><label className="text-xs font-semibold text-gray-500">Solution Needed</label><textarea value={formData.Solution_Needed || ''} disabled={isReadonly} className="w-full border rounded p-2 text-sm disabled:bg-gray-50 h-24"></textarea></div>
    </div>
  );
};

const AutoResizeTextarea = ({ value, onChange, onBlur, placeholder }) => {
  const textareaRef = useRef(null);
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'; 
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; 
    }
  }, [value]);

  return (
    <textarea
      ref={textareaRef}
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      onBlur={(e) => onBlur(e.target.value)}
      placeholder={placeholder}
      rows={1}
      className="w-full bg-transparent border border-transparent hover:border-gray-300 focus:border-[#7E3A99] focus:ring-1 focus:ring-[#7E3A99] rounded px-2 py-1.5 text-gray-700 text-[12px] transition-all outline-none placeholder:text-gray-300 resize-none overflow-hidden leading-snug min-h-[30px]"
    />
  );
};

const ChipSelect = ({ value, options, onChange, isOpen, onToggle }) => {
  const safeValue = value ? String(value).trim() : 'None';
  
  return (
    <div className="relative inline-block text-left w-full max-w-[120px] mx-auto">
      <button type="button" onClick={(e) => { e.stopPropagation(); onToggle(); }} className={`relative z-40 flex items-center justify-center gap-1.5 w-full px-2.5 py-1 text-[11px] font-semibold leading-tight rounded-full cursor-pointer outline-none transition-colors border border-transparent ${getChipColor(safeValue)}`}>
        <span className="truncate">{safeValue}</span>
        <svg width="7" height="5" viewBox="0 0 7 5" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="opacity-70 flex-shrink-0 mt-[1px]"><path d="M3.5 5L0 0H7L3.5 5Z" /></svg>
      </button>

      {isOpen && (
        <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1 min-w-[130px] bg-white rounded-lg shadow-[0_2px_10px_rgba(0,0,0,0.15)] border border-gray-100 z-50 py-1 overflow-hidden animate-fade-in-down">
          {options.map((opt) => (
            <div key={opt} onClick={(e) => { e.stopPropagation(); onChange(opt); }} className={`px-3 py-1.5 text-[12px] font-medium cursor-pointer transition-colors flex items-center gap-2 ${safeValue === opt ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-50'}`}>
              {/* FIX: Added so the little indicator dots inside the menu render flawlessly! */}
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${getChipColor(opt).split(' ')}`}></div>
              <span className="truncate">{opt}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// --- Main Page Component ---
export default function Employee_AssignedLeads() {
  const [batches, setBatches] = useState([]);
  const [activeBatchId, setActiveBatchId] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [editingBatchId, setEditingBatchId] = useState(null);
  const [editingName, setEditingName] = useState("");
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState('10');
  
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => {
    fetchAssignedBatches();
    const handleWindowClick = () => setActiveDropdown(null);
    window.addEventListener('click', handleWindowClick);
    return () => window.removeEventListener('click', handleWindowClick);
  }, []);

  useEffect(() => { setCurrentPage(1); }, [itemsPerPage, activeBatchId]);

  const fetchAssignedBatches = async () => {
    const userId = localStorage.getItem('USER_ID');
    if (!userId) return;

    try {
      const response = await axios.get(`http://localhost:8000/api/leads/assigned/${userId}`);
      setBatches(response.data);
      if (response.data.length > 0 && !activeBatchId) {
        setActiveBatchId(response.data.Batch_ID);
      }
    } catch (error) {
      console.error("Error fetching batches:", error);
    }
  };

  const saveBatchName = async (batchId) => {
    if (!editingName.trim()) {
      setEditingBatchId(null);
      return;
    }
    try {
      await axios.put(`http://localhost:8000/api/assignment-batches/${batchId}`, { Batch_Name: editingName });
      
      // Update local state so it changes instantly
      setBatches(batches.map(b => b.Batch_ID === batchId ? { ...b, Batch_Name: editingName } : b));
      setEditingBatchId(null);
    } catch (error) {
      console.error("Error updating batch name:", error);
      alert("Failed to update batch name.");
    }
  };


  const savePipelineField = async (assignedLeadId, field, value) => {
    try {
      let dbValue = value;
      if (value === 'Yes') dbValue = true;
      if (value === 'No') dbValue = false;
      
      await axios.put(`http://localhost:8000/api/assigned-leads/${assignedLeadId}`, { field, value: dbValue });
    } catch (error) {
      console.error(`Failed to auto-save ${field}:`, error);
    }
  };

  const handleDropdownChange = (assignedLeadId, field, newValue) => {
    setBatches(batches.map(batch => {
      if (batch.Batch_ID !== activeBatchId) return batch;
      return {
        ...batch,
        leads: batch.leads.map(lead => {
          if (lead.Assigned_Lead_ID === assignedLeadId) {
            // FIX: This ensures the Inquiry Type array updates LIVE on the screen
            if (field === 'Inquiry_Type') {
              return { ...lead, inquiries: newValue === 'None' ? [] : [newValue] };
            }
            return { ...lead, [field]: newValue === 'Yes' ? true : (newValue === 'No' ? false : newValue) };
          }
          return lead;
        })
      };
    }));
    setActiveDropdown(null); 
    savePipelineField(assignedLeadId, field, newValue); 
  };

  const handleManualChange = (assignedLeadId, field, newValue) => {
    setBatches(batches.map(batch => {
      if (batch.Batch_ID !== activeBatchId) return batch;
      return {
        ...batch,
        leads: batch.leads.map(lead => lead.Assigned_Lead_ID === assignedLeadId ? { ...lead, [field]: newValue } : lead)
      };
    }));
  };

  const toggleDropdown = (dropdownId) => {
    setActiveDropdown(activeDropdown === dropdownId ? null : dropdownId);
  };

  const openViewModal = (lead) => {
    const combinedData = { ...emptyForm, ...lead.master_data, Business_Name: lead.Business_Name };
    setSelectedLead(lead);
    setFormData(combinedData);
    setIsViewOpen(true);
  };

  // Pagination and Active Tab Logic
  const activeBatch = batches.find(b => b.Batch_ID === activeBatchId);
  const leads = activeBatch ? activeBatch.leads : [];
  
  const totalItems = leads.length;
  const actualItemsPerPage = itemsPerPage === 'All' ? totalItems : parseInt(itemsPerPage, 10);
  const totalPages = actualItemsPerPage > 0 ? Math.ceil(totalItems / actualItemsPerPage) : 1;
  const startIndex = (currentPage - 1) * actualItemsPerPage;
  const endIndex = itemsPerPage === 'All' ? totalItems : Math.min(startIndex + actualItemsPerPage, totalItems);
  const currentLeads = leads.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="pt-28 px-8 pb-12 max-w-[98%] mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Assigned Leads</h1>
        </div>

        {/* --- TABS --- */}
        <div className="flex gap-2 overflow-x-auto mb-4 pb-2">
          {batches.map(batch => (
            <div
              key={batch.Batch_ID}
              onClick={() => setActiveBatchId(batch.Batch_ID)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-t-lg font-bold text-sm transition-colors border-b-4 cursor-pointer group select-none ${activeBatchId === batch.Batch_ID ? 'bg-white text-[#7E3A99] border-[#7E3A99] shadow-sm' : 'bg-gray-200 text-gray-500 border-transparent hover:bg-gray-300'}`}
            >
              {editingBatchId === batch.Batch_ID ? (
                <input
                  type="text"
                  autoFocus
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  onBlur={() => saveBatchName(batch.Batch_ID)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') saveBatchName(batch.Batch_ID);
                    if (e.key === 'Escape') setEditingBatchId(null);
                  }}
                  onClick={(e) => e.stopPropagation()} // Prevents switching tabs when clicking the input
                  className="bg-transparent border-b border-[#7E3A99] outline-none text-[#7E3A99] w-28 px-1 py-0.5"
                />
              ) : (
                <>
                  <span className="whitespace-nowrap">{batch.Batch_Name}</span>
                  {/* The Edit Pencil Icon - Appears on Hover */}
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingBatchId(batch.Batch_ID);
                      setEditingName(batch.Batch_Name);
                    }}
                    className={`opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-full hover:bg-purple-100 ${activeBatchId === batch.Batch_ID ? 'text-[#7E3A99]' : 'text-gray-500 hover:text-[#7E3A99]'}`}
                    title="Edit Batch Name"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                      <path d="M2.695 14.763l-1.262 3.152a.5.5 0 00.65.65l3.152-1.262a4 4 0 001.343-.885L17.5 5.5a2.121 2.121 0 00-3-3L3.58 13.42a4 4 0 00-.885 1.343z" />
                    </svg>
                  </div>
                </>
              )}
              <span className={`text-xs px-2 py-0.5 rounded-full ${activeBatchId === batch.Batch_ID ? 'bg-purple-100 text-[#7E3A99]' : 'bg-gray-300 text-gray-600'}`}>{batch.leads.length}</span>
            </div>
          ))}
          {batches.length === 0 && (
             <div className="text-gray-500 italic text-sm py-2">No assigned batches yet.</div>
          )}
        </div>

        {/* --- TABLE --- */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col">
          {/* FIX: overflow-visible allows the dropdown to pop out over the table correctly */}
          <div className="overflow-visible"> 
            <table className="min-w-full divide-y divide-gray-200 text-sm text-left">
              <thead className="bg-[#7E3A99] text-white select-none">
                <tr>
                  <th className="px-6 py-4 font-semibold tracking-wider whitespace-nowrap sticky left-0 bg-[#7E3A99] z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.3)] rounded-tl-lg">Business Name</th>
                  <th className="px-3 py-4 font-semibold tracking-wider whitespace-nowrap text-center">Date Assigned</th>
                  <th className="px-3 py-4 font-semibold tracking-wider whitespace-nowrap text-center">Inquiry Type</th>
                  <th className="px-3 py-4 font-semibold tracking-wider whitespace-nowrap text-center">Responded</th>
                  <th className="px-3 py-4 font-semibold tracking-wider whitespace-nowrap min-w-[250px] text-center">Remarks</th>
                  <th className="px-3 py-4 font-semibold tracking-wider whitespace-nowrap text-center">Meeting Booked</th>
                  <th className="px-4 py-4 rounded-tr-lg"></th> 
                </tr>
              </thead>
              
              <tbody className="divide-y divide-gray-200 bg-white">
                {currentLeads.map((lead) => (
                  <tr key={lead.Assigned_Lead_ID} className="hover:bg-purple-50/30 transition-colors group align-middle">
                    
                    <td className="px-6 py-4 whitespace-nowrap sticky left-0 bg-white group-hover:bg-[#faf5fc] transition-colors shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] z-10">
                      <button onClick={() => openViewModal(lead)} className="flex flex-col text-left group/btn outline-none">
                        <span className="font-bold text-[#7E3A99] group-hover/btn:text-[#19a828] transition-colors">{lead.Business_Name}</span>
                      </button>
                    </td>

                    <td className="px-3 py-4 text-center text-gray-600 font-medium whitespace-nowrap">
                      {new Date(lead.Date_Assigned).toLocaleDateString()}
                    </td>

                    <td className="px-3 py-3 text-center">
                      <ChipSelect 
                        value={(lead.inquiries && lead.inquiries) || 'None'} 
                        options={OPTIONS.Inquiry_Type} 
                        isOpen={activeDropdown === `${lead.Assigned_Lead_ID}-Inquiry_Type`} 
                        onToggle={() => toggleDropdown(`${lead.Assigned_Lead_ID}-Inquiry_Type`)} 
                        onChange={(val) => handleDropdownChange(lead.Assigned_Lead_ID, 'Inquiry_Type', val)} 
                      />
                    </td>

                    <td className="px-3 py-3 text-center">
                      <ChipSelect 
                        value={lead.Responded ? 'Yes' : 'No'} 
                        options={OPTIONS.Responded} 
                        isOpen={activeDropdown === `${lead.Assigned_Lead_ID}-Responded`} 
                        onToggle={() => toggleDropdown(`${lead.Assigned_Lead_ID}-Responded`)} 
                        onChange={(val) => handleDropdownChange(lead.Assigned_Lead_ID, 'Responded', val)} 
                      />
                    </td>

                    <td className="px-3 py-3 text-center">
                      <AutoResizeTextarea
                        value={lead.Remarks}
                        placeholder="Add remarks..."
                        onChange={(val) => handleManualChange(lead.Assigned_Lead_ID, 'Remarks', val)}
                        onBlur={(val) => savePipelineField(lead.Assigned_Lead_ID, 'Remarks', val)}
                      />
                    </td>
                    
                    <td className="px-3 py-3 text-center">
                      <ChipSelect 
                        value={lead.Meeting_Booked ? 'Yes' : 'No'} 
                        options={OPTIONS.Meeting_Booked} 
                        isOpen={activeDropdown === `${lead.Assigned_Lead_ID}-Meeting_Booked`} 
                        onToggle={() => toggleDropdown(`${lead.Assigned_Lead_ID}-Meeting_Booked`)} 
                        onChange={(val) => handleDropdownChange(lead.Assigned_Lead_ID, 'Meeting_Booked', val)} 
                      />
                    </td>

                    <td className="px-4 py-3 text-center">
                      <button className="p-1.5 text-[#7E3A99] hover:text-[#19a828] hover:bg-purple-50 rounded-md transition-colors" title="Schedule Appointment">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor" className="w-5 h-5 mx-auto"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z" /></svg>
                      </button>
                    </td>
                  </tr>
                ))}
                
                {currentLeads.length === 0 && (
                  <tr><td colSpan="7" className="px-6 py-12 text-center text-gray-500">There are no leads in this batch.</td></tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="flex justify-end items-center px-6 py-3 border-t border-gray-200 bg-gray-50 text-sm text-gray-600 gap-6 select-none rounded-b-lg mt-auto">
            <div className="flex items-center gap-2">
              <span className="font-medium">Items per page:</span>
              <select value={itemsPerPage} onChange={(e) => setItemsPerPage(e.target.value)} className="border border-gray-300 rounded p-1 focus:outline-none focus:ring-1 focus:ring-[#7E3A99] bg-white cursor-pointer"><option value="10">10</option><option value="25">25</option><option value="50">50</option><option value="All">All</option></select>
            </div>
            <div className="font-medium min-w-[80px] text-right">{totalItems === 0 ? '0-0 of 0' : `${startIndex + 1}-${endIndex} of ${totalItems}`}</div>
            <div className="flex items-center gap-2 ml-2">
              <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1 || totalItems === 0} className="px-3 py-1.5 bg-white border border-gray-300 rounded shadow-sm text-gray-700 hover:bg-gray-50 font-bold disabled:opacity-40">|&lt;</button>
              <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1 || totalItems === 0} className="px-3 py-1.5 bg-white border border-gray-300 rounded shadow-sm text-gray-700 hover:bg-gray-50 font-bold disabled:opacity-40">&lt;</button>
              <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages || totalItems === 0} className="px-3 py-1.5 bg-white border border-gray-300 rounded shadow-sm text-gray-700 hover:bg-gray-50 font-bold disabled:opacity-40">&gt;</button>
              <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages || totalItems === 0} className="px-3 py-1.5 bg-white border border-gray-300 rounded shadow-sm text-gray-700 hover:bg-gray-50 font-bold disabled:opacity-40">&gt;|</button>
            </div>
          </div>
        </div>
      </main>

      {/* --- MODAL --- */}
      {isViewOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-fade-in-down">
            <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
              <h2 className="text-xl font-bold text-gray-800">Lead Details - {selectedLead ? selectedLead.Lead_ID : ''}</h2>
              <button onClick={() => setIsViewOpen(false)} className="text-gray-400 hover:text-gray-600 text-2xl outline-none">&times;</button>
            </div>
            <div className="p-6 overflow-y-auto"><LeadForm formData={formData} isReadonly={true} /></div>
            <div className="px-6 py-4 border-t bg-gray-50 flex justify-end items-center"><button onClick={() => setIsViewOpen(false)} className="px-6 py-2 bg-[#7E3A99] hover:bg-[#19a828] text-white rounded-md font-medium transition-colors">Close</button></div>
          </div>
        </div>
      )}
    </div>
  );
}