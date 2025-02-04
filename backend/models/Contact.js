const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  address: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  workingHours: {
    type: String,
    required: true,
  },
  googleMapsLink: {
    type: String,
  },
  facebookLink: {
    type: String,
  },
  instagramLink: {
    type: String,
  },
  twitterLink: {
    type: String,
  },
}, { timestamps: true });

module.exports = mongoose.model('Contact', contactSchema);
