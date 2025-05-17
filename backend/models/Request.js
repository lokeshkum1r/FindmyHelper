// models/Request.js
const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  serviceType: {
    type: String,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  workerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Worker',
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  userLocation: {
    address: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'completed'],
    default: 'pending'
  },
  requestTime: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Request', requestSchema);