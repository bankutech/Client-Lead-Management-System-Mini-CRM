import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import LeadPipeline from './pages/LeadPipeline';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem('token'));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={!token ? <Login setToken={setToken} /> : <Navigate to="/" />} 
        />
        <Route 
          path="/" 
          element={token ? <DashboardLayout setToken={setToken} /> : <Navigate to="/login" />} 
        >
          <Route index element={<Dashboard />} />
          <Route path="pipeline" element={<LeadPipeline />} />
          <Route path="leads" element={<div className="p-4"><h1 className="text-2xl font-bold">All Leads (List View)</h1><p className="text-slate-400 mt-2">Coming soon: Advanced filtering table.</p></div>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
