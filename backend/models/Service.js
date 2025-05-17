const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  id: Number, // Include this if your data uses a custom `id`
  category: String,
  name: String,
  description: String,
  price: Number,
  image: String,
});

module.exports = mongoose.model('Service', serviceSchema);
