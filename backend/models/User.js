const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, default: 'Admin' },
  username: { type: String, required: true, unique: true },
  email: { type: String },
  password: { type: String, required: true },
  role: { type: String, default: 'Admin' }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
