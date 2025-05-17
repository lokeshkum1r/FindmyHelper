// routes/addressRoutes.js

const express = require('express');
const router = express.Router();
const Address = require('../models/Address');
const authenticate = require('../middlewares/auth');

// Fetch all addresses of the authenticated user
router.get('/', authenticate, async (req, res) => {
  try {
    const addresses = await Address.find({ user: req.user.id });
    res.json(addresses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Add a new address
router.post('/', authenticate, async (req, res) => {
  const { fullName, phone, street, floor, city, state, zip, country } = req.body;

  try {
    // Create new address
    const newAddress = new Address({
      fullName,
      phone,
      street,
      floor,
      city,
      state,
      zip,
      country,
      user: req.user.id, // Associate the address with the authenticated user
    });

    await newAddress.save();
    res.json({ address: newAddress });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Delete an address
router.delete('/:id', async (req, res) => {
    try {
      const address = await Address.findByIdAndDelete(req.params.id);
      
      if (!address) {
        return res.status(404).json({ message: "Address not found" });
      }
      
      res.status(200).json({ message: "Address deleted successfully" });
    } catch (err) {
      console.error("Error deleting address:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
module.exports = router;
