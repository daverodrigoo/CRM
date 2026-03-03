import React, { useState } from 'react';
import Navbar from '../components/Navbar';

// Helper to get today's date in YYYY-MM-DD format (Local Timezone)
const getTodayDate = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Initial Mock Data 
const initialLeads = [
  {
    Lead_ID: 'CHIMES-00001', Date_Added: '2026-02-23', Business_Name: 'THIAN RODRIGUEZ',
    Contact_Person_First_Name: 'Christian', Contact_Last_Name: 'Rodriguez', Contact_Person_Phone: '9171742492', Contact_Person_Email: '-',
    Business_Owner_First_Name: '', Business_Owner_Last_Name: '', Business_Owner_Phone: '', Business_Owner_Email: '',
    Business_Phone: '', Business_Email: '', Tab_Category: '', Solution_Needed: 'Website Improvement',
    Website_Link: 'https://linktr.ee/thianrodriguezmnl', Industry: 'Fashion', Source: 'Facebook',
    Social_Media: [''], 
    Remarks: ''
  }
];

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
      
      {/* Row 1: Business Name, Industry, Date Added */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1"><label className="text-xs font-semibold text-gray-500">Business Name <span className="text-red-500">*</span></label><input type="text" name="Business_Name" value={formData.Business_Name} onChange={handleInputChange} disabled={isReadonly} className="w-full border rounded p-2 text-sm disabled:bg-gray-50" /></div>
        <div className="space-y-1"><label className="text-xs font-semibold text-gray-500">Industry <span className="text-red-500">*</span></label><input type="text" name="Industry" value={formData.Industry} onChange={handleInputChange} disabled={isReadonly} className="w-full border rounded p-2 text-sm disabled:bg-gray-50" /></div>
        <div className="space-y-1"><label className="text-xs font-semibold text-gray-500">Date Added</label><input type="date" name="Date_Added" value={formData.Date_Added} onChange={handleInputChange} disabled={true} className="w-full border rounded p-2 text-sm disabled:bg-gray-50" /></div>
      </div>

      {/* Row 2: Business Phone, Business Email, Website Link */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1"><label className="text-xs font-semibold text-gray-500">Business Phone</label><input type="text" name="Business_Phone" value={formData.Business_Phone} onChange={handleInputChange} disabled={isReadonly} className="w-full border rounded p-2 text-sm disabled:bg-gray-50" /></div>
        <div className="space-y-1"><label className="text-xs font-semibold text-gray-500">Business Email</label><input type="email" name="Business_Email" value={formData.Business_Email} onChange={handleInputChange} disabled={isReadonly} className="w-full border rounded p-2 text-sm disabled:bg-gray-50" /></div>
        <div className="space-y-1"><label className="text-xs font-semibold text-gray-500">Website Link</label><input type="text" name="Website_Link" value={formData.Website_Link} onChange={handleInputChange} disabled={isReadonly} className="w-full border rounded p-2 text-sm disabled:bg-gray-50" /></div>
      </div>

      {/* Row 3: Business Owner First Name, Last Name, Phone, Email */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 border border-gray-200 rounded-lg p-4 bg-gray-50/50">
        <h3 className="col-span-1 md:col-span-4 text-sm font-bold text-gray-700 border-b pb-2 mb-2">Business Owner</h3>
        <div className="space-y-1"><label className="text-xs font-semibold text-gray-500">First Name</label><input type="text" name="Business_Owner_First_Name" value={formData.Business_Owner_First_Name} onChange={handleInputChange} disabled={isReadonly} className="w-full border rounded p-2 text-sm disabled:bg-gray-50 bg-white" /></div>
        <div className="space-y-1"><label className="text-xs font-semibold text-gray-500">Last Name</label><input type="text" name="Business_Owner_Last_Name" value={formData.Business_Owner_Last_Name} onChange={handleInputChange} disabled={isReadonly} className="w-full border rounded p-2 text-sm disabled:bg-gray-50 bg-white" /></div>
        <div className="space-y-1"><label className="text-xs font-semibold text-gray-500">Phone</label><input type="text" name="Business_Owner_Phone" value={formData.Business_Owner_Phone} onChange={handleInputChange} disabled={isReadonly} className="w-full border rounded p-2 text-sm disabled:bg-gray-50 bg-white" /></div>
        <div className="space-y-1"><label className="text-xs font-semibold text-gray-500">Email</label><input type="email" name="Business_Owner_Email" value={formData.Business_Owner_Email} onChange={handleInputChange} disabled={isReadonly} className="w-full border rounded p-2 text-sm disabled:bg-gray-50 bg-white" /></div>
      </div>

      {/* Row 4: Contact First Name, Contact Last Name, Contact Phone, Contact Email */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 border border-gray-200 rounded-lg p-4 bg-gray-50/50">
        <h3 className="col-span-1 md:col-span-4 text-sm font-bold text-gray-700 border-b pb-2 mb-2">Contact Person</h3>
        <div className="space-y-1"><label className="text-xs font-semibold text-gray-500">First Name</label><input type="text" name="Contact_Person_First_Name" value={formData.Contact_Person_First_Name} onChange={handleInputChange} disabled={isReadonly} className="w-full border rounded p-2 text-sm disabled:bg-gray-50 bg-white" /></div>
        <div className="space-y-1"><label className="text-xs font-semibold text-gray-500">Last Name</label><input type="text" name="Contact_Last_Name" value={formData.Contact_Last_Name} onChange={handleInputChange} disabled={isReadonly} className="w-full border rounded p-2 text-sm disabled:bg-gray-50 bg-white" /></div>
        <div className="space-y-1"><label className="text-xs font-semibold text-gray-500">Phone</label><input type="text" name="Contact_Person_Phone" value={formData.Contact_Person_Phone} onChange={handleInputChange} disabled={isReadonly} className="w-full border rounded p-2 text-sm disabled:bg-gray-50 bg-white" /></div>
        <div className="space-y-1"><label className="text-xs font-semibold text-gray-500">Email</label><input type="email" name="Contact_Person_Email" value={formData.Contact_Person_Email} onChange={handleInputChange} disabled={isReadonly} className="w-full border rounded p-2 text-sm disabled:bg-gray-50 bg-white" /></div>
      </div>

      {/* Row 5: Source, Tab Category */}
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

      {/* Row 6: Social Media (Dynamic Inputs) */}
      <div className="space-y-2 border-t pt-4 mt-2">
        <label className="text-xs font-semibold text-gray-500 block">Social Media Links</label>
        {formData.Social_Media.map((url, index) => (
          <div key={index} className="flex gap-2">
            <input 
              type="text" 
              placeholder="https://..." 
              value={url} 
              onChange={(e) => handleSocialMediaChange(index, e.target.value)} 
              disabled={isReadonly} 
              className="flex-1 border rounded p-2 text-sm disabled:bg-gray-50" 
            />
            {!isReadonly && formData.Social_Media.length > 1 && (
              <button 
                type="button" 
                onClick={() => removeSocialMedia(index)} 
                className="px-3 py-2 bg-red-100 text-red-600 hover:bg-red-200 rounded text-sm font-semibold transition-colors"
              >
                X
              </button>
            )}
          </div>
        ))}
        {!isReadonly && (
          <button 
            type="button" 
            onClick={addSocialMedia} 
            className="text-xs font-bold text-[#7E3A99] hover:text-[#19a828] transition-colors mt-1 inline-block"
          >
            + Add Social Media
          </button>
        )}
      </div>

      {/* Row 7: Solution Needed */}
      <div className="space-y-1 border-t pt-4 mt-2"><label className="text-xs font-semibold text-gray-500">Solution Needed</label><textarea name="Solution_Needed" value={formData.Solution_Needed} onChange={handleInputChange} disabled={isReadonly} className="w-full border rounded p-2 text-sm disabled:bg-gray-50 h-24"></textarea></div>

      {/* Row 8: Remarks */}
      <div className="space-y-1"><label className="text-xs font-semibold text-gray-500">Remarks</label><textarea name="Remarks" value={formData.Remarks} onChange={handleInputChange} disabled={isReadonly} className="w-full border rounded p-2 text-sm disabled:bg-gray-50 h-24"></textarea></div>
    </div>
  );
};

export default function Leads() {
  const [leads, setLeads] = useState(initialLeads);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [isEditMode, setIsEditMode] = useState(false);
  
  const [errorMsg, setErrorMsg] = useState('');

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSocialMediaChange = (index, value) => {
    const newSocialMedia = [...formData.Social_Media];
    newSocialMedia[index] = value;
    setFormData({ ...formData, Social_Media: newSocialMedia });
  };

  const addSocialMedia = () => {
    setFormData({ ...formData, Social_Media: [...formData.Social_Media, ''] });
  };

  const removeSocialMedia = (index) => {
    const newSocialMedia = formData.Social_Media.filter((_, i) => i !== index);
    setFormData({ ...formData, Social_Media: newSocialMedia });
  };

  const validateForm = () => {
    const requiredFields = ['Business_Name', 'Industry'];
    const missingFields = requiredFields.filter(field => !formData[field] || String(formData[field]).trim() === '');
    
    if (missingFields.length > 0) {
      setErrorMsg('Please fill out all required fields marked with an asterisk (*).');
      return false;
    }
    setErrorMsg('');
    return true;
  };

  const handleSaveNew = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const newLead = { ...formData, Lead_ID: `CHIMES-${String(leads.length + 1).padStart(5, '0')}` };
    setLeads([...leads, newLead]);
    setIsAddOpen(false);
    setFormData(emptyForm);
    setErrorMsg('');
  };

  const openViewModal = (lead) => {
    setSelectedLead(lead);
    const formattedLead = {
      ...lead,
      Social_Media: Array.isArray(lead.Social_Media) ? lead.Social_Media : ['']
    };
    setFormData(formattedLead);
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

  const confirmDelete = () => {
    setLeads(leads.filter(l => l.Lead_ID !== selectedLead.Lead_ID));
    setIsDeleteOpen(false);
    setIsViewOpen(false);
    setErrorMsg('');
  };

  const closeModals = () => {
    setIsAddOpen(false);
    setIsViewOpen(false);
    setIsEditMode(false);
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="pt-28 px-8 pb-12 max-w-[96%] mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Leads Management</h1>
          <button 
            onClick={() => { 
              setFormData({ ...emptyForm, Date_Added: getTodayDate() }); 
              setIsAddOpen(true); 
              setErrorMsg(''); 
            }}
            className="bg-[#7E3A99] hover:bg-[#19a828] text-white px-5 py-2 rounded-md font-medium transition-colors shadow-sm"
          >
            + Add Lead
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm text-left">
            <thead className="bg-[#7E3A99] text-[#f8f7fa] font-semibold">
              <tr>
                <th className="px-6 py-4 whitespace-nowrap">Business Name</th>
                <th className="px-6 py-4 whitespace-nowrap">Industry</th>
                <th className="px-6 py-4 whitespace-nowrap">Business Owner Info</th>
                <th className="px-6 py-4 whitespace-nowrap">Business Info</th>
                <th className="px-6 py-4 whitespace-nowrap">Contact Person Info</th>
                <th className="px-6 py-4 text-center whitespace-nowrap">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {leads.map((lead) => (
                <tr key={lead.Lead_ID} className="odd:bg-white even:bg-gray-50 hover:bg-gray-100 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{lead.Business_Name}</td>
                  <td className="px-6 py-4 text-gray-600">{lead.Industry}</td>
                  
                  <td className="px-6 py-4 text-gray-500 text-xs">
                    <div>📞 {lead.Business_Owner_Phone || 'N/A'}</div>
                    <div>✉️ {lead.Business_Owner_Email || 'N/A'}</div>
                  </td>

                  <td className="px-6 py-4 text-gray-500 text-xs">
                    <div>📞 {lead.Business_Phone || 'N/A'}</div>
                    <div>✉️ {lead.Business_Email || 'N/A'}</div>
                  </td>

                  <td className="px-6 py-4 text-gray-500 text-xs">
                    <div>📞 {lead.Contact_Person_Phone || 'N/A'}</div>
                    <div>✉️ {lead.Contact_Person_Email || 'N/A'}</div>
                  </td>

                  <td className="px-6 py-4 text-center">
                    <button 
                      onClick={() => openViewModal(lead)}
                      className="text-[#7E3A99] hover:text-[#19a828] font-bold transition-colors"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
              {leads.length === 0 && (
                <tr><td colSpan="6" className="px-6 py-8 text-center text-gray-500">No leads found. Click "Add Lead" to get started.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* MODAL: Add Lead */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
              <h2 className="text-xl font-bold text-gray-800">Add New Lead</h2>
              <button onClick={closeModals} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
            </div>
            <div className="p-6 overflow-y-auto">
              <LeadForm 
                formData={formData} 
                handleInputChange={handleInputChange} 
                handleSocialMediaChange={handleSocialMediaChange}
                addSocialMedia={addSocialMedia}
                removeSocialMedia={removeSocialMedia}
                isReadonly={false}
                isEditMode={false}
              />
            </div>
            <div className="px-6 py-4 border-t bg-gray-50 flex justify-between items-center">
              <div className="text-red-600 text-sm font-semibold">{errorMsg}</div>
              <div className="flex gap-3">
                <button onClick={closeModals} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md">Cancel</button>
                <button onClick={handleSaveNew} className="px-6 py-2 bg-[#7E3A99] hover:bg-[#19a828] text-white rounded-md font-medium transition-colors">Save Lead</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: View / Edit Lead */}
      {isViewOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
              <h2 className="text-xl font-bold text-gray-800">{isEditMode ? 'Edit Lead' : 'Lead Details'} - {selectedLead?.Lead_ID}</h2>
              <button onClick={closeModals} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
            </div>
            <div className="p-6 overflow-y-auto">
              <LeadForm 
                formData={formData} 
                handleInputChange={handleInputChange} 
                handleSocialMediaChange={handleSocialMediaChange}
                addSocialMedia={addSocialMedia}
                removeSocialMedia={removeSocialMedia}
                isReadonly={!isEditMode}
                isEditMode={isEditMode}
              />
            </div>
            <div className="px-6 py-4 border-t bg-gray-50 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <button onClick={() => setIsDeleteOpen(true)} className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-md font-medium transition-colors">Delete Lead</button>
                <span className="text-red-600 text-sm font-semibold">{errorMsg}</span>
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

      {/* MODAL: Delete Confirmation */}
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