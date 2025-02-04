require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('../models/Admin');
const connectDB = require('../config/db');

const createAdminUser = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Create admin user
    const adminUser = new Admin({
      username: 'admin',
      email: 'admin@restaurant-tunisien.com',
      password: 'admin123456',
      role: 'super-admin'
    });

    await adminUser.save();
    
    console.log('Admin user created successfully!');
    console.log('Username: admin');
    console.log('Password: admin123456');
    console.log('\nPlease change these credentials after first login!');
    
    process.exit(0);
  } catch (error) {
    if (error.code === 11000) {
      console.log('Admin user already exists!');
    } else {
      console.error('Error creating admin user:', error);
    }
    process.exit(1);
  }
};

createAdminUser();
