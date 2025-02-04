const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const { authenticateToken } = require('../middleware/auth');

// Get contact information
router.get('/', async (req, res) => {
  try {
    const contact = await Contact.find().sort({ createdAt: -1 });
    res.json(contact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create contact information (protected)
router.post('/', authenticateToken, async (req, res) => {
  try {
    // Delete existing contact information
    await Contact.deleteMany({});

    const contact = await Contact.create(req.body);
    res.status(201).json(contact);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update contact information (protected)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!contact) {
      return res.status(404).json({ message: 'Contact information not found' });
    }

    res.json(contact);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete contact information (protected)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: 'Contact information not found' });
    }
    res.json({ message: 'Contact information deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
