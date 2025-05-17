const express = require('express');
const router = express.Router();
const Service = require('../models/Service');

// POST: Add multiple services
router.post('/add-many', async (req, res) => {
  try {
    const services = req.body.services;
    await Service.insertMany(services);
    res.status(201).json({ message: 'Services added successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error adding services', error });
  }
});

// GET: All services or filter by serviceType
router.get('/', async (req, res) => {
  try {
    const { type } = req.query;
    const services = type
      ? await Service.find({ serviceType: type })
      : await Service.find();
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching services', error });
  }
});

module.exports = router;
