// models/Worker.js
const mongoose = require('mongoose');

const pointSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['Point'],
    default: 'Point'
  },
  coordinates: {
    type: [Number], // [longitude, latitude]
    required: true
  }
});

const workerSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  skills: {
    type: [String],
    required: [true, 'At least one skill is required'],
    validate: {
      validator: function(v) {
        return v.length > 0;
      },
      message: 'At least one skill is required'
    }
  },
  phoneNumber: {
    type: String,
    required: [true, 'Phone number is required'],
    unique: true,
    match: [/^[0-9]{10,15}$/, 'Please enter a valid phone number']
  },
  registrationDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  telegramChatId: {
    type: Number,
    default: null
  },
  telegramUsername: {
    type: String,
    default: ''
  },
  telegramFirstName: {
    type: String,
    default: ''
  },
  isTelegramLinked: {
    type: Boolean,
    default: false
  },
  currentLocation: {
    type: pointSchema,
    index: '2dsphere',
    default: null
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: 4.5
  },
  photo: {
    type: String,
    default: 'https://via.placeholder.com/150'
  }
});

module.exports = mongoose.model('Worker', workerSchema);