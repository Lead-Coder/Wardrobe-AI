const mongoose = require('mongoose');

const wardrobeItemSchema = new mongoose.Schema({
  imageUrl: String,
  filename: String,
  mimetype: String,
  size: Number,
  color: String,
  season: String,
  fabric: String,
  usage: String,
  category: String,
  fit: String,
  description: String,
  uploadDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('wardrobes', wardrobeItemSchema);
