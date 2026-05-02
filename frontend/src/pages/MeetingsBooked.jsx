import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

// --- Helper Data & Components (Copied from Meeting.jsx) ---
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
        <div className="space-y-1"><label className="text-xs font-semibold text-gray-500">Business Name</label><input type="text" value={formData.Business_Name || ''} disabled={isReadonly} className="w-full border rounded p-2 text-sm disabled:bg-gray-50 bg-white" /></div>
        <div className="space-y-1"><label className="text-xs font-semibold text-gray-500">Industry</label><input type="text" value={formData.Industry || ''} disabled={isReadonly} className="w-full border rounded p-2 text-sm disabled:bg-gray-50 bg-white" /></div>
        <div className="space-y-1"><label className="text-xs font-semibold text-gray-500">Date Added</label><input type="date" value={formData.Date_Added ? formData.Date_Added.split('T')[0] : ''} disabled={true} className="w-full border rounded p-2 text-sm disabled:bg-gray-50" /></div>
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

export default function MeetingsBooked() {
  // --- Table Data States ---
  const [meetings, setMeetings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [serverError, setServerError] = useState(null);

  // --- Modal & History States (Copied from Meeting.jsx) ---
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [modalTab, setModalTab] = useState('details'); 
  const [leadHistory, setLeadHistory] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  useEffect(() => {
    fetchMyBookedMeetings();
  }, []);

  const fetchMyBookedMeetings = async () => {
    const userId = localStorage.getItem('USER_ID');
    if (!userId) {
      setServerError("Please log in to view your booked meetings.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.get(`http://localhost:8000/api/meetings/employee-booked/${userId}`);
      setMeetings(response.data);
      setServerError(null);
    } catch (err) {
      console.error("Error fetching booked meetings:", err);
      const exactError = err.response?.data?.error || "Failed to load meetings from the server.";
      setServerError(exactError);
    } finally {
      setIsLoading(false);
    }
  };

  // --- Modal Handlers (Copied from Meeting.jsx) ---
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

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Deal Closed': return <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold uppercase rounded-full">Deal Closed</span>;
      case 'Deal Lost': return <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold uppercase rounded-full">Deal Lost</span>;
      case 'Completed': return <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold uppercase rounded-full">Completed</span>;
      case 'Upcoming': return <span className="px-2 py-1 bg-purple-100 text-[#7E3A99] text-xs font-bold uppercase rounded-full">Upcoming</span>;
      default: return <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-bold uppercase rounded-full">Unknown</span>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="pt-28 px-8 pb-12 max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">My Booked Meetings</h1>
          <p className="text-gray-500 text-sm mt-1">Track the status of meetings you have successfully scheduled.</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto"> 
            <table className="min-w-full text-sm text-left border-collapse">
              <thead className="bg-[#7E3A99] text-white">
                <tr>
                  <th className="px-6 py-4 font-semibold whitespace-nowrap">Business Name</th>
                  <th className="px-6 py-4 font-semibold whitespace-nowrap text-center">Assigned To</th>
                  <th className="px-6 py-4 font-semibold whitespace-nowrap text-center">Meeting Date</th>
                  <th className="px-6 py-4 font-semibold whitespace-nowrap text-center">Meeting Time</th>
                  <th className="px-6 py-4 font-semibold whitespace-nowrap text-center">Meeting Type</th>
                  <th className="px-6 py-4 font-semibold whitespace-nowrap text-center">Service Offered</th>
                  <th className="px-6 py-4 font-semibold whitespace-nowrap text-center">Status</th>
                </tr>
              </thead>
              
              <tbody className="divide-y divide-gray-100">
                {isLoading ? (
                  <tr><td colSpan="7" className="px-6 py-12 text-center text-gray-500">Loading your scheduled meetings...</td></tr>
                ) : serverError ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <p className="text-red-600 font-bold text-lg mb-2">Backend Error Detected:</p>
                      <code className="bg-red-50 text-red-500 px-4 py-3 rounded-md block mx-auto max-w-3xl border border-red-200 text-sm">
                        {serverError}
                      </code>
                    </td>
                  </tr>
                ) : meetings.length === 0 ? (
                  <tr><td colSpan="6" className="px-6 py-12 text-center text-gray-500">No meetings booked yet.</td></tr>
                ) : (
                  meetings.map((meeting, index) => (
                    <tr key={index} className="hover:bg-purple-50 transition-colors">
                      <td className="px-6 py-4 font-bold whitespace-nowrap">
                        <button 
                          onClick={() => openViewModal(meeting)} 
                          className="text-[#7E3A99] hover:text-[#19a828] hover:underline transition-colors outline-none text-left"
                        >
                          {meeting.Business_Name}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-center text-gray-700 capitalize font-medium">{meeting.Meeting_Assigned_to || '-'}</td>
                      <td className="px-6 py-4 text-center text-gray-700">{meeting.Meeting_Date ? new Date(meeting.Meeting_Date).toLocaleDateString() : '-'}</td>
                      <td className="px-6 py-4 text-center text-gray-700">{meeting.Meeting_Time || '-'}</td>
                      <td className="px-6 py-4 text-center text-gray-700 capitalize">{meeting.Meeting_Type || '-'}</td>
                      <td className="px-6 py-4 text-center text-gray-700">{meeting.Service_Offered || '-'}</td>
                      <td className="px-6 py-4 text-center">{getStatusBadge(meeting.Live_Status)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* --- View Modal with Tab Switcher (Copied exactly from Meeting.jsx) --- */}
        {isViewOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-7xl max-h-[90vh] flex flex-col overflow-hidden animate-fade-in-down">
              
              <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setModalTab('details')}
                    className={`text-xl transition-colors outline-none ${modalTab === 'details' ? 'font-bold text-gray-800' : 'font-semibold text-gray-400 hover:text-gray-600'}`}
                  >
                    Lead Details - {selectedLead?.Lead_ID || selectedLead?.masterLead?.Lead_ID || 'N/A'}
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