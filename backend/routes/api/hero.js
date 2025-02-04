const express = require('express');
const router = express.Router();
const Hero = require('../../models/Hero');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/';
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Not an image! Please upload an image.'), false);
    }
  }
});

// GET active hero
router.get('/active', async (req, res) => {
  try {
    const hero = await Hero.findOne({ active: true });
    if (!hero) {
      return res.status(404).json({ message: 'No active hero found' });
    }
    res.json(hero);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET all heroes
router.get('/', async (req, res) => {
  try {
    const heroes = await Hero.find().sort({ createdAt: -1 });
    res.json(heroes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST new hero
router.post('/', upload.single('image'), async (req, res) => {
  try {
    // If this is set to be active, deactivate all other heroes
    if (req.body.active === 'true') {
      await Hero.updateMany({}, { active: false });
    }

    const hero = new Hero({
      title: req.body.title,
      subtitle: req.body.subtitle,
      image: req.file.path,
      active: req.body.active === 'true'
    });

    const newHero = await hero.save();
    res.status(201).json(newHero);
  } catch (err) {
    // If there's an error, remove the uploaded file
    if (req.file) {
      fs.unlink(req.file.path, (unlinkErr) => {
        if (unlinkErr) console.error('Error removing uploaded file:', unlinkErr);
      });
    }
    res.status(400).json({ message: err.message });
  }
});

// UPDATE hero
router.patch('/:id', upload.single('image'), async (req, res) => {
  try {
    const hero = await Hero.findById(req.params.id);
    if (!hero) {
      return res.status(404).json({ message: 'Hero not found' });
    }

    const updates = {
      title: req.body.title,
      subtitle: req.body.subtitle,
      active: req.body.active === 'true'
    };

    // If this is set to be active, deactivate all other heroes
    if (updates.active) {
      await Hero.updateMany({ _id: { $ne: req.params.id } }, { active: false });
    }

    // If a new image is uploaded, update the image path and delete the old image
    if (req.file) {
      updates.image = req.file.path;
      // Delete old image
      if (hero.image) {
        fs.unlink(hero.image, (err) => {
          if (err) console.error('Error removing old image:', err);
        });
      }
    }

    const updatedHero = await Hero.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    );

    res.json(updatedHero);
  } catch (err) {
    // If there's an error and a new file was uploaded, remove it
    if (req.file) {
      fs.unlink(req.file.path, (unlinkErr) => {
        if (unlinkErr) console.error('Error removing uploaded file:', unlinkErr);
      });
    }
    res.status(400).json({ message: err.message });
  }
});

// DELETE hero
router.delete('/:id', async (req, res) => {
  try {
    const hero = await Hero.findById(req.params.id);
    if (!hero) {
      return res.status(404).json({ message: 'Hero not found' });
    }

    // Delete the image file
    if (hero.image) {
      fs.unlink(hero.image, (err) => {
        if (err) console.error('Error removing image:', err);
      });
    }

    await hero.remove();
    res.json({ message: 'Hero deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
