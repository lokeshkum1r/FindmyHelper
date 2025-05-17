const express = require('express');
const adminController = require('../controllers/adminController');

const router = express.Router();

router.post('/send-message', adminController.sendMessageToAllWorkers);

module.exports = router;
