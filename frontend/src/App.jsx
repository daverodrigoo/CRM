import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Leads from './pages/Leads';
import Meeting from './pages/Meeting';
import Employees from './pages/Employees';
import AssignedLeads from './pages/AssignedLeads';
import Employee_AssignedLeads from './pages/Employee_AssignedLeads';
import MeetingsBooked from './pages/MeetingsBooked';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/leads" element={<Leads />} />
        <Route path="/meeting" element={<Meeting />} />
        <Route path="/employees" element={<Employees />} />
        <Route path="/assigned-leads" element={<AssignedLeads />} />
        <Route path="/employee-assigned-leads" element={<Employee_AssignedLeads />} />
        <Route path="/meetings-booked" element={<MeetingsBooked />} />
      </Routes>
    </Router>
  );
}

export default App;