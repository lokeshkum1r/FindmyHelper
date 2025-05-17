const express = require('express');
const router = express.Router();
const Worker = require('../models/Worker');
const axios = require('axios');
const { notifyAdmin, generateTelegramLink, notifyWorkerWithJob } = require('../services/telegramService');

// Worker registration endpoint
router.post('/register', async (req, res) => {
  const { fullName, skills, phoneNumber } = req.body;

  // Validate input fields
  if (!fullName || !skills || !phoneNumber) {
    return res.status(400).json({
      success: false,
      message: 'All fields are required',
    });
  }

  // Validate phone number format
  if (!/^\d{10,15}$/.test(phoneNumber)) {
    return res.status(400).json({ message: 'Invalid phone number format' });
  }

  try {
    // Check if worker already exists
    const existingWorker = await Worker.findOne({ phoneNumber });
    if (existingWorker) {
      return res.status(400).json({ message: 'Worker already registered' });
    }

    // Process skills (convert string to array if needed)
    const skillsArray = typeof skills === 'string' ? skills.split(',').map(skill => skill.trim()) : skills;

    // Create new worker
    const worker = new Worker({
      fullName,
      skills: skillsArray,
      phoneNumber,
      registrationDate: new Date(),
    });

    await worker.save();

    // Generate Telegram deep link
    const telegramLink = generateTelegramLink(phoneNumber);

    // Notify admin via Telegram
    await notifyAdmin(
      `🆕 *New Worker Registration*:\n` +
      `👤 Name: *${fullName}*\n` +
      `🛠️ Skills: *${worker.skills.join(', ')}*\n` +
      `📱 Phone: *${phoneNumber}*\n` +
      `🔗 Telegram: [Link](${telegramLink})`
    );
    

    // Return successful response
    res.status(201).json({
      success: true,
      message: 'Registration successful!',
      telegramLink,
    });

  } catch (error) {
    console.error('Registration error:', error.message, error.stack);

    res.status(500).json({
      success: false,
      message: `Registration failed due to an unexpected error: ${error.message}`,
    });
  }
});

// Notify all workers via Telegram
router.post('/notify', async (req, res) => {
  try {
    const { orderId, items, address, totals } = req.body;

    if (!orderId || !address) {
      return res.status(400).json({ 
        success: false, 
        message: "Missing required order information" 
      });
    }

    // Find all workers with linked Telegram accounts
    const workers = await Worker.find({ 
      isTelegramLinked: true,
      telegramChatId: { $exists: true, $ne: null }
    });

    if (workers.length === 0) {
      return res.status(200).json({ 
        success: true, 
        message: 'No workers with linked Telegram accounts found.' 
      });
    }

    // Send notifications to all eligible workers
    let notificationsSent = 0;
    for (const worker of workers) {
      if (worker.telegramChatId) {
        await notifyWorkerWithJob(
          worker.telegramChatId,
          orderId,
          items,
          address,
          totals
        );
        notificationsSent++;
      }
    }

    res.status(200).json({ 
      success: true, 
      message: `Telegram notifications sent to ${notificationsSent} workers.` 
    });
  } catch (error) {
    console.error("Notify error:", error.message);
    res.status(500).json({ 
      success: false, 
      message: "Failed to send Telegram notifications." 
    });
  }
});

// New endpoint to get location from user and send to worker
router.post('/location', async (req, res) => {
  try {
    const { orderId, latitude, longitude, workerChatId } = req.body;
    
    if (!orderId || !latitude || !longitude || !workerChatId) {
      return res.status(400).json({
        success: false,
        message: 'Missing required information'
      });
    }
    
    // Send location to worker via Telegram
    await axios.post(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendLocation`, {
      chat_id: workerChatId,
      latitude,
      longitude,
      reply_markup: {
        inline_keyboard: [
          [{ text: 'Open in Maps', url: `https://maps.google.com/?q=${latitude},${longitude}` }]
        ]
      }
    });
    
    res.status(200).json({
      success: true,
      message: 'Location sent to worker successfully'
    });
    
  } catch (error) {
    console.error("Send location error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to send location to worker."
    });
  }
});

module.exports = router;