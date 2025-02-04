require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('../models/Admin');
const connectDB = require('../config/db');

const createDefaultAdmin = async () => {
  try {
    await connectDB();

    // Check if admin already exists
    const adminExists = await Admin.findOne({ username: 'admin' });
    
    if (adminExists) {
      console.log('Default admin already exists');
      return;
    }

    // Create default admin
    const admin = new Admin({
      username: 'admin',
      password: 'admin123', // This will be hashed by the pre-save hook
      email: 'admin@restaurant.com',
      role: 'super-admin'
    });

    await admin.save();
    console.log('Default admin created successfully');

  } catch (error) {
    console.error('Error creating default admin:', error);
  } finally {
    await mongoose.connection.close();
  }
};

createDefaultAdmin();
