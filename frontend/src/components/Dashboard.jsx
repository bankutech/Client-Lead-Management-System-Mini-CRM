import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, UserCheck, TrendingUp, LogOut, Edit2 } from 'lucide-react';
import LeadModal from './LeadModal';

export default function Dashboard() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchLeads = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/leads', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLeads(res.data);
    } catch (err) {
      if(err.response?.status === 401 || err.response?.status === 403) {
        handleLogout();
      }
      console.error('Error fetching leads:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    window.dispatchEvent(new Event('storage'));
  };

  const openLeadModal = (lead) => {
    setSelectedLead(lead);
    setIsModalOpen(true);
  };

  const closeLeadModal = (refresh = false) => {
    setIsModalOpen(false);
    setSelectedLead(null);
    if (refresh) fetchLeads();
  };

  const totalLeads = leads.length;
  const contactedLeads = leads.filter(l => l.status === 'Contacted').length;
  const convertedLeads = leads.filter(l => l.status === 'Converted').length;

  if (loading) {
    return <div style={{display:'flex', height:'100vh', alignItems:'center', justifyContent:'center'}}><div className="loader"></div></div>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Mini CRM Dashboard</h1>
        <button onClick={handleLogout} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <LogOut size={16} /> Logout
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card glass-panel">
          <div className="stat-icon"><Users size={24} /></div>
          <div className="stat-info">
            <h3>Total Leads</h3>
            <p>{totalLeads}</p>
          </div>
        </div>
        <div className="stat-card glass-panel">
          <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#FBBF24' }}>
            <UserCheck size={24} />
          </div>
          <div className="stat-info">
            <h3>Contacted</h3>
            <p>{contactedLeads}</p>
          </div>
        </div>
        <div className="stat-card glass-panel">
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10B981' }}>
            <TrendingUp size={24} />
          </div>
          <div className="stat-info">
            <h3>Converted</h3>
            <p>{convertedLeads}</p>
          </div>
        </div>
      </div>

      <div className="table-container glass-panel">
        <table className="leads-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Source</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {leads.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No leads found.</td>
              </tr>
            ) : (
              leads.map(lead => (
                <tr key={lead.id}>
                  <td style={{ fontWeight: 500, color: 'white' }}>{lead.name}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{lead.email}</td>
                  <td>{lead.source}</td>
                  <td>
                    <span className={`status-badge status-${lead.status.toLowerCase()}`}>
                      {lead.status}
                    </span>
                  </td>
                  <td style={{ color: 'var(--text-muted)' }}>
                    {new Date(lead.createdAt).toLocaleDateString()}
                  </td>
                  <td>
                    <button onClick={() => openLeadModal(lead)} className="action-btn">
                      <Edit2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && <LeadModal lead={selectedLead} onClose={closeLeadModal} />}
    </div>
  );
}
