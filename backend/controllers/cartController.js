const Cart = require("../models/cart");
const mongoose = require("mongoose");

function updateCartTotals(cart) {
  cart.totals.subtotal = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  cart.totals.tax = parseFloat((cart.totals.subtotal * 0.1).toFixed(2));
  cart.totals.shipping = 20;
  cart.totals.grandTotal = cart.totals.subtotal + cart.totals.tax + cart.totals.shipping;
}

exports.addToCart = async (req, res) => {
  try {
    const {
      serviceId,
      name,
      price,
      quantity,
      image,
      description,
      sessionId,
    } = req.body;

    const userId = req.user?.id || null;

    if (!serviceId || !price || !quantity || quantity <= 0) {
      return res.status(400).json({ success: false, message: "Invalid item details or quantity" });
    }

    if (!userId && !sessionId) {
      return res.status(400).json({ success: false, message: "User or session ID required" });
    }

    let cart;

    if (userId) {
      // Look for a cart with the same userId
      cart = await Cart.findOne({ userId });

      if (!cart) {
        // If no cart for user, create new cart with userId only
        cart = new Cart({
          userId,
          sessionId: null,
          items: [{
            serviceId,
            name,
            price,
            quantity,
            image,
            description,
          }],
          totals: {}
        });
      } else {
        // Check if service already in cart
        const existingIndex = cart.items.findIndex(item => item.serviceId.toString() === serviceId.toString());

        if (existingIndex !== -1) {
          cart.items[existingIndex].quantity += quantity;
        } else {
          cart.items.push({ serviceId, name, price, quantity, image, description });
        }
      }
    } else {
      // Fallback to sessionId
      cart = await Cart.findOne({ sessionId });

      if (!cart) {
        cart = new Cart({
          sessionId,
          userId: null,
          items: [{
            serviceId,
            name,
            price,
            quantity,
            image,
            description,
          }],
          totals: {}
        });
      } else {
        const existingIndex = cart.items.findIndex(item => item.serviceId.toString() === serviceId.toString());

        if (existingIndex !== -1) {
          cart.items[existingIndex].quantity += quantity;
        } else {
          cart.items.push({ serviceId, name, price, quantity, image, description });
        }
      }
    }

    // Recalculate totals
    updateCartTotals(cart);
    await cart.save();

    return res.status(200).json({ success: true, cart });

  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const { serviceId, quantity } = req.body;
    const sessionId = req.headers["x-session-id"] || req.body.sessionId;
    if (!sessionId || !quantity) return res.status(400).json({ success: false, error: "Session ID and quantity are required" });

    const cart = await Cart.findOne({ sessionId });
    if (!cart) return res.status(404).json({ success: false, error: "Cart not found" });

    const itemIndex = cart.items.findIndex(item => item.serviceId.toString() === serviceId.toString());
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity -= quantity;
      if (cart.items[itemIndex].quantity <= 0) {
        cart.items.splice(itemIndex, 1);
      }
    }

    updateCartTotals(cart);
    await cart.save();
    res.json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getCart = async (req, res) => {
  try {
    const sessionId = req.headers["x-session-id"] || req.params.sessionId;
    if (!sessionId) {
      return res.status(400).json({ success: false, error: "Session ID is required" });
    }

    let cart = await Cart.findOne({ sessionId });

    // If no cart found, create an empty one
    if (!cart) {
      cart = new Cart({
        sessionId,
        items: [],
        totals: {
          subtotal: 0,
          tax: 0,
          shipping: 20,
          grandTotal: 20,
        },
      });
      await cart.save();
    }

    res.json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
