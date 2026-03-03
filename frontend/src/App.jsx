import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Leads from './pages/Leads';
import Meeting from './pages/Meeting';
import Employees from './pages/Employees';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/leads" element={<Leads />} />
        <Route path="/meeting" element={<Meeting />} />
        <Route path="/employees" element={<Employees />} />
      </Routes>
    </Router>
  );
}

export default App;