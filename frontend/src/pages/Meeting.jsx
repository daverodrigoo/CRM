import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

// --- Helper Data & Components ---
const OPTIONS = {
  Meeting_Type: ['Online', 'Face-to-Face'],
  Deal_Closed: ['Yes', 'No']
};

const getChipColor = (value) => {
  const safeVal = value ? String(value).trim() : '';
  switch (safeVal) {
    case 'Yes': return 'bg-green-100 text-green-700 hover:bg-green-200'; 
    case 'No': return 'bg-red-100 text-red-700 hover:bg-red-200'; 
    case 'Online': return 'bg-blue-100 text-blue-700 hover:bg-blue-200'; 
    case 'Face-to-Face': return 'bg-purple-100 text-purple-700 hover:bg-purple-200'; 
    case '': return 'bg-white text-gray-400 border border-gray-200 hover:bg-gray-50';
    default: return 'bg-gray-100 text-gray-600 hover:bg-gray-200';
  }
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
    </div>
  );
};

// --- Main Page Component ---
export default function Meeting() {
  const [meetings, setMeetings] = useState([
    { Assigned_Lead_ID: 1, Business_Name: 'Acme Corp', Meeting_Date: '2026-05-01', Meeting_Time: '10:00 AM', Meeting_Type: 'Online', Remarks: 'Wants a full CRM overhaul.', Meeting_Notes: 'Send link via Zoom.', Service_Offered: 'Custom CRM', Admin_Notes: '', Completed: false, Deal_Closed: null },
    { Assigned_Lead_ID: 2, Business_Name: 'TechFlow Inc', Meeting_Date: '2026-05-02', Meeting_Time: '02:30 PM', Meeting_Type: 'Face-to-Face', Remarks: 'Interested in AI tools.', Meeting_Notes: 'Meeting at their downtown office.', Service_Offered: 'AI Integration', Admin_Notes: 'They loved the demo.', Completed: true, Deal_Closed: 'Yes' }
  ]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState('10');
  const [activeDropdown, setActiveDropdown] = useState(null);

  // --- VIEW MODAL STATES ---
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [viewLead, setViewLead] = useState(null);
  const [activeTab, setActiveTab] = useState('details');
  const [leadHistory, setLeadHistory] = useState([]);

  // Pagination Setup
  const totalItems = meetings.length;
  const actualItemsPerPage = itemsPerPage === 'All' ? totalItems : parseInt(itemsPerPage, 10);
  const totalPages = actualItemsPerPage > 0 ? Math.ceil(totalItems / actualItemsPerPage) : 1;
  const startIndex = (currentPage - 1) * actualItemsPerPage;
  const endIndex = itemsPerPage === 'All' ? totalItems : Math.min(startIndex + actualItemsPerPage, totalItems);
  const currentMeetings = meetings.slice(startIndex, endIndex);

  // --- MODAL HANDLERS ---
  const fetchLeadHistory = async (leadId) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/assigned-leads/${leadId}/history`);
      setLeadHistory(response.data);
    } catch (error) {
      console.error("Error fetching lead history:", error);
    }
  };

  const openViewModal = (lead) => {
    setViewLead(lead);
    setActiveTab('details');
    setIsViewOpen(true);
    fetchLeadHistory(lead.Lead_ID);
  };

  const closeViewModal = () => {
    setIsViewOpen(false);
    setViewLead(null);
    setLeadHistory([]);
  };

  const toggleDropdown = (id) => setActiveDropdown(activeDropdown === id ? null : id);
  const handleDropdownChange = () => {};
  const handleManualChange = () => {};
  const savePipelineField = () => {};

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
                {/* SINGLE HEADER ROW */}
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
                    
                    {/* TOP ROW (Date, Time, Type, Emp Remarks, Pre-Notes) */}
                    <tr className="hover:bg-purple-50/20 transition-colors group/top align-middle">
                      {/* Sticky Business Name spanning 2 rows */}
                      <td rowSpan="2" className="px-6 py-4 whitespace-nowrap sticky left-0 bg-white border-b-2 border-gray-200 border-r border-gray-100 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] z-10 align-top pt-6">
                        <button onClick={() => openViewModal(lead)} className="flex flex-col text-left group/btn outline-none">
                          <span className="font-bold text-[#7E3A99] group-hover/btn:text-[#19a828] transition-colors text-base">
                            {lead.lead?.Business_Name || lead.Business_Name || 'Unknown Business'}
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

                    {/* BOTTOM ROW (With Inline Labels on Top) */}
                    <tr className="bg-gray-50/40 hover:bg-purple-50/30 transition-colors group/bottom align-top border-b-2 border-gray-200">
                      
                      <td className="px-3 py-3 text-center">
                        <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Service Offered</span>
                        <AutoResizeTextarea
                          value={lead.Service_Offered}
                          placeholder="Add service..."
                          readOnly={true}
                        />
                      </td>

                      <td colSpan="2" className="px-3 py-3 text-center">
                        <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Meeting Notes</span>
                        <AutoResizeTextarea
                          value={lead.Admin_Notes}
                          placeholder="Type live meeting notes here..."
                          onChange={(val) => handleManualChange(lead.Assigned_Lead_ID, 'Admin_Notes', val)}
                          onBlur={(val) => savePipelineField(lead.Assigned_Lead_ID, 'Admin_Notes', val)}
                        />
                      </td>

                      <td className="px-3 py-3 text-center">
                        <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Completed</span>
                        <div className="flex items-center justify-center">
                          <input
                            type="checkbox"
                            checked={lead.Completed || false}
                            onChange={(e) => {
                              const isChecked = e.target.checked;
                              handleManualChange(lead.Assigned_Lead_ID, 'Completed', isChecked);
                              savePipelineField(lead.Assigned_Lead_ID, 'Completed', isChecked);
                            }}
                            className="w-5 h-5 cursor-pointer accent-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
                          />
                        </div>
                      </td>

                      <td className="px-3 py-3 text-center">
                        <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Deal Closed</span>
                        <ChipSelect 
                          value={lead.Deal_Closed === true ? 'Yes' : (lead.Deal_Closed === false ? 'No' : null)} 
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
      </main>
    </div>
  );
}