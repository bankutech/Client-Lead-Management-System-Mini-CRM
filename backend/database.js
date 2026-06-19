const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/minicrm';

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    
    // Create default admin user if not exists
    const adminExists = await User.findOne({ username: 'admin' });
    if (!adminExists) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);
      await User.create({
        username: 'admin',
        password: hashedPassword,
        email: 'admin@minicrm.local',
        name: 'System Admin',
        role: 'Admin'
      });
      console.log('Default admin user created');
    }
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });

module.exports = mongoose;
