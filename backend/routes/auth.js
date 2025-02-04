const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const { body, validationResult } = require('express-validator');
const { authenticateToken } = require('../middleware/auth');

// Login route
router.post('/login', [
  body('username').trim().notEmpty(),
  body('password').trim().notEmpty()
], async (req, res) => {
  try {
    console.log('Login attempt:', { username: req.body.username });
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;
    const admin = await Admin.findOne({ username });
    
    console.log('Admin found:', admin ? 'Yes' : 'No');

    if (!admin || !(await admin.comparePassword(password))) {
      console.log('Invalid credentials');
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    // Generate token
    const token = jwt.sign(
      { id: admin._id, username: admin.username, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('Login successful for:', username);
    res.json({ token, username: admin.username, role: admin.role });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Verify token route
router.get('/verify', authenticateToken, (req, res) => {
  try {
    res.json({ 
      valid: true, 
      user: {
        username: req.user.username,
        role: req.user.role
      }
    });
  } catch (error) {
    console.error('Verify error:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
});

// Logout route
router.post('/logout', authenticateToken, async (req, res) => {
  try {
    // You could implement token blacklisting here if needed
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Register route (protected, only super-admin can create new admins)
router.post('/register', [
  body('username').trim().isLength({ min: 4 }),
  body('password').trim().isLength({ min: 6 }),
  body('email').trim().isEmail(),
  body('role').isIn(['admin', 'super-admin'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password, email, role } = req.body;

    // Check if username or email already exists
    const existingAdmin = await Admin.findOne({
      $or: [{ username }, { email }]
    });

    if (existingAdmin) {
      return res.status(400).json({
        message: 'Username or email already exists'
      });
    }

    const admin = new Admin({
      username,
      password,
      email,
      role
    });

    await admin.save();
    res.status(201).json({ message: 'Admin created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
