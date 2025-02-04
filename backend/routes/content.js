const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Content = require('../models/Content');
const { authenticateToken } = require('../middleware/auth');

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed!'));
  }
});

// Get all content
router.get('/', async (req, res) => {
  try {
    const content = await Content.find().sort('section order');
    res.json(content);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching content' });
  }
});

// Get content by section
router.get('/section/:section', async (req, res) => {
  try {
    const content = await Content.find({ 
      section: req.params.section,
      isActive: true 
    }).sort('order');
    res.json(content);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching section content' });
  }
});

// Create new content (protected)
router.post('/', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    const contentData = {
      ...req.body,
      imageUrl: req.file ? `/uploads/${req.file.filename}` : undefined
    };

    const content = new Content(contentData);
    await content.save();
    res.status(201).json(content);
  } catch (error) {
    res.status(500).json({ message: 'Error creating content' });
  }
});

// Update content (protected)
router.put('/:id', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    const contentData = {
      ...req.body
    };

    if (req.file) {
      contentData.imageUrl = `/uploads/${req.file.filename}`;
    }

    const content = await Content.findByIdAndUpdate(
      req.params.id,
      contentData,
      { new: true }
    );

    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }

    res.json(content);
  } catch (error) {
    res.status(500).json({ message: 'Error updating content' });
  }
});

// Delete content (protected)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const content = await Content.findByIdAndDelete(req.params.id);
    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }
    res.json({ message: 'Content deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting content' });
  }
});

module.exports = router;
