const mongoose = require('mongoose');

const aboutSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
  },
  content: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  mission: {
    type: String,
  },
  vision: {
    type: String,
  },
}, { timestamps: true });

module.exports = mongoose.model('About', aboutSchema);
