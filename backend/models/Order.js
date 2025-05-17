const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  invoiceNo: { type: String, required: true },
  items: [{
    serviceId: { type: String, ref: 'Service', required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    description: { type: String },
    image: { type: String }
  }],
  address: {
    fullName: { type: String, required: true },
    street: { type: String, required: true },
    floor: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: String, required: true },
    phone: { type: String, required: true }
  },
  totals: {
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    gst: { type: Number, required: true },
    delivery: { type: Number, default: 20 },
    grandTotal: { type: Number, required: true }
  },
  paymentMethod: { type: String, default: 'COD' },
  paymentStatus: { type: String, default: 'pending' },
  status: { type: String, default: 'pending' },
  helperName: { type: String },
  helperPhone: { type: String },
  helperRating: { type: Number },
  helperPhoto: { type: String },
  helperETA: { type: Number },
  helperChatId: { type: Number },
  helperTelegramUsername: { type: String },
  helperLocation: {
    latitude: { type: Number },
    longitude: { type: Number },
    updatedAt: { type: Date }
  }
}, { timestamps: true }); 



const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
