const express = require('express');
const router = express.Router();
const Gallery = require('../../models/Gallery');

// GET all gallery items
router.get('/', async (req, res) => {
  try {
    const galleryItems = await Gallery.find().sort({ order: 1, createdAt: -1 });
    res.json(galleryItems);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET gallery item by ID
router.get('/:id', async (req, res) => {
  try {
    const galleryItem = await Gallery.findById(req.params.id);
    if (!galleryItem) {
      return res.status(404).json({ message: 'Gallery item not found' });
    }
    res.json(galleryItem);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST new gallery item
router.post('/', async (req, res) => {
  console.log(req.body);
  console.log('req.body');
  const galleryItem = new Gallery({
    image: req.body.image,
    order: req.body.order,
    isActive: req.body.isActive
  });

  try {
    const newGalleryItem = await galleryItem.save();
    res.status(201).json(newGalleryItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// UPDATE gallery item
router.patch('/:id', async (req, res) => {
  try {
    const galleryItem = await Gallery.findById(req.params.id);
    if (!galleryItem) {
      return res.status(404).json({ message: 'Gallery item not found' });
    }

    Object.keys(req.body).forEach(key => {
      if (req.body[key] != null) {
        galleryItem[key] = req.body[key];
      }
    });

    const updatedGalleryItem = await galleryItem.save();
    res.json(updatedGalleryItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE gallery item
router.delete('/:id', async (req, res) => {
  try {
    const galleryItem = await Gallery.findById(req.params.id);
    if (!galleryItem) {
      return res.status(404).json({ message: 'Gallery item not found' });
    }
    await galleryItem.remove();
    res.json({ message: 'Gallery item deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
