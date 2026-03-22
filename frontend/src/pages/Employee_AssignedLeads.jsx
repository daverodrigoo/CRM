import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

const getStoredUser = () => {
  try {
    const userStr = localStorage.getItem('user');
    if (userStr) return JSON.parse(userStr);
  } catch (e) {}
  return null;
};

const emptyForm = {
  Lead_ID: '', Date_Added: '', Business_Name: '', 
  Contact_Person_First_Name: '', Contact_Last_Name: '', Contact_Person_Phone: '', Contact_Person_Email: '',
  Business_Owner_First_Name: '', Business_Owner_Last_Name: '', Business_Owner_Phone: '', Business_Owner_Email: '',
  Business_Phone: '', Business_Email: '', Tab_Category: '',
  Solution_Needed: '', Website_Link: '', Industry: '', Source: '', 
  Social_Media: [''], Remarks: ''
};

const LeadForm = ({ formData, isReadonly }) => {
  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1"><label className="text-xs font-semibold text-gray-500">Business Name</label><input type="text" value={formData.Business_Name} disabled={isReadonly} className="w-full border rounded p-2 text-sm disabled:bg-gray-50" /></div>
        <div className="space-y-1"><label className="text-xs font-semibold text-gray-500">Industry</label><input type="text" value={formData.Industry} disabled={isReadonly} className="w-full border rounded p-2 text-sm disabled:bg-gray-50" /></div>
        <div className="space-y-1"><label className="text-xs font-semibold text-gray-500">Date Added</label><input type="date" value={formData.Date_Added} disabled={true} className="w-full border rounded p-2 text-sm disabled:bg-gray-50" /></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1"><label className="text-xs font-semibold text-gray-500">Business Phone</label><input type="text" value={formData.Business_Phone} disabled={isReadonly} className="w-full border rounded p-2 text-sm disabled:bg-gray-50" /></div>
        <div className="space-y-1"><label className="text-xs font-semibold text-gray-500">Business Email</label><input type="email" value={formData.Business_Email} disabled={isReadonly} className="w-full border rounded p-2 text-sm disabled:bg-gray-50" /></div>
        <div className="space-y-1"><label className="text-xs font-semibold text-gray-500">Website Link</label><input type="text" value={formData.Website_Link} disabled={isReadonly} className="w-full border rounded p-2 text-sm disabled:bg-gray-50" /></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 border border-gray-200 rounded-lg p-4 bg-gray-50/50">
        <h3 className="col-span-1 md:col-span-4 text-sm font-bold text-gray-700 border-b pb-2 mb-2">Business Owner</h3>
        <div className="space-y-1"><label className="text-xs font-semibold text-gray-500">First Name</label><input type="text" value={formData.Business_Owner_First_Name} disabled={isReadonly} className="w-full border rounded p-2 text-sm disabled:bg-gray-50 bg-white" /></div>
        <div className="space-y-1"><label className="text-xs font-semibold text-gray-500">Last Name</label><input type="text" value={formData.Business_Owner_Last_Name} disabled={isReadonly} className="w-full border rounded p-2 text-sm disabled:bg-gray-50 bg-white" /></div>
        <div className="space-y-1"><label className="text-xs font-semibold text-gray-500">Phone</label><input type="text" value={formData.Business_Owner_Phone} disabled={isReadonly} className="w-full border rounded p-2 text-sm disabled:bg-gray-50 bg-white" /></div>
        <div className="space-y-1"><label className="text-xs font-semibold text-gray-500">Email</label><input type="email" value={formData.Business_Owner_Email} disabled={isReadonly} className="w-full border rounded p-2 text-sm disabled:bg-gray-50 bg-white" /></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 border border-gray-200 rounded-lg p-4 bg-gray-50/50">
        <h3 className="col-span-1 md:col-span-4 text-sm font-bold text-gray-700 border-b pb-2 mb-2">Contact Person</h3>
        <div className="space-y-1"><label className="text-xs font-semibold text-gray-500">First Name</label><input type="text" value={formData.Contact_Person_First_Name} disabled={isReadonly} className="w-full border rounded p-2 text-sm disabled:bg-gray-50 bg-white" /></div>
        <div className="space-y-1"><label className="text-xs font-semibold text-gray-500">Last Name</label><input type="text" value={formData.Contact_Last_Name} disabled={isReadonly} className="w-full border rounded p-2 text-sm disabled:bg-gray-50 bg-white" /></div>
        <div className="space-y-1"><label className="text-xs font-semibold text-gray-500">Phone</label><input type="text" value={formData.Contact_Person_Phone} disabled={isReadonly} className="w-full border rounded p-2 text-sm disabled:bg-gray-50 bg-white" /></div>
        <div className="space-y-1"><label className="text-xs font-semibold text-gray-500">Email</label><input type="email" value={formData.Contact_Person_Email} disabled={isReadonly} className="w-full border rounded p-2 text-sm disabled:bg-gray-50 bg-white" /></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1"><label className="text-xs font-semibold text-gray-500">Source</label>
          <input type="text" value={formData.Source} disabled={isReadonly} className="w-full border rounded p-2 text-sm disabled:bg-gray-50 bg-white" />
        </div>
        <div className="space-y-1"><label className="text-xs font-semibold text-gray-500">Tab Category</label><input type="text" value={formData.Tab_Category} disabled={isReadonly} className="w-full border rounded p-2 text-sm disabled:bg-gray-50" /></div>
      </div>

      <div className="space-y-2 border-t pt-4 mt-2">
        <label className="text-xs font-semibold text-gray-500 block">Social Media Links</label>
        {formData.Social_Media.map((url, index) => (
          <div key={index} className="flex gap-2">
            <input type="text" value={url} disabled={isReadonly} className="flex-1 border rounded p-2 text-sm disabled:bg-gray-50" />
          </div>
        ))}
      </div>

      <div className="space-y-1 border-t pt-4 mt-2"><label className="text-xs font-semibold text-gray-500">Solution Needed</label><textarea value={formData.Solution_Needed} disabled={isReadonly} className="w-full border rounded p-2 text-sm disabled:bg-gray-50 h-24"></textarea></div>
      <div className="space-y-1"><label className="text-xs font-semibold text-gray-500">Remarks</label><textarea value={formData.Remarks} disabled={isReadonly} className="w-full border rounded p-2 text-sm disabled:bg-gray-50 h-24"></textarea></div>
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
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onBlur={(e) => onBlur(e.target.value)}
      placeholder={placeholder}
      rows={1}
      className="w-full bg-transparent border border-transparent hover:border-gray-300 focus:border-[#7E3A99] focus:ring-1 focus:ring-[#7E3A99] rounded px-2 py-1.5 text-gray-700 text-[12px] transition-all outline-none placeholder:text-gray-300 resize-none overflow-hidden leading-snug min-h-[30px]"
    />
  );
};

const OPTIONS = {
  Lead_Status: ['New Lead', 'Contacted'],
  Inquiry_Sent: ['Yes', 'No'],
  Inquiry_Type: ['Cold Call', 'Email', 'Message'], 
  Replied: ['Yes', 'No'],
  Email_Sent: ['Yes', 'No'],
  Email_Replied: ['Yes', 'No'],
  Meeting_Booked: ['Yes', 'No']
};

const getChipColor = (value) => {
  switch (value) {
    case 'Yes': return 'bg-[#d8f3dc] text-[#117b34] hover:bg-[#c8e6c9]'; 
    case 'No': return 'bg-[#fce8e6] text-[#c5221f] hover:bg-[#fad2cf]'; 
    case 'New Lead': return 'bg-[#e8f0fe] text-[#1967d2] hover:bg-[#d2e3fc]'; 
    case 'Contacted': return 'bg-[#fdf2f8] text-[#be185d] hover:bg-[#fce7f3]';
    case 'Cold Call': return 'bg-[#feefe3] text-[#e27300] hover:bg-[#fddbc2]'; 
    case 'Email': return 'bg-[#e2f6fd] text-[#037a9f] hover:bg-[#c2ebfa]'; 
    case 'Message': return 'bg-[#f3e8fd] text-[#8019e6] hover:bg-[#e9d2fa]'; 
    case 'None': return 'bg-white text-gray-400 border border-gray-200 hover:bg-gray-50';
    default: return 'bg-[#f1f3f4] text-[#5f6368] hover:bg-[#e8eaed]';
  }
};

const ChipSelect = ({ value, options, onChange, isOpen, onToggle }) => {
  return (
    <div className="relative inline-block text-left w-full max-w-[120px] mx-auto">
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onToggle(); }}
        className={`relative z-40 flex items-center justify-center gap-1.5 w-full px-2.5 py-1 text-[11px] font-semibold leading-tight rounded-full cursor-pointer outline-none transition-colors border border-transparent ${getChipColor(value)}`}
      >
        <span className="truncate">{value || 'None'}</span>
        <svg width="7" height="5" viewBox="0 0 7 5" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="opacity-70 flex-shrink-0 mt-[1px]"><path d="M3.5 5L0 0H7L3.5 5Z" /></svg>
      </button>

      {isOpen && (
        <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1 min-w-[130px] bg-white rounded-lg shadow-[0_2px_10px_rgba(0,0,0,0.15)] border border-gray-100 z-50 py-1 overflow-hidden animate-fade-in-down">
          {options.map((opt) => (
            <div
              key={opt}
              onClick={(e) => { e.stopPropagation(); onChange(opt); }}
              className={`px-3 py-1.5 text-[12px] font-medium cursor-pointer transition-colors flex items-center gap-2 ${value === opt ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${getChipColor(opt).split(' ')}`}></div>
              <span className="truncate">{opt}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default function Employee_AssignedLeads() {
  const [leads, setLeads] = useState([]);
  const [activeDropdown, setActiveDropdown] = useState(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState('10');
  
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => {
    fetchAssignedLeads();
    const handleWindowClick = () => setActiveDropdown(null);
    window.addEventListener('click', handleWindowClick);
    return () => window.removeEventListener('click', handleWindowClick);
  }, []);

  useEffect(() => { setCurrentPage(1); }, [itemsPerPage]);

  const fetchAssignedLeads = async () => {
    const userId = localStorage.getItem('USER_ID');
    if (!userId) return;

    try {
      const response = await axios.get(`http://localhost:8000/api/leads/assigned/${userId}`);
      const formattedLeads = response.data.map(lead => {
        const business = lead.business || {};
        return {
          Lead_ID: lead.Lead_ID, Date_Added: lead.Date_Added, Source: lead.Source || '',
          Tab_Category: lead.Tab_Category || '', Solution_Needed: lead.Solution_Needed || '', Remarks: lead.Remarks || '',
          Business_Name: business.Business_Name || '', Industry: business.Industry || '', Website_Link: business.Website_Link || '',
          Contact_Person_First_Name: business.Contact_Person_First_Name || '', Contact_Last_Name: business.Contact_Last_Name || '',
          Contact_Person_Phone: business.Contact_Person_Phone || '', Contact_Person_Email: business.Contact_Person_Email || '',
          Business_Owner_First_Name: business.Business_Owner_First_Name || '', Business_Owner_Last_Name: business.Business_Owner_Last_Name || '',
          Business_Owner_Phone: business.Business_Owner_Phone || '', Business_Owner_Email: business.Business_Owner_Email || '',
          Business_Phone: business.Business_Phone || '', Business_Email: business.Business_Email || '',
          Social_Media: business.social_media && business.social_media.length > 0 ? business.social_media.map(sm => sm.URL) : [''],
          
          Lead_Status: lead.pipeline?.Lead_Status || 'New Lead',
          Inquiry_Sent: lead.pipeline?.Inquiry_Sent ? 'Yes' : 'No',
          Inquiry_Type: lead.inquiry?.Inquiry_Type || 'Email', 
          Replied: lead.pipeline?.Replied ? 'Yes' : 'No',
          Email_Sent: lead.pipeline?.Email_Sent ? 'Yes' : 'No',
          Email_Replied: lead.pipeline?.Email_Replied ? 'Yes' : 'No',
          Date_Dialed: lead.pipeline?.Date_Dialed || '',
          Pipeline_Remarks: lead.pipeline?.Remarks || '',
          Meeting_Booked: lead.pipeline?.Meeting_Booked ? 'Yes' : 'No',
        };
      });
      setLeads(formattedLeads);
    } catch (error) {
      console.error("Error fetching assigned leads:", error);
    }
  };

  // THE FIX: ACTUALLY SAVE THE PIPELINE DROPDOWNS TO THE DATABASE
  const savePipelineField = async (leadId, field, value) => {
    try {
      await axios.put(`http://localhost:8000/api/leads/${leadId}/pipeline`, { field, value });
    } catch (error) {
      console.error(`Failed to auto-save ${field}:`, error);
    }
  };

  const handleDropdownChange = (leadId, field, newValue) => {
    setLeads(leads.map(lead => lead.Lead_ID === leadId ? { ...lead, [field]: newValue } : lead));
    setActiveDropdown(null); 
    savePipelineField(leadId, field, newValue); // Triggers the auto-save!
  };

  const handleManualChange = (leadId, field, newValue) => {
    setLeads(leads.map(lead => lead.Lead_ID === leadId ? { ...lead, [field]: newValue } : lead));
  };

  const toggleDropdown = (dropdownId) => {
    setActiveDropdown(activeDropdown === dropdownId ? null : dropdownId);
  };

  const openViewModal = (lead) => {
    setSelectedLead(lead);
    setFormData(lead);
    setIsViewOpen(true);
  };

  const handleAppointmentClick = (leadId) => {
    console.log(`Appointment button clicked for lead: ${leadId}`);
  };

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
          <div><h1 className="text-2xl font-bold text-gray-800">Assigned Leads</h1></div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col">
          <div> 
            <table className="min-w-full divide-y divide-gray-200 text-sm text-left">
              <thead className="bg-[#7E3A99] text-white select-none">
                <tr>
                  <th className="px-6 py-4 font-semibold tracking-wider whitespace-nowrap sticky left-0 bg-[#7E3A99] z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.3)] rounded-tl-lg">Business Name</th>
                  <th className="px-3 py-4 font-semibold tracking-wider whitespace-nowrap text-center">Lead Status</th>
                  <th className="px-3 py-4 font-semibold tracking-wider whitespace-nowrap text-center">Inquiry Sent</th>
                  <th className="px-3 py-4 font-semibold tracking-wider whitespace-nowrap text-center">Inquiry Type</th>
                  <th className="px-3 py-4 font-semibold tracking-wider whitespace-nowrap text-center">Replied</th>
                  <th className="px-3 py-4 font-semibold tracking-wider whitespace-nowrap text-center">Email Sent</th>
                  <th className="px-3 py-4 font-semibold tracking-wider whitespace-nowrap text-center">Email Replied</th>
                  <th className="px-2 py-4 font-semibold tracking-wider whitespace-nowrap text-center w-[110px]">Date Dialed</th>
                  <th className="px-3 py-4 font-semibold tracking-wider whitespace-nowrap min-w-[250px] text-center">Remarks</th>
                  <th className="px-3 py-4 font-semibold tracking-wider whitespace-nowrap text-center">Meeting Booked</th>
                  <th className="px-4 py-4 rounded-tr-lg"></th> 
                </tr>
              </thead>
              
              <tbody className="divide-y divide-gray-200 bg-white">
                {currentLeads.map((lead) => (
                  <tr key={lead.Lead_ID} className="hover:bg-purple-50/30 transition-colors group align-middle">
                    
                    <td className="px-6 py-4 whitespace-nowrap sticky left-0 bg-white group-hover:bg-[#faf5fc] transition-colors shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] z-10">
                      <button onClick={() => openViewModal(lead)} className="flex flex-col text-left group/btn outline-none">
                        <span className="font-bold text-[#7E3A99] group-hover/btn:text-[#19a828] transition-colors">{lead.Business_Name}</span>
                      </button>
                    </td>

                    <td className="px-3 py-3 text-center"><ChipSelect value={lead.Lead_Status} options={OPTIONS.Lead_Status} isOpen={activeDropdown === `${lead.Lead_ID}-Lead_Status`} onToggle={() => toggleDropdown(`${lead.Lead_ID}-Lead_Status`)} onChange={(val) => handleDropdownChange(lead.Lead_ID, 'Lead_Status', val)} /></td>
                    <td className="px-3 py-3 text-center"><ChipSelect value={lead.Inquiry_Sent} options={OPTIONS.Inquiry_Sent} isOpen={activeDropdown === `${lead.Lead_ID}-Inquiry_Sent`} onToggle={() => toggleDropdown(`${lead.Lead_ID}-Inquiry_Sent`)} onChange={(val) => handleDropdownChange(lead.Lead_ID, 'Inquiry_Sent', val)} /></td>
                    <td className="px-3 py-3 text-center"><ChipSelect value={lead.Inquiry_Type} options={OPTIONS.Inquiry_Type} isOpen={activeDropdown === `${lead.Lead_ID}-Inquiry_Type`} onToggle={() => toggleDropdown(`${lead.Lead_ID}-Inquiry_Type`)} onChange={(val) => handleDropdownChange(lead.Lead_ID, 'Inquiry_Type', val)} /></td>
                    <td className="px-3 py-3 text-center"><ChipSelect value={lead.Replied} options={OPTIONS.Replied} isOpen={activeDropdown === `${lead.Lead_ID}-Replied`} onToggle={() => toggleDropdown(`${lead.Lead_ID}-Replied`)} onChange={(val) => handleDropdownChange(lead.Lead_ID, 'Replied', val)} /></td>
                    <td className="px-3 py-3 text-center"><ChipSelect value={lead.Email_Sent} options={OPTIONS.Email_Sent} isOpen={activeDropdown === `${lead.Lead_ID}-Email_Sent`} onToggle={() => toggleDropdown(`${lead.Lead_ID}-Email_Sent`)} onChange={(val) => handleDropdownChange(lead.Lead_ID, 'Email_Sent', val)} /></td>
                    <td className="px-3 py-3 text-center"><ChipSelect value={lead.Email_Replied} options={OPTIONS.Email_Replied} isOpen={activeDropdown === `${lead.Lead_ID}-Email_Replied`} onToggle={() => toggleDropdown(`${lead.Lead_ID}-Email_Replied`)} onChange={(val) => handleDropdownChange(lead.Lead_ID, 'Email_Replied', val)} /></td>
                    
                    <td className="px-2 py-3 text-center">
                      <input 
                        type={lead.Date_Dialed ? 'date' : 'text'}
                        placeholder="mm/dd/yyyy"
                        onFocus={(e) => e.target.type = 'date'}
                        onBlur={(e) => { 
                          if (!e.target.value) e.target.type = 'text'; 
                          savePipelineField(lead.Lead_ID, 'Date_Dialed', e.target.value); // Trigger auto-save!
                        }}
                        value={lead.Date_Dialed} 
                        onChange={(e) => handleManualChange(lead.Lead_ID, 'Date_Dialed', e.target.value)}
                        className={`w-[105px] mx-auto bg-transparent border border-transparent hover:border-gray-300 focus:border-[#7E3A99] focus:ring-1 focus:ring-[#7E3A99] rounded px-1.5 py-1 text-[11px] transition-all outline-none text-center ${!lead.Date_Dialed ? 'text-gray-400 font-medium' : 'text-gray-700'}`}
                      />
                    </td>
                    <td className="px-3 py-3 text-center">
                      <AutoResizeTextarea
                        value={lead.Pipeline_Remarks}
                        placeholder="Add remarks..."
                        onChange={(val) => handleManualChange(lead.Lead_ID, 'Pipeline_Remarks', val)}
                        onBlur={(val) => savePipelineField(lead.Lead_ID, 'Pipeline_Remarks', val)} // Trigger auto-save!
                      />
                    </td>
                    
                    <td className="px-3 py-3 text-center"><ChipSelect value={lead.Meeting_Booked} options={OPTIONS.Meeting_Booked} isOpen={activeDropdown === `${lead.Lead_ID}-Meeting_Booked`} onToggle={() => toggleDropdown(`${lead.Lead_ID}-Meeting_Booked`)} onChange={(val) => handleDropdownChange(lead.Lead_ID, 'Meeting_Booked', val)} /></td>

                    <td className="px-4 py-3 text-center">
                      <button onClick={() => handleAppointmentClick(lead.Lead_ID)} className="p-1.5 text-[#7E3A99] hover:text-[#19a828] hover:bg-purple-50 rounded-md transition-colors" title="Schedule Appointment">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor" className="w-5 h-5 mx-auto"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z" /></svg>
                      </button>
                    </td>
                  </tr>
                ))}
                
                {currentLeads.length === 0 && (
                  <tr><td colSpan="11" className="px-6 py-12 text-center text-gray-500">You have no leads assigned to your pipeline yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
          
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

      {isViewOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-fade-in-down">
            <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
              <h2 className="text-xl font-bold text-gray-800">Lead Details - {selectedLead?.Lead_ID}</h2>
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