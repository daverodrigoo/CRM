import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Leads from './pages/Leads';
import Meeting from './pages/Meeting';
import Employees from './pages/Employees';
import AssignedLeads from './pages/AssignedLeads';
// 1. Import your new page here:
import Employee_AssignedLeads from './pages/Employee_AssignedLeads';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/leads" element={<Leads />} />
        <Route path="/meeting" element={<Meeting />} />
        <Route path="/employees" element={<Employees />} />
        <Route path="/assigned-leads" element={<AssignedLeads />} />
        
        {/* 2. Add the route for your new page here: */}
        <Route path="/employee-assigned-leads" element={<Employee_AssignedLeads />} />
      </Routes>
    </Router>
  );
}

export default App;