import React, { useState } from 'react';
import axios from 'axios';
import { X, Save } from 'lucide-react';

export default function LeadModal({ lead, onClose }) {
  const [status, setStatus] = useState(lead?.status || 'New');
  const [notes, setNotes] = useState(lead?.notes || '');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      
      // Update status if changed
      if (status !== lead.status) {
        await axios.put(`/api/leads/${lead.id}/status`, { status }, { headers });
      }
      
      // Update notes if changed
      if (notes !== lead.notes) {
        await axios.put(`/api/leads/${lead.id}/notes`, { notes }, { headers });
      }

      onClose(true); // Close and refresh
    } catch (err) {
      console.error('Failed to update lead:', err);
      alert('Failed to update lead');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={() => onClose(false)}>
      <div className="modal-content glass-panel" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Manage Lead: {lead?.name}</h2>
          <button className="close-btn" onClick={() => onClose(false)}><X size={24} /></button>
        </div>
        
        <div className="modal-body">
          <div className="form-group">
            <label className="label">Lead Email</label>
            <input type="text" className="input-field" value={lead?.email} disabled style={{opacity: 0.7}} />
          </div>
          
          <div className="form-group">
            <label className="label">Status</label>
            <select 
              className="input-field" 
              value={status} 
              onChange={e => setStatus(e.target.value)}
            >
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Converted">Converted</option>
            </select>
          </div>
          
          <div className="form-group">
            <label className="label">Notes & Follow-ups</label>
            <textarea 
              className="input-field" 
              value={notes} 
              onChange={e => setNotes(e.target.value)}
              placeholder="Add your notes here..."
            />
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={() => onClose(false)}>Cancel</button>
          <button className="btn-primary" onClick={handleSave} disabled={loading}>
            {loading ? <div className="loader" style={{width: '16px', height: '16px'}}></div> : <Save size={16} />} 
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
