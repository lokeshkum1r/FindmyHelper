const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
  serviceId: {
    type: String,
    required: true
  },
  name: String,
  price: Number,
  quantity: Number,
  image: String,    
  description: String 
});

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  },
  sessionId: {
    type: String,
    required: true
  },
  items: [cartItemSchema],
  totals: {
    subtotal: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    shipping: { type: Number, default: 20 },
    grandTotal: { type: Number, default: 0 }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Define the index
cartSchema.index({ sessionId: 1 }, { unique: true });

const Cart = mongoose.model("Cart", cartSchema);

// ✅ Create indexes using the model, not the schema
Cart.createIndexes().catch(err => console.log("Index creation error:", err));

module.exports = Cart;
