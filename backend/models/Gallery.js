const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
  image: {
    type: String,
    required: true
  },
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
gallerySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Gallery = mongoose.model('Gallery', gallerySchema);

module.exports = Gallery;
