const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true 
  },
  age: { 
    type: Number, 
    required: true 
  },
  height: { 
    type: Number, 
    required: true
  },
  size: { 
    type: String, 
    required: true 
  },
  gender: { 
    type: String, 
    required: true 
  }, 
  preferences: { 
    type: String, 
    required: true 
  }, 
  color: { 
    type: String, 
    required: true 
  },
  material: { 
    type: String, 
    required: true 
  },
  fitting: { 
    type: String, 
    required: true 
  },
  region: { 
    type: String, 
    required: true 
  },
  image: { 
    type: String, 
    required: true 
  },
}, {
  timestamps: true
});

module.exports = mongoose.model('userdetail', userSchema);
