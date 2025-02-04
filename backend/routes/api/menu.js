const express = require('express');
const router = express.Router();
const MenuItem = require('../../models/Menu');
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

// GET all menu items
router.get('/', async (req, res) => {
  try {
    const menuItems = await MenuItem.find().sort({ category: 1, createdAt: -1 });
    res.json(menuItems);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET menu item by ID
router.get('/:id', async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);
    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    res.json(menuItem);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST new menu item
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const menuItem = new MenuItem({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      image: req.file.path,
      isAvailable: req.body.isAvailable === 'true'
    });

    const newMenuItem = await menuItem.save();
    res.status(201).json(newMenuItem);
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

// UPDATE menu item
router.patch('/:id', upload.single('image'), async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);
    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    const updates = {
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      isAvailable: req.body.isAvailable === 'true'
    };

    // If a new image is uploaded, update the image path and delete the old image
    if (req.file) {
      updates.image = req.file.path;
      // Delete old image
      if (menuItem.image) {
        fs.unlink(menuItem.image, (err) => {
          if (err) console.error('Error removing old image:', err);
        });
      }
    }

    const updatedMenuItem = await MenuItem.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    );

    res.json(updatedMenuItem);
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

// DELETE menu item
router.delete('/:id', async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);
    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    // Delete the associated image file
    if (menuItem.image) {
      fs.unlink(menuItem.image, (err) => {
        if (err) console.error('Error removing image file:', err);
      });
    }

    await menuItem.remove();
    res.json({ message: 'Menu item deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
