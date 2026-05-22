import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

export default function Dashboard() {
  // --- ROLE & FILTER STATES ---
  const [userRole, setUserRole] = useState('');
  const [currentUserId, setCurrentUserId] = useState('');
  const [userFilter, setUserFilter] = useState('All Users'); 
  const [timeFilter, setTimeFilter] = useState('This Month');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  // --- RAW DATA FROM LARAVEL ---
  const [rawLeads, setRawLeads] = useState([]);
  const [rawSummary, setRawSummary] = useState([]);
  const [rawMyAssigned, setRawMyAssigned] = useState([]);
  const [usersList, setUsersList] = useState([]);

  // --- DASHBOARD STATES ---
  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState('Unread');
  const [readNotifs, setReadNotifs] = useState(() => {
    const saved = localStorage.getItem('CRM_READ_NOTIFS');
    return saved ? JSON.parse(saved) : [];
  });

  const [kpiData, setKpiData] = useState({
    leadsToday: 0, leadsWeek: 0, leadsMonth: 0,
    answerRateCall: "0%", replyRateEmail: "0%", answerRateMsg: "0%", bookingRate: "0%",
    callsSent: 0, emailsSent: 0, msgsSent: 0,
    callsAnswered: 0, emailsReplied: 0, msgsReplied: 0
  });

  // --- HELPER: MARK AS READ ---
  const markAsRead = (id) => {
    if (!readNotifs.includes(id)) {
      const updated = [...readNotifs, id];
      setReadNotifs(updated);
      localStorage.setItem('CRM_READ_NOTIFS', JSON.stringify(updated));
    }
  };

  // --- PORTION 3 STATES ---
  const [activeBatchTab, setActiveBatchTab] = useState('Incomplete');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  // 1. FETCH THE DATA FROM LARAVEL ONCE ON LOAD
  useEffect(() => {
    const fetchData = async () => {
      try {
        const role = localStorage.getItem('USER_ROLE') || 'Employee';
        const userId = localStorage.getItem('USER_ID');
        setUserRole(role);
        setCurrentUserId(userId);

        const usersRes = await axios.get('http://localhost:8000/api/employees');
        const fetchedUsers = Array.isArray(usersRes.data) ? usersRes.data : (usersRes.data.data || []);
        setUsersList(fetchedUsers);

        const leadsRes = await axios.get('http://localhost:8000/api/leads');
        const fetchedLeads = Array.isArray(leadsRes.data) ? leadsRes.data : (leadsRes.data.data || []);
        setRawLeads(fetchedLeads);

        if (role === 'Super Admin' || role === 'Admin') {
          const summaryRes = await axios.get('http://localhost:8000/api/assigned-leads/summary');
          setRawSummary(summaryRes.data);
        } else {
          if (userId) {
            const myAssignedRes = await axios.get(`http://localhost:8000/api/leads/assigned/${userId}`);
            setRawMyAssigned(myAssignedRes.data);
          }
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };
    fetchData();
  }, []);

  // 2. THE CALCULATION ENGINE
  // 2. THE CALCULATION ENGINE
  useEffect(() => {
    // ---------------------------------------------------------
    // THE TIMEZONE-AWARE DATE ENGINE
    // ---------------------------------------------------------
    
    // Helper 1: Formats any valid JS Date into a strict "YYYY-MM-DD" local string
    const formatToDateString = (d) => {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    // Helper 2: The Timezone Converter
    const getLocalYYYYMMDD = (rawDbDate) => {
      if (!rawDbDate) return null;
      let str = String(rawDbDate);

      // 1. If it's already a clean flat date (YYYY-MM-DD) with no time, trust it blindly
      if (str.length === 10 && str.match(/^\d{4}-\d{2}-\d{2}$/)) {
        return str;
      }

      // 2. If it contains a SQL time (e.g. "2026-05-21 23:00:00"), convert it to an ISO format
      if (str.includes(' ')) {
        str = str.replace(' ', 'T');
        // If the server didn't provide a timezone, assume UTC (Laravel's default)
        if (!str.endsWith('Z')) str += 'Z'; 
      }

      // 3. Let the browser convert the UTC server time into your local Philippines time!
      const d = new Date(str);
      if (!isNaN(d.getTime())) {
        return formatToDateString(d); // Returns the corrected YYYY-MM-DD
      }

      // 4. Absolute Fallback: Just scrape the numbers
      const match = str.match(/(\d{4}-\d{2}-\d{2})/);
      return match ? match : null;
    };

    // Determine the exact Local boundaries for the chosen filter
    const now = new Date();
    let filterStart = '0000-00-00';
    let filterEnd = '9999-12-31';

    if (timeFilter === 'Today') {
      const todayStr = formatToDateString(now);
      filterStart = todayStr;
      filterEnd = todayStr;
    } else if (timeFilter === 'This Week') {
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay()); // Sunday
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6); // Saturday
      filterStart = formatToDateString(startOfWeek);
      filterEnd = formatToDateString(endOfWeek);
    } else if (timeFilter === 'This Month') {
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const lastDay = new Date(year, now.getMonth() + 1, 0).getDate();
      filterStart = `${year}-${month}-01`;
      filterEnd = `${year}-${month}-${String(lastDay).padStart(2, '0')}`;
    } else if (timeFilter === 'Custom Date Range') {
      filterStart = customStartDate || '0000-00-00';
      filterEnd = customEndDate || '9999-12-31';
    }

    // Universal checker: Pure alphabetical string comparison
    const isDateInRange = (rawDbDate) => {
      const cleanDate = getLocalYYYYMMDD(rawDbDate);
      if (!cleanDate) return false;
      return cleanDate >= filterStart && cleanDate <= filterEnd;
    };

    // ---------------------------------------------------------
    // A. CALCULATE LEADS ADDED
    // ---------------------------------------------------------
    let leadsAddedCount = 0;

    rawLeads.forEach(lead => {
      const ownerId = String(lead.User_ID || lead.user_id || '');
      let includeLead = false;

      if (userRole === 'Admin') includeLead = true;
      else if (userRole === 'Super Admin') {
        includeLead = (userFilter === 'All Users' || ownerId === String(userFilter));
      } else {
        includeLead = (ownerId === String(currentUserId));
      }

      // Fallback for leads with empty User_ID
      if (!includeLead) {
        const isAssigned = rawMyAssigned.some(b => b.leads.some(l => String(l.Lead_ID) === String(lead.Lead_ID)));
        if (isAssigned) includeLead = true;
      }

      if (!includeLead) return;

      // Filter using the timezone-aware string checker
      if (isDateInRange(lead.Date_Added || lead.created_at)) {
        leadsAddedCount++;
      }
    });

    // ---------------------------------------------------------
    // B. FLATTEN KPI DATA & GENERATE STRICT NOTIFICATIONS
    // ---------------------------------------------------------
    let kpiLeads = [];
    let generatedNotifications = [];

    if (userRole === 'Super Admin' || userRole === 'Admin') {
      rawSummary.forEach(userGroup => {
        const batchOwnerId = userGroup.User_ID;
        let includeUserForKPI = false;
        
        if (userRole === 'Admin') includeUserForKPI = true; 
        else {
          includeUserForKPI = (userFilter === 'All Users' || String(batchOwnerId) === String(userFilter));
        }

        userGroup.Batches.forEach(batch => {
          batch.Leads.forEach(lead => {
            const assignId = lead.Assigned_Lead_ID || lead.id;
            
            if (String(batchOwnerId) === String(currentUserId)) {
              if (lead.Date_Assigned || lead.created_at) {
                generatedNotifications.push({
                  id: `assign-${assignId}`, 
                  type: 'assigned',
                  title: 'New Lead Assigned',
                  message: `You were assigned a new lead: ${lead.Business_Name}`,
                  _sortTime: new Date(lead.Date_Assigned || lead.created_at).getTime() || 0
                });
              }
            }

            const isBooked = lead.Meeting_Date != null && lead.Meeting_Date !== '';
            if (isBooked && String(lead.Meeting_Assigned_to) === String(currentUserId)) {
              generatedNotifications.push({
                id: `meet-${assignId}`, 
                type: 'meeting',
                title: 'Meeting Booked!',
                message: `A meeting was booked with ${lead.Business_Name}`,
                _sortTime: new Date(lead.updated_at || lead.Date_Assigned || new Date()).getTime() || 0
              });
            }

            if (includeUserForKPI && lead.Completed) {
              kpiLeads.push(lead); 
            }
          });
        });
      });
    } else {
      rawMyAssigned.forEach(batch => {
        batch.leads.forEach(lead => {
          const assignId = lead.Assigned_Lead_ID || lead.id;
          
          if (lead.Date_Assigned || lead.created_at) {
            generatedNotifications.push({
              id: `assign-${assignId}`, 
              type: 'assigned',
              title: 'New Lead Assigned',
              message: `You were assigned a new lead: ${lead.Business_Name}`,
              _sortTime: new Date(lead.Date_Assigned || lead.created_at).getTime() || 0
            });
          }

          const isBooked = lead.Meeting_Date != null && lead.Meeting_Date !== '';
          if (isBooked && String(lead.Meeting_Assigned_to) === String(currentUserId)) {
            generatedNotifications.push({
              id: `meet-${assignId}`, 
              type: 'meeting',
              title: 'Meeting Booked!',
              message: `A meeting was booked with ${lead.Business_Name}`,
              _sortTime: new Date(lead.updated_at || lead.Date_Assigned || new Date()).getTime() || 0
            });
          }

          if (lead.Completed) kpiLeads.push(lead); 
        });
      });
    }

    generatedNotifications.sort((a, b) => b._sortTime - a._sortTime);
    setNotifications(generatedNotifications);

    // ---------------------------------------------------------
    // C. APPLY TIME FILTER TO KPIS
    // ---------------------------------------------------------
    kpiLeads = kpiLeads.filter(lead => isDateInRange(lead.Date_Assigned || lead.updated_at));

    // ---------------------------------------------------------
    // D. CALCULATE FINAL RATES & COUNTS
    // ---------------------------------------------------------
    let callsSent = 0, emailsSent = 0, msgsSent = 0;
    let callsAns = 0, emailsRep = 0, msgsRep = 0;
    let totalBooked = 0;

    kpiLeads.forEach(lead => {
      const type = lead.Inquiry_Type || (lead.inquiries && lead.inquiries.length > 0 ? lead.inquiries : 'None');
      const responded = lead.Responded === true || lead.Responded === 'Yes';
      const booked = lead.Meeting_Booked === true || lead.Meeting_Booked === 1 || lead.Meeting_Booked === '1' || lead.Meeting_Booked === 'Yes' || (lead.Meeting_Date != null && lead.Meeting_Date !== '');

      if (type === 'Cold Call') {
        callsSent++;
        if (responded) callsAns++;
      } else if (type === 'Email') {
        emailsSent++;
        if (responded) emailsRep++;
      } else if (type === 'Message') {
        msgsSent++;
        if (responded) msgsRep++;
      }

      if (booked) totalBooked++;
    });

    const calcRate = (part, whole) => whole > 0 ? Math.round((part / whole) * 100) + '%' : '0%';

    setKpiData({
      leadsAdded: leadsAddedCount,
      answerRateCall: calcRate(callsAns, callsSent),
      replyRateEmail: calcRate(emailsRep, emailsSent),
      answerRateMsg: calcRate(msgsRep, msgsSent),
      bookingRate: calcRate(totalBooked, kpiLeads.length),
      callsSent, emailsSent, msgsSent,
      callsAnswered: callsAns, emailsReplied: emailsRep, msgsReplied: msgsRep
    });

  }, [rawLeads, rawSummary, rawMyAssigned, usersList, userFilter, timeFilter, customStartDate, customEndDate, userRole, currentUserId]);

  const kpiMetrics = [
    { label: "Leads Added", value: kpiData.leadsAdded },
    { label: "Answer Rate (Cold Call)", value: kpiData.answerRateCall },
    { label: "Reply Rate (Email)", value: kpiData.replyRateEmail },
    { label: "Answer Rate (Message)", value: kpiData.answerRateMsg },
    { label: "Booking Rate", value: kpiData.bookingRate },
    { label: "Number of Cold Calls", value: kpiData.callsSent },
    { label: "Number of Emails Sent", value: kpiData.emailsSent },
    { label: "Number of Messages Sent", value: kpiData.msgsSent },
    { label: "Number of Cold Calls Answered", value: kpiData.callsAnswered },
    { label: "Number of Emails Replied", value: kpiData.emailsReplied },
    { label: "Number of Messages Replied", value: kpiData.msgsReplied },
  ];

  const unreadNotifications = notifications.filter(n => !readNotifs.includes(n.id));
  const displayedNotifications = activeTab === 'Unread' ? unreadNotifications : notifications;

  const filterableUsers = usersList.filter(u => {
    const role = String(u.role || u.Role || '').toLowerCase();
    return role === 'employee' || role === 'super admin';
  });

  // ==========================================================
  // PORTION 3 CALCULATION LOGIC (Batches & Meetings)
  // ==========================================================
  
  // -- For Employees: Batch Progress --
  const employeeBatches = [];
  if (userRole === 'Employee') {
      rawMyAssigned.forEach(batch => {
          const total = batch.leads.length;
          const completed = batch.leads.filter(l => l.Completed).length;
          const progress = total === 0 ? 0 : Math.round((completed / total) * 100);
          employeeBatches.push({
              id: batch.Batch_ID || Math.random(),
              name: batch.Batch_Name,
              total,
              completed,
              progress,
              isDone: total > 0 && completed === total
          });
      });
  }
  const incompleteBatches = employeeBatches.filter(b => !b.isDone);
  const completedBatches = employeeBatches.filter(b => b.isDone);
  const displayedBatches = activeBatchTab === 'Incomplete' ? incompleteBatches : completedBatches;

  // -- For Admins: Calendar Meetings --
  let adminMeetings = [];
  if (userRole === 'Super Admin' || userRole === 'Admin') {
      rawSummary.forEach(group => {
          group.Batches.forEach(batch => {
              batch.Leads.forEach(lead => {
                  const isBooked = lead.Meeting_Date != null && lead.Meeting_Date !== '';
                  if (isBooked && String(lead.Meeting_Assigned_to) === String(currentUserId)) {
                      adminMeetings.push({
                          id: lead.Assigned_Lead_ID || lead.id,
                          date: String(lead.Meeting_Date).substring(0, 10), // Extract YYYY-MM-DD safely
                          time: lead.Meeting_Time || 'TBD',
                          type: lead.Meeting_Type || 'Meeting',
                          business: lead.Business_Name || 'Unknown',
                      });
                  }
              });
          });
      });
  }

  // Calendar Helpers
  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
  
  const calendarDays = [];
  for (let i = 0; i < firstDayOfMonth; i++) calendarDays.push(null);
  for (let i = 1; i <= daysInMonth; i++) calendarDays.push(i);

  const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  
  const formatCalendarDateStr = (dateObj) => {
      return `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`;
  };

  const selectedDateStr = formatCalendarDateStr(selectedDate);
  const selectedDateMeetings = adminMeetings.filter(m => m.date === selectedDateStr);

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col">
      <Navbar />
      
      <main className="pt-24 px-8 max-w-[98%] mx-auto w-full flex flex-col lg:flex-row gap-6 h-[820px]">
        
        {/* ========================================== */}
        {/* PORTION 1: LEFT HALF (CRM KPI TABLE)       */}
        {/* ========================================== */}
        <div className="w-full lg:w-1/2 flex flex-col bg-white rounded-2xl shadow-sm border border-gray-100 h-full overflow-hidden">
          
          <div className="bg-[#7E3A99] px-5 py-4 flex-shrink-0">
            <h2 className="text-lg font-bold text-white tracking-wide">CRM KPI</h2>
          </div>

          <div className="bg-white border-b border-gray-100 px-5 py-3 flex flex-row flex-wrap items-center gap-6 flex-shrink-0">
            
            {userRole === 'Super Admin' && (
              <div className="flex items-center gap-2 text-xs">
                <span className="font-bold text-gray-700">Monitor:</span>
                <select 
                  value={userFilter} 
                  onChange={(e) => setUserFilter(e.target.value)}
                  className="border border-gray-200 rounded py-1 px-2 text-gray-700 outline-none focus:border-[#7E3A99] focus:ring-1 focus:ring-[#7E3A99] bg-gray-50 hover:bg-white cursor-pointer transition-colors shadow-sm max-w-[200px] truncate"
                >
                  <option value="All Users">All Users</option>
                  {filterableUsers.map(u => (
                    <option key={u.id || u.User_ID} value={u.id || u.User_ID}>
                      {u.name || u.Name || `${u.First_Name || ''} ${u.Last_Name || ''}`.trim()}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="flex flex-row items-center gap-2 text-xs flex-wrap">
              <span className="font-bold text-gray-700">Time Range:</span>
              <select 
                value={timeFilter} 
                onChange={(e) => setTimeFilter(e.target.value)}
                className="border border-gray-200 rounded py-1 px-2 text-gray-700 outline-none focus:border-[#7E3A99] focus:ring-1 focus:ring-[#7E3A99] bg-gray-50 hover:bg-white cursor-pointer transition-colors shadow-sm"
              >
                <option value="Today">Today</option>
                <option value="This Week">This Week</option>
                <option value="This Month">This Month</option>
                <option value="Custom Date Range">Custom Date Range</option>
              </select>

              {timeFilter === 'Custom Date Range' && (
                <div className="flex items-center gap-1.5 animate-fade-in">
                  <input 
                    type="date" 
                    value={customStartDate} 
                    onChange={(e) => setCustomStartDate(e.target.value)} 
                    className="border border-gray-200 rounded py-1 px-2 text-xs outline-none focus:border-[#7E3A99] focus:ring-1 focus:ring-[#7E3A99] text-gray-700 bg-gray-50 shadow-sm"
                  />
                  <span className="text-gray-400 font-medium">to</span>
                  <input 
                    type="date" 
                    value={customEndDate} 
                    onChange={(e) => setCustomEndDate(e.target.value)} 
                    className="border border-gray-200 rounded py-1 px-2 text-xs outline-none focus:border-[#7E3A99] focus:ring-1 focus:ring-[#7E3A99] text-gray-700 bg-gray-50 shadow-sm"
                  />
                </div>
              )}
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-0">
            {/* Added h-full to the table so it stretches, and bumped the base text size */}
            <table className="min-w-full text-[13px] text-left h-full">
              <tbody className="divide-y divide-gray-100/80">
                {kpiMetrics.map((metric, index) => (
                  <tr key={index} className="hover:bg-gray-50/50 transition-colors group">
                    {/* Increased vertical padding (py-[15px]) and horizontal padding (px-6) */}
                    <td className="px-6 py-[15px] font-medium text-gray-500 group-hover:text-gray-700 transition-colors align-middle">
                      {metric.label}
                    </td>
                    <td className="px-6 py-[15px] text-right align-middle">
                      {/* Bumped the value text size from text-sm to text-[15px] */}
                      <span className="font-bold text-gray-800 text-[15px]">
                        {metric.value}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ========================================== */}
        {/* RIGHT HALF (Split exactly 50/50)           */}
        {/* ========================================== */}
        <div className="w-full lg:w-1/2 flex flex-col gap-6 h-full">
          
          {/* ========================================== */}
          {/* PORTION 2: NOTIFICATIONS VIEWER            */}
          {/* ========================================== */}
          <div className="h-[calc(50%-12px)] bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
            
            <div className="bg-white px-5 pt-4 pb-0 border-b border-gray-100 flex flex-col flex-shrink-0 z-10 gap-3">
              <div className="flex justify-between items-center">
                <h2 className="text-[15px] font-bold text-gray-800">Your Activity</h2>
                {unreadNotifications.length > 0 && (
                  <span className="bg-purple-50 text-[#7E3A99] text-[10px] font-bold px-2 py-0.5 rounded border border-purple-100">
                    {unreadNotifications.length} Unread
                  </span>
                )}
              </div>
              
              <div className="flex gap-4 text-xs font-semibold">
                <button
                  onClick={() => setActiveTab('Unread')}
                  className={`pb-2 border-b-2 transition-colors ${activeTab === 'Unread' ? 'border-[#7E3A99] text-[#7E3A99]' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                >
                  Unread
                </button>
                <button
                  onClick={() => setActiveTab('All')}
                  className={`pb-2 border-b-2 transition-colors ${activeTab === 'All' ? 'border-[#7E3A99] text-[#7E3A99]' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                >
                  All
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto relative p-0">
              {displayedNotifications.length > 0 ? (
                <ul className="divide-y divide-gray-50">
                  {displayedNotifications.map((notif) => {
                    const isRead = readNotifs.includes(notif.id);
                    return (
                      <li key={notif.id} className={`px-5 py-3.5 transition-colors flex gap-3.5 items-center group ${isRead ? 'bg-white hover:bg-gray-50/50' : 'bg-purple-50/30 hover:bg-purple-50/60'}`}>
                        
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${notif.type === 'meeting' ? 'bg-green-50 text-green-600' : 'bg-purple-50 text-[#7E3A99]'}`}>
                          {notif.type === 'meeting' ? (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                              <path fillRule="evenodd" d="M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0118 3v1.5h.75a3 3 0 013 3v11.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V7.5a3 3 0 013-3H6V3a.75.75 0 01.75-.75zm13.5 9a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                              <path d="M5.25 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM3 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM18.75 7.5a.75.75 0 00-1.5 0v2.25H15a.75.75 0 000 1.5h2.25v2.25a.75.75 0 001.5 0v-2.25H21a.75.75 0 000-1.5h-2.25V7.5z" />
                            </svg>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className={`text-[13px] font-bold truncate ${isRead ? 'text-gray-700' : 'text-gray-900'}`}>{notif.title}</p>
                          <p className={`text-[11px] mt-0.5 leading-snug pr-2 ${isRead ? 'text-gray-500' : 'text-gray-700'}`}>{notif.message}</p>
                        </div>

                        {!isRead && (
                          <button 
                            onClick={() => markAsRead(notif.id)}
                            className="opacity-0 group-hover:opacity-100 transition-all p-1.5 rounded-full hover:bg-green-100 text-gray-400 hover:text-green-600 focus:opacity-100 flex-shrink-0"
                            title="Mark as read"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                            </svg>
                          </button>
                        )}
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-300 gap-2 p-6 absolute inset-0">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0M3.124 7.5A8.969 8.969 0 015.292 3m13.416 0a8.969 8.969 0 012.168 4.5" />
                  </svg>
                  <span className="text-xs font-medium">No {activeTab.toLowerCase()} notifications</span>
                </div>
              )}
            </div>
          </div>

          {/* ========================================== */}
          {/* PORTION 3: BOTTOM RIGHT                    */}
          {/* ========================================== */}
          <div className="h-[calc(50%-12px)] bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
            {userRole === 'Employee' ? (
              
              // ------------------------------------------
              // PORTION 3: EMPLOYEE (Batch Progress)
              // ------------------------------------------
              <>
                <div className="bg-white px-5 pt-4 pb-0 border-b border-gray-100 flex flex-col flex-shrink-0 z-10 gap-3">
                  <div className="flex justify-between items-center">
                    <h2 className="text-[15px] font-bold text-gray-800">Batch Progress</h2>
                  </div>
                  <div className="flex gap-4 text-xs font-semibold">
                    <button
                      onClick={() => setActiveBatchTab('Incomplete')}
                      className={`pb-2 border-b-2 transition-colors ${activeBatchTab === 'Incomplete' ? 'border-[#7E3A99] text-[#7E3A99]' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                    >
                      Incomplete
                    </button>
                    <button
                      onClick={() => setActiveBatchTab('Completed')}
                      className={`pb-2 border-b-2 transition-colors ${activeBatchTab === 'Completed' ? 'border-[#7E3A99] text-[#7E3A99]' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                    >
                      Completed
                    </button>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-5 relative">
                  {displayedBatches.length > 0 ? displayedBatches.map(batch => (
                    <div key={batch.id} className="mb-5 last:mb-0">
                      <div className="flex justify-between text-[13px] mb-1.5">
                        <span className="font-bold text-gray-700">{batch.name}</span>
                        <span className="text-gray-500 font-medium">{batch.completed}/{batch.total} ({batch.progress}%)</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div className="bg-[#7E3A99] h-2 rounded-full transition-all duration-500" style={{ width: `${batch.progress}%` }}></div>
                      </div>
                    </div>
                  )) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-300 gap-2 p-6 absolute inset-0">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.125 2.25h-4.5c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125v-9M10.125 2.25h.375a9 9 0 0 1 9 9v.375M10.125 2.25A3.375 3.375 0 0 1 13.5 5.625v1.5c0 .621.504 1.125 1.125 1.125h1.5a3.375 3.375 0 0 1 3.375 3.375M9 15l2.25 2.25L15 12" />
                      </svg>
                      <span className="text-xs font-medium">No {activeBatchTab.toLowerCase()} batches</span>
                    </div>
                  )}
                </div>
              </>

            ) : (

              // ------------------------------------------
              // PORTION 3: ADMIN (Mini Calendar)
              // ------------------------------------------
              <div className="flex flex-row h-full">
                
                {/* CALENDAR GRID (Left Side) */}
                <div className="w-[55%] border-r border-gray-100 p-4 flex flex-col bg-white">
                  <div className="flex justify-between items-center mb-4">
                    <button onClick={prevMonth} className="p-1 hover:bg-gray-100 rounded text-gray-500 hover:text-[#7E3A99] transition-colors">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <h2 className="text-[13px] font-bold text-gray-800 tracking-wide">
                      {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
                    </h2>
                    <button onClick={nextMonth} className="p-1 hover:bg-gray-100 rounded text-gray-500 hover:text-[#7E3A99] transition-colors">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </button>
                  </div>
                  
                  {/* Days of week header */}
                  <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-gray-400 mb-2">
                    <div>Su</div><div>Mo</div><div>Tu</div><div>We</div><div>Th</div><div>Fr</div><div>Sa</div>
                  </div>
                  
                  {/* Dates grid */}
                  <div className="grid grid-cols-7 gap-1 text-center flex-1">
                    {calendarDays.map((day, idx) => {
                      if (!day) return <div key={idx}></div>;
                      const cellDateStr = formatCalendarDateStr(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day));
                      const isSelected = cellDateStr === selectedDateStr;
                      const hasMeeting = adminMeetings.some(m => m.date === cellDateStr);
                      const isToday = cellDateStr === formatCalendarDateStr(new Date());

                      return (
                        <button 
                          key={idx} 
                          onClick={() => setSelectedDate(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day))}
                          className={`relative flex items-center justify-center text-xs rounded-lg transition-all duration-200
                            ${isSelected ? 'bg-[#7E3A99] text-white font-bold shadow-md' : 'text-gray-700 hover:bg-gray-50'}
                            ${isToday && !isSelected ? 'border border-[#7E3A99] text-[#7E3A99] font-bold' : ''}
                          `}
                        >
                          <span className="z-10">{day}</span>
                          {hasMeeting && (
                            <span className={`absolute bottom-1 w-1 h-1 rounded-full ${isSelected ? 'bg-white' : 'bg-green-500'}`}></span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
                
                {/* MEETINGS LIST (Right Side) */}
                <div className="w-[45%] flex flex-col bg-gray-50/50 relative">
                  <div className="p-4 border-b border-gray-100 flex-shrink-0 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
                    <h3 className="text-[13px] font-bold text-gray-800">
                      {selectedDate.toLocaleDateString('default', { weekday: 'long', month: 'short', day: 'numeric' })}
                    </h3>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-4 relative">
                    <div className="space-y-3">
                      {selectedDateMeetings.length > 0 ? selectedDateMeetings.map((m, i) => (
                        <div key={i} className="bg-white border border-gray-100 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow border-l-[3px] border-l-[#7E3A99] group">
                          <p className="text-[10px] font-bold text-gray-400 mb-1 flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            {m.time}
                          </p>
                          <p className="text-[13px] font-bold text-gray-800 leading-tight group-hover:text-[#7E3A99] transition-colors">{m.business}</p>
                          <div className="mt-2">
                            <span className="text-[10px] text-[#7E3A99] font-bold bg-purple-50 px-2 py-0.5 rounded-full border border-purple-100/50">
                              {m.type}
                            </span>
                          </div>
                        </div>
                      )) : (
                        <div className="flex flex-col items-center justify-center text-gray-300 gap-2 pt-10">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z" />
                          </svg>
                          <span className="text-xs font-medium text-center px-4">No meetings scheduled</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>

        </div>

      </main>
    </div>
  );
}