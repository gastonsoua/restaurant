const express = require('express');
const router = express.Router();
const Hero = require('../models/Hero');
const upload = require('../middleware/upload');
const { authenticateToken } = require('../middleware/auth');
const fs = require('fs').promises;
const path = require('path');

// Get active hero section
router.get('/', async (req, res) => {
  try {
    const hero = await Hero.findOne({ active: true });
    res.json(hero || {});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all hero sections (protected)
router.get('/all', authenticateToken, async (req, res) => {
  try {
    const heroes = await Hero.find().sort({ createdAt: -1 });
    res.json(heroes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create hero section (protected)
router.post('/', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Image is required' });
    }

    const heroData = {
      ...req.body,
      image: req.file.path,
      active: req.body.active === 'true'
    };

    const hero = await Hero.create(heroData);
    
    // If this hero is set as active, deactivate all other heroes
    if (heroData.active) {
      await Hero.updateMany(
        { _id: { $ne: hero._id } },
        { active: false }
      );
    }

    res.status(201).json(hero);
  } catch (error) {
    // If there's an error and a file was uploaded, delete it
    if (req.file) {
      try {
        await fs.unlink(req.file.path);
      } catch (unlinkError) {
        console.error('Error deleting file:', unlinkError);
      }
    }
    res.status(400).json({ message: error.message });
  }
});

// Update hero section (protected)
router.patch('/:id', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    const hero = await Hero.findById(req.params.id);
    if (!hero) {
      return res.status(404).json({ message: 'Hero section not found' });
    }

    const updateData = { ...req.body };

    // Handle file upload
    if (req.file) {
      updateData.image = req.file.path;
      // Delete old image if it exists
      if (hero.image) {
        try {
          await fs.unlink(hero.image);
        } catch (unlinkError) {
          console.error('Error deleting old image:', unlinkError);
        }
      }
    }

    // Convert active string to boolean if present
    if (updateData.active !== undefined) {
      updateData.active = updateData.active === 'true';
    }

    const updatedHero = await Hero.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    // If this hero is set as active, deactivate all other heroes
    if (updateData.active) {
      await Hero.updateMany(
        { _id: { $ne: updatedHero._id } },
        { active: false }
      );
    }

    res.json(updatedHero);
  } catch (error) {
    // If there's an error and a new file was uploaded, delete it
    if (req.file) {
      try {
        await fs.unlink(req.file.path);
      } catch (unlinkError) {
        console.error('Error deleting file:', unlinkError);
      }
    }
    res.status(400).json({ message: error.message });
  }
});

// Delete hero section (protected)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const hero = await Hero.findById(req.params.id);
    if (!hero) {
      return res.status(404).json({ message: 'Hero section not found' });
    }

    // Delete the associated image file
    if (hero.image) {
      try {
        await fs.unlink(hero.image);
      } catch (unlinkError) {
        console.error('Error deleting image:', unlinkError);
      }
    }

    await Hero.findByIdAndDelete(req.params.id);
    res.json({ message: 'Hero deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Set hero as active (protected)
router.put('/:id/activate', authenticateToken, async (req, res) => {
  try {
    const hero = await Hero.findById(req.params.id);
    if (!hero) {
      return res.status(404).json({ message: 'Hero section not found' });
    }

    // First, deactivate all heroes
    await Hero.updateMany({}, { active: false });

    // Then activate the selected hero
    hero.active = true;
    await hero.save();

    res.json(hero);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
