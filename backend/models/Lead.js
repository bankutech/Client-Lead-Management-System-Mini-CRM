const mongoose = require('mongoose');

const LeadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String },
  phone: { type: String },
  company: { type: String },
  source: { type: String, default: 'Website' },
  status: { 
    type: String, 
    enum: ['New Lead', 'Contacted', 'Meeting Scheduled', 'Proposal Sent', 'Negotiation', 'Converted', 'Lost'],
    default: 'New Lead' 
  },
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  budget: { type: String },
  projectType: { type: String },
  message: { type: String },
  notes: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Lead', LeadSchema);
