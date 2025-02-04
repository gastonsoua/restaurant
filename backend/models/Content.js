const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
  section: {
    type: String,
    required: true,
    enum: ['hero', 'menu', 'gallery', 'about', 'contact']
  },
  title: {
    type: String,
    required: true
  },
  description: String,
  imageUrl: String,
  order: Number,
  isActive: {
    type: Boolean,
    default: true
  },
  additionalInfo: {
    price: Number,
    hours: String,
    phone: String,
    address: String
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Content', contentSchema);
