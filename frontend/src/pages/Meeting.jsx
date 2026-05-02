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
  Deal_Closed: ['Yes', 'No']
};

const getChipColor = (value) => {
  const safeVal = value ? String(value).trim() : '';
  switch (safeVal) {
    case 'Yes': return 'bg-green-100 text-green-700 hover:bg-green-200'; 
    case 'No': return 'bg-red-100 text-red-700 hover:bg-red-200'; 
    case '': return 'bg-white text-gray-400 border border-gray-200 hover:bg-gray-50';
    default: return 'bg-gray-100 text-gray-600 hover:bg-gray-200';
  }
};

// --- LeadForm Component (Copied exactly from Employee_AssignedLeads.jsx) ---
const LeadForm = ({ formData, isReadonly }) => {
  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1"><label className="text-xs font-semibold text-gray-500">Business Name</label><input type="text" value={formData.Business_Name || ''} disabled={isReadonly} className="w-full border rounded p-2 text-sm disabled:bg-gray-50 bg-white" /></div>
        <div className="space-y-1"><label className="text-xs font-semibold text-gray-500">Industry</label><input type="text" value={formData.Industry || ''} disabled={isReadonly} className="w-full border rounded p-2 text-sm disabled:bg-gray-50 bg-white" /></div>
        <div className="space-y-1"><label className="text-xs font-semibold text-gray-500">Date Added</label><input type="date" value={formData.Date_Added ? formData.Date_Added.split('T') : ''} disabled={true} className="w-full border rounded p-2 text-sm disabled:bg-gray-50" /></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1"><label className="text-xs font-semibold text-gray-500">Business Phone</label><input type="text" value={formData.Business_Phone || ''} disabled={isReadonly} className="w-full border rounded p-2 text-sm disabled:bg-gray-50 bg-white" /></div>
        <div className="space-y-1"><label className="text-xs font-semibold text-gray-500">Business Email</label><input type="email" value={formData.Business_Email || ''} disabled={isReadonly} className="w-full border rounded p-2 text-sm disabled:bg-gray-50 bg-white" /></div>
        <div className="space-y-1"><label className="text-xs font-semibold text-gray-500">Website Link</label><input type="text" value={formData.Website_Link || ''} disabled={isReadonly} className="w-full border rounded p-2 text-sm disabled:bg-gray-50 bg-white" /></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 border border-gray-200 rounded-lg p-4 bg-gray-50/50">
        <h3 className="col-span-1 md:col-span-4 text-sm font-bold text-gray-700 border-b pb-2 mb-2">Business Owner</h3>
        <div className="space-y-1"><label className="text-xs font-semibold text-gray-500">First Name</label><input type="text" value={formData.Business_Owner_First_Name || ''} disabled={isReadonly} className="w-full border rounded p-2 text-sm disabled:bg-gray-50 bg-white" /></div>
        <div className="space-y-1"><label className="text-xs font-semibold text-gray-500">Last Name</label><input type="text" value={formData.Business_Owner_Last_Name || ''} disabled={isReadonly} className="w-full border rounded p-2 text-sm disabled:bg-gray-50 bg-white" /></div>
        <div className="space-y-1"><label className="text-xs font-semibold text-gray-500">Phone</label><input type="text" value={formData.Business_Owner_Phone || ''} disabled={isReadonly} className="w-full border rounded p-2 text-sm disabled:bg-gray-50 bg-white" /></div>
        <div className="space-y-1"><label className="text-xs font-semibold text-gray-500">Email</label><input type="email" value={formData.Business_Owner_Email || ''} disabled={isReadonly} className="w-full border rounded p-2 text-sm disabled:bg-gray-50 bg-white" /></div>
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
        <div className="space-y-1"><label className="text-xs font-semibold text-gray-500">Tab Category</label><input type="text" value={formData.Tab_Category || ''} disabled={isReadonly} className="w-full border rounded p-2 text-sm disabled:bg-gray-50 bg-white" /></div>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-semibold text-gray-500">Social Media Links</label>
        {formData.Social_Media && formData.Social_Media.map((link, index) => (
          <input key={index} type="text" value={link || ''} disabled={isReadonly} className="w-full border rounded p-2 text-sm disabled:bg-gray-50 mb-2 bg-white" />
        ))}
        {(!formData.Social_Media || formData.Social_Media.length === 0) && (
          <input type="text" value="N/A" disabled={isReadonly} className="w-full border rounded p-2 text-sm disabled:bg-gray-50 mb-2 bg-white" />
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4 mt-2">
        <div className="space-y-1"><label className="text-xs font-semibold text-gray-500">Solution Needed</label><textarea value={formData.Solution_Needed || ''} disabled={isReadonly} className="w-full border rounded p-2 text-sm disabled:bg-gray-50 h-24 bg-white"></textarea></div>
        <div className="space-y-1"><label className="text-xs font-semibold text-gray-500">Remarks</label><textarea value={formData.Remarks || ''} disabled={isReadonly} className="w-full border rounded p-2 text-sm disabled:bg-gray-50 h-24 bg-white"></textarea></div>
      </div>
    </div>
  );
};

const AutoResizeTextarea = ({ value, onChange, onBlur, placeholder, readOnly = false }) => {
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
      onChange={(e) => !readOnly && onChange(e.target.value)}
      onBlur={(e) => !readOnly && onBlur(e.target.value)}
      placeholder={placeholder}
      readOnly={readOnly}
      rows={1}
      className={`w-full bg-transparent border border-transparent rounded px-2 py-1.5 text-[12px] transition-all outline-none resize-none overflow-hidden leading-snug min-h-[30px] ${
        readOnly 
          ? 'text-gray-500 italic cursor-default text-center' 
          : 'text-gray-700 hover:border-gray-300 focus:border-[#7E3A99] focus:ring-1 focus:ring-[#7E3A99] placeholder:text-gray-300 text-center'
      }`}
    />
  );
};

const ChipSelect = ({ value, options, onChange, isOpen, onToggle }) => {
  const safeValue = value ? String(value).trim() : '';
  return (
    <div className="relative inline-block text-left w-full max-w-[120px] mx-auto">
      <button type="button" onClick={(e) => { e.stopPropagation(); onToggle(); }} className={`relative z-40 flex items-center justify-center gap-1.5 w-full px-2.5 py-1 text-[11px] font-semibold leading-tight rounded-full cursor-pointer outline-none transition-colors border border-transparent ${getChipColor(safeValue)}`}>
        <span className="truncate">{safeValue}</span>
        <svg width="7" height="5" viewBox="0 0 7 5" fill="currentColor" className="opacity-70 flex-shrink-0 mt-[1px]"><path d="M3.5 5L0 0H7L3.5 5Z" /></svg>
      </button>

      {isOpen && (
        <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1 min-w-[130px] bg-white rounded-lg shadow-[0_2px_10px_rgba(0,0,0,0.15)] border border-gray-100 z-50 py-1 overflow-hidden animate-fade-in-down">
          {options.map((opt) => (
            <div key={opt} onClick={(e) => { e.stopPropagation(); onChange(opt); }} className={`px-3 py-1.5 text-[12px] font-medium cursor-pointer transition-colors flex items-center gap-2 ${safeValue === opt ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-50'}`}>
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
export default function Meeting() {
  const [meetings, setMeetings] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState('10');
  const [activeDropdown, setActiveDropdown] = useState(null);

  // --- VIEW MODAL STATES (Copied exactly from Employee_AssignedLeads) ---
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [modalTab, setModalTab] = useState('details'); 
  const [leadHistory, setLeadHistory] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  // --- FETCH MEETINGS ON LOAD ---
  useEffect(() => {
    fetchMeetings();
    const handleWindowClick = () => setActiveDropdown(null);
    window.addEventListener('click', handleWindowClick);
    return () => window.removeEventListener('click', handleWindowClick);
  }, []);

  const fetchMeetings = async () => {
    const userId = localStorage.getItem('USER_ID');
    if (!userId) return;

    try {
      const response = await axios.get(`http://localhost:8000/api/meetings/admin/${userId}`);
      setMeetings(response.data);
    } catch (error) {
      console.error("Error fetching meetings:", error);
    }
  };

  // Pagination Setup
  const totalItems = meetings.length;
  const actualItemsPerPage = itemsPerPage === 'All' ? totalItems : parseInt(itemsPerPage, 10);
  const totalPages = actualItemsPerPage > 0 ? Math.ceil(totalItems / actualItemsPerPage) : 1;
  const startIndex = (currentPage - 1) * actualItemsPerPage;
  const endIndex = itemsPerPage === 'All' ? totalItems : Math.min(startIndex + actualItemsPerPage, totalItems);
  const currentMeetings = meetings.slice(startIndex, endIndex);

  // --- MODAL HANDLERS ---
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

  const openViewModal = (lead) => {
    // Laravel toArray() outputs relationships in snake_case, so we check for master_lead
    const master = lead.master_lead || lead.masterLead || {};
    const business = master.business || {};
    
    const socialMediaRaw = business.social_media || business.socialMedia || [];
    let socialMediaLinks = [''];
    if (Array.isArray(socialMediaRaw) && socialMediaRaw.length > 0) {
      socialMediaLinks = socialMediaRaw.map(sm => sm.URL || sm.url);
    }

    const combinedData = { 
      ...emptyForm, 
      ...master,        
      ...business,      
      Business_Name: lead.Business_Name,
      Social_Media: socialMediaLinks,
      Remarks: master.Remarks || master.Pipeline_Remarks || '' 
    };
    
    setSelectedLead(lead);
    setFormData(combinedData);
    setModalTab('details'); 
    fetchLeadHistory(lead.Lead_ID || master.Lead_ID); 
    setIsViewOpen(true);
  };

  const closeModals = () => {
    setIsViewOpen(false);
    setModalTab('details');
  };

  const toggleDropdown = (id) => setActiveDropdown(activeDropdown === id ? null : id);
  // 1. Updates the text/checkbox on your screen instantly
  const handleManualChange = (id, field, value) => {
    setMeetings(prevMeetings =>
      prevMeetings.map(meeting =>
        meeting.Assigned_Lead_ID === id ? { ...meeting, [field]: value } : meeting
      )
    );
  };

  // 2. Handles the Deal Closed dropdown selection
  const handleDropdownChange = (id, field, value) => {
    handleManualChange(id, field, value); // Update UI
    savePipelineField(id, field, value);  // Send to database
    setActiveDropdown(null);              // Close dropdown
  };

  // 3. Sends the updated data straight to the Laravel Backend
  const savePipelineField = async (id, field, value) => {
    try {
      // Laravel prefers true/false instead of "Yes"/"No" for booleans
      let parsedValue = value;
      if (field === 'Deal_Closed') {
          parsedValue = value === 'Yes' ? true : (value === 'No' ? false : null);
      }

      await axios.patch(`http://localhost:8000/api/assigned-leads/${id}/status`, {
        [field]: parsedValue
      });
      console.log(`${field} saved successfully!`);
    } catch (error) {
      console.error("Error saving field:", error);
      alert(`Failed to save ${field}. Check console for errors.`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="pt-28 px-8 pb-12 max-w-[98%] mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Meetings</h1>
        </div>

        {/* --- MAIN TABLE --- */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col">
          <div className="overflow-visible"> 
            <table className="min-w-full text-sm text-left border-collapse">
              
              <thead className="bg-[#7E3A99] text-white select-none">
                <tr>
                  <th className="px-6 py-4 font-semibold tracking-wider whitespace-nowrap sticky left-0 bg-[#7E3A99] z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.3)] rounded-tl-lg border-r border-purple-800">Business Name</th>
                  <th className="px-3 py-3 font-semibold tracking-wider whitespace-nowrap text-center">Date</th>
                  <th className="px-3 py-3 font-semibold tracking-wider whitespace-nowrap text-center">Time</th>
                  <th className="px-3 py-3 font-semibold tracking-wider whitespace-nowrap text-center">Meeting Type</th>
                  <th className="px-3 py-3 font-semibold tracking-wider whitespace-nowrap text-center min-w-[200px]">Employee Remarks</th>
                  <th className="px-3 py-3 font-semibold tracking-wider whitespace-nowrap text-center min-w-[200px] rounded-tr-lg">Pre-Meeting Notes</th>
                </tr>
              </thead>
              
              <tbody className="bg-white">
                {currentMeetings.map((lead) => (
                  <React.Fragment key={lead.Assigned_Lead_ID}>
                    
                    {/* TOP ROW */}
                    <tr className="hover:bg-purple-50/20 transition-colors group/top align-middle">
                      <td rowSpan="2" className="px-6 py-4 whitespace-nowrap sticky left-0 bg-white border-b-2 border-gray-200 border-r border-gray-100 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] z-10 align-top pt-6">
                        <button onClick={() => openViewModal(lead)} className="flex flex-col text-left group/btn outline-none">
                          <span className="font-bold text-[#7E3A99] group-hover/btn:text-[#19a828] transition-colors text-base">
                            {lead.Business_Name || 'Unknown Business'}
                          </span>
                        </button>
                      </td>

                      <td className="px-3 py-3 text-center text-gray-700 font-medium whitespace-nowrap border-b border-dashed border-gray-200">
                        {lead.Meeting_Date ? new Date(lead.Meeting_Date).toLocaleDateString() : '-'}
                      </td>

                      <td className="px-3 py-3 text-center text-gray-700 font-medium whitespace-nowrap border-b border-dashed border-gray-200">
                        {lead.Meeting_Time || '-'}
                      </td>

                      <td className="px-3 py-3 text-center text-gray-700 font-medium whitespace-nowrap border-b border-dashed border-gray-200">
                        {lead.Meeting_Type || '-'}
                      </td>

                      <td className="px-3 py-3 text-center border-b border-dashed border-gray-200">
                        <AutoResizeTextarea value={lead.Remarks} readOnly={true} placeholder="No remarks." />
                      </td>

                      <td className="px-3 py-3 text-center border-b border-dashed border-gray-200">
                        <AutoResizeTextarea value={lead.Meeting_Notes} readOnly={true} placeholder="No pre-meeting notes." />
                      </td>
                    </tr>

                    {/* BOTTOM ROW */}
                    <tr className="bg-gray-50/40 hover:bg-purple-50/30 transition-colors group/bottom align-top border-b-2 border-gray-200">
                      <td className="px-3 py-3 text-center border-r border-gray-100">
                        <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Service Offered</span>
                        <AutoResizeTextarea
                          value={lead.Service_Offered}
                          placeholder="No service specified."
                          readOnly={true}
                        />
                      </td>

                      <td colSpan="2" className="px-3 py-3 text-center border-r border-gray-100">
                        <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Meeting Notes</span>
                        <AutoResizeTextarea
                          value={lead.Admin_Notes}
                          placeholder="Type live meeting notes here..."
                          onChange={(val) => handleManualChange(lead.Assigned_Lead_ID, 'Admin_Notes', val)}
                          onBlur={(val) => savePipelineField(lead.Assigned_Lead_ID, 'Admin_Notes', val)}
                        />
                      </td>

                      <td className="px-3 py-3 text-center border-r border-gray-100">
                        <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Completed</span>
                        <div className="flex items-center justify-center">
                          <input
                            type="checkbox"
                            checked={lead.Meeting_Completed || false}
                            onChange={(e) => {
                              const isChecked = e.target.checked;
                              handleManualChange(lead.Assigned_Lead_ID, 'Meeting_Completed', isChecked);
                              savePipelineField(lead.Assigned_Lead_ID, 'Meeting_Completed', isChecked);
                            }}
                            className="w-5 h-5 cursor-pointer accent-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
                          />
                        </div>
                      </td>

                      <td className="px-3 py-3 text-center">
                        <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Deal Closed</span>
                        <ChipSelect 
                          value={
                            lead.Deal_Closed === true || lead.Deal_Closed === 'Yes' || lead.Deal_Closed === 1 ? 'Yes' : 
                            (lead.Deal_Closed === false || lead.Deal_Closed === 'No' || lead.Deal_Closed === 0 || lead.Deal_Closed === '0' ? 'No' : '')
                          } 
                          options={OPTIONS.Deal_Closed} 
                          isOpen={activeDropdown === `${lead.Assigned_Lead_ID}-Deal_Closed`} 
                          onToggle={() => toggleDropdown(`${lead.Assigned_Lead_ID}-Deal_Closed`)} 
                          onChange={(val) => handleDropdownChange(lead.Assigned_Lead_ID, 'Deal_Closed', val)} 
                        />
                      </td>
                    </tr>
                  </React.Fragment>
                ))}
                
                {currentMeetings.length === 0 && (
                  <tr><td colSpan="6" className="px-6 py-12 text-center text-gray-500">There are no meetings scheduled yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="flex justify-end items-center px-6 py-3 bg-white text-sm text-gray-600 gap-6 select-none rounded-b-lg mt-auto shadow-[0_-2px_5px_-2px_rgba(0,0,0,0.05)] z-20">
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

        {/* --- View Modal with Tab Switcher (Copied exactly from Employee_AssignedLeads) --- */}
        {isViewOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-7xl max-h-[90vh] flex flex-col overflow-hidden animate-fade-in-down">
              
              <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setModalTab('details')}
                    className={`text-xl transition-colors outline-none ${modalTab === 'details' ? 'font-bold text-gray-800' : 'font-semibold text-gray-400 hover:text-gray-600'}`}
                  >
                    Lead Details - {selectedLead?.Lead_ID}
                  </button>
                  <span className="text-gray-300 text-xl font-light">|</span>
                  <button
                    onClick={() => setModalTab('history')}
                    className={`text-xl transition-colors outline-none ${modalTab === 'history' ? 'font-bold text-[#7E3A99]' : 'font-semibold text-gray-400 hover:text-gray-600'}`}
                  >
                    History
                  </button>
                </div>
                <button onClick={closeModals} className="text-gray-400 hover:text-gray-600 text-2xl outline-none">&times;</button>
              </div>

              <div className="p-6 overflow-y-auto">
                {modalTab === 'details' ? (
                  <LeadForm formData={formData} isReadonly={true} />
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

              <div className="px-6 py-4 border-t bg-gray-50 flex justify-end items-center">
                <button onClick={closeModals} className="px-6 py-2 bg-[#7E3A99] hover:bg-[#19a828] text-white rounded-md font-medium transition-colors">Close</button>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}