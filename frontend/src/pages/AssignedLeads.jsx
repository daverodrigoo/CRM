import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

export default function AssignedLeads() {
  const [employeeData, setEmployeeData] = useState([]);
  const [expandedEmpId, setExpandedEmpId] = useState(null);
  const [selectedBatch, setSelectedBatch] = useState(null); // Controls the modal

  useEffect(() => {
    fetchSummaryData();
  }, []);

  const fetchSummaryData = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/assigned-leads/summary');
      setEmployeeData(response.data);
      // Auto-expand the first employee if there is one
      if (response.data.length > 0) {
        setExpandedEmpId(response.data.User_ID);
      }
    } catch (error) {
      console.error("Error fetching progress summary:", error);
    }
  };

  const toggleAccordion = (userId) => {
    setExpandedEmpId(expandedEmpId === userId ? null : userId);
  };

  const openBatchModal = (batch, empName) => {
    setSelectedBatch({ ...batch, employeeName: empName });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="pt-28 px-8 pb-12 max-w-[98%] mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Team Progress Monitor</h1>
        </div>

        {employeeData.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center text-gray-500">
            No active batches have been assigned to any employees yet.
          </div>
        ) : (
          <div className="space-y-4">
            {employeeData.map((emp) => {
              // Calculate overall employee progress
              const totalEmpLeads = emp.Batches.reduce((sum, b) => sum + b.Total_Leads, 0);
              const totalEmpCompleted = emp.Batches.reduce((sum, b) => sum + b.Completed_Leads, 0);
              const overallPercent = totalEmpLeads === 0 ? 0 : Math.round((totalEmpCompleted / totalEmpLeads) * 100);

              return (
                <div key={emp.User_ID} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all">
                  
                  {/* Accordion Header */}
                  <div 
                    onClick={() => toggleAccordion(emp.User_ID)}
                    className="flex items-center justify-between p-5 cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-purple-100 text-[#7E3A99] flex items-center justify-center font-bold text-lg">
                        {emp.Name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-gray-800 capitalize">{emp.Name}</h2>
                        <p className="text-xs text-gray-500 font-medium">{emp.Email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-8">
                      <div className="text-right hidden md:block">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Overall Progress</p>
                        <p className="text-sm font-bold text-gray-800">{totalEmpCompleted} / {totalEmpLeads} Leads ({overallPercent}%)</p>
                      </div>
                      <div className={`transform transition-transform ${expandedEmpId === emp.User_ID ? 'rotate-180' : ''}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5 text-gray-400">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Accordion Body (The Batches) */}
                  {expandedEmpId === emp.User_ID && (
                    <div className="p-5 bg-gray-50 border-t border-gray-100">
                      {emp.Batches.length === 0 ? (
                        <p className="text-sm text-gray-500 italic">This employee currently has no active batches.</p>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                          {emp.Batches.map((batch) => {
                            const percent = batch.Total_Leads === 0 ? 0 : Math.round((batch.Completed_Leads / batch.Total_Leads) * 100);
                            
                            return (
                              <div key={batch.Batch_ID} className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-4">
                                  <h3 className="font-bold text-gray-800 text-base">{batch.Batch_Name}</h3>
                                  <span className="bg-purple-100 text-[#7E3A99] text-[10px] font-bold px-2 py-0.5 rounded-full">
                                    {batch.Total_Leads} Leads
                                  </span>
                                </div>
                                
                                {/* Progress Bar */}
                                <div className="mb-4">
                                  <div className="flex justify-between text-xs font-semibold text-gray-500 mb-1.5">
                                    <span>Progress</span>
                                    <span>{percent}%</span>
                                  </div>
                                  <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div className="bg-green-500 h-2 rounded-full transition-all duration-500" style={{ width: `${percent}%` }}></div>
                                  </div>
                                  <p className="text-xs text-gray-500 mt-1.5 text-right font-medium">{batch.Completed_Leads} / {batch.Total_Leads} Completed</p>
                                </div>

                                <button 
                                  onClick={() => openBatchModal(batch, emp.Name)}
                                  className="w-full py-2 bg-white border border-[#7E3A99] text-[#7E3A99] font-bold text-sm rounded-lg hover:bg-purple-50 transition-colors"
                                >
                                  View Leads
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* --- DRILL DOWN MODAL --- */}
      {selectedBatch && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col overflow-hidden animate-fade-in-down">
            
            <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
              <div>
                <h2 className="text-xl font-bold text-gray-800">{selectedBatch.Batch_Name}</h2>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mt-0.5">Assigned to: <span className="text-[#7E3A99] capitalize">{selectedBatch.employeeName}</span></p>
              </div>
              <button onClick={() => setSelectedBatch(null)} className="text-gray-400 hover:text-gray-600 text-2xl outline-none">&times;</button>
            </div>

            <div className="overflow-y-auto bg-gray-50 p-6 flex-1">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 text-sm text-left">
                  <thead className="bg-[#7E3A99] text-white select-none">
                    <tr>
                      <th className="px-6 py-4 font-semibold tracking-wider whitespace-nowrap">Business Name</th>
                      <th className="px-3 py-4 font-semibold tracking-wider whitespace-nowrap text-center">Status</th>
                      <th className="px-3 py-4 font-semibold tracking-wider whitespace-nowrap text-center">Inquiry Type</th>
                      <th className="px-3 py-4 font-semibold tracking-wider whitespace-nowrap text-center">Responded</th>
                      <th className="px-3 py-4 font-semibold tracking-wider whitespace-nowrap text-center">Meeting Booked</th>
                      <th className="px-3 py-4 font-semibold tracking-wider whitespace-nowrap">Remarks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {selectedBatch.Leads.map((lead) => (
                      <tr key={lead.Assigned_Lead_ID} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap font-bold text-gray-800">
                          {lead.Business_Name}
                        </td>
                        <td className="px-3 py-4 text-center whitespace-nowrap">
                          {lead.Completed ? (
                            <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2.5 py-1 rounded-full text-xs font-bold">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5"><path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" /></svg>
                              Done
                            </span>
                          ) : (
                            <span className="bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full text-xs font-bold">Pending</span>
                          )}
                        </td>
                        <td className="px-3 py-4 text-center whitespace-nowrap font-medium text-gray-600">{lead.Inquiry_Type}</td>
                        <td className="px-3 py-4 text-center whitespace-nowrap font-medium text-gray-600">{lead.Responded === true ? 'Yes' : (lead.Responded === false ? 'No' : '-')}</td>
                        <td className="px-3 py-4 text-center whitespace-nowrap font-medium text-gray-600">{lead.Meeting_Booked === true ? 'Yes' : (lead.Meeting_Booked === false ? 'No' : '-')}</td>
                        <td className="px-3 py-4 text-gray-600 max-w-[200px] truncate" title={lead.Remarks}>
                          {lead.Remarks || '-'}
                        </td>
                      </tr>
                    ))}
                    {selectedBatch.Leads.length === 0 && (
                      <tr><td colSpan="6" className="px-6 py-8 text-center text-gray-500 italic">No leads found in this batch.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="px-6 py-4 border-t bg-gray-50 flex justify-end items-center">
              <button onClick={() => setSelectedBatch(null)} className="px-6 py-2 bg-[#7E3A99] hover:bg-[#19a828] text-white rounded-md font-bold transition-colors">Close</button>
            </div>
            
          </div>
        </div>
      )}

    </div>
  );
}