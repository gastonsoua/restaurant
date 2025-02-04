const express = require('express');
const router = express.Router();
const About = require('../models/About');
const upload = require('../middleware/upload');
const { authenticateToken } = require('../middleware/auth');

// Get about section
router.get('/', async (req, res) => {
  try {
    const about = await About.find().sort({ createdAt: -1 });
    res.json(about);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create about section (protected)
router.post('/', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    // Delete existing about sections
    await About.deleteMany({});

    if (!req.file) {
      return res.status(400).json({ message: 'Image is required' });
    }

    const aboutData = {
      ...req.body,
      image: req.file.path
    };

    const about = await About.create(aboutData);
    res.status(201).json(about);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update about section (protected)
router.put('/:id', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    const updateData = {
      ...req.body
    };

    if (req.file) {
      updateData.image = req.file.path;
    }

    const about = await About.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!about) {
      return res.status(404).json({ message: 'About section not found' });
    }

    res.json(about);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete about section (protected)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const about = await About.findByIdAndDelete(req.params.id);
    if (!about) {
      return res.status(404).json({ message: 'About section not found' });
    }
    res.json({ message: 'About section deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
