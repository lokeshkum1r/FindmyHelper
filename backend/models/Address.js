// models/address.js

const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  street: {
    type: String,
    required: true,
  },
  floor: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  zip: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    default: 'India',
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  // Assuming you have a User model to associate addresses with users
    required: true,
  }
}, {
  timestamps: true,
});

module.exports = mongoose.model('Address', addressSchema);
