import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Leads from './pages/Leads';
import Meeting from './pages/Meeting';
import Employees from './pages/Employees';
import AssignedLeads from './pages/AssignedLeads';

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
      </Routes>
    </Router>
  );
}

export default App;