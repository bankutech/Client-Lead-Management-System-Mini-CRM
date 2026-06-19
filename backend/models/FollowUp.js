const mongoose = require('mongoose');

const FollowUpSchema = new mongoose.Schema({
  leadId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lead', required: true },
  note: { type: String, required: true },
  reminderDate: { type: Date },
  status: { type: String, enum: ['Pending', 'Completed'], default: 'Pending' }
}, { timestamps: true });

module.exports = mongoose.model('FollowUp', FollowUpSchema);
