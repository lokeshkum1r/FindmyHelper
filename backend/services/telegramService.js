// services/telegramService.js
const axios = require('axios');
const Order = require('../models/Order');

// Get bot token from environment variables
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;


// Function to send message to admin
const notifyAdmin = async (message) => {
  if (!TELEGRAM_BOT_TOKEN || !process.env.TELEGRAM_CHAT_ID) {
    console.warn('⚠️ Telegram token or admin chat ID missing.');
    return false;
  }
  
  try {
    await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      chat_id: process.env.TELEGRAM_CHAT_ID,
      text: message,
      parse_mode: 'Markdown'
    });
    return true;
  } catch (error) {
    console.error('Telegram notification error:', error.message);
    return false;
  }
};


// Function to generate deep link for Telegram bot
const generateTelegramLink = (phoneNumber) => {
  return `https://t.me/${process.env.BOT_USERNAME}?start=${phoneNumber}`;
};

// Function to send job request to worker with inline buttons
const notifyWorkerWithJob = async (chatId, orderId, items, address, totals) => {
  try {
    // Create message with order details
    const message = `
📦 *New Job Request*:
🆔 Order ID: ${orderId}
📍 Address: ${address?.street}, ${address?.city}, ${address?.state}
💼 Items: ${items?.map(i => i.name).join(', ') || 'N/A'}
💰 Total: ₹${totals?.grandTotal || 0}
👤 Contact: ${address?.fullName} (${address?.phone})
    `;
    
    // Send message with inline keyboard buttons
    await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      chat_id: chatId,
      text: message,
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [
            { text: '✅ Accept Job', callback_data: `accept_${orderId}` },
            { text: '❌ Reject', callback_data: `reject_${orderId}` }
          ]
        ]
      }
    });
    
    return true;
  } catch (error) {
    console.error('Worker job notification error:', error.message);
    return false;
  }
};

module.exports = {
  notifyAdmin,
  generateTelegramLink,
  notifyWorkerWithJob
};