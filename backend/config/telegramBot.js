// config/telegramBot.js
const TelegramBot = require('node-telegram-bot-api');
const { Worker, Request } = require('../models/Worker'); // Adjust the import based on your structure


const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { 
  polling: process.env.NODE_ENV !== 'production'
});
async function notifyAdmin(message) {
  try {
    const adminChatId = process.env.TELEGRAM_CHAT_ID;  // Use the chat ID for the admin
    await bot.sendMessage(adminChatId, message);  // Send the message to the admin
  } catch (error) {
    console.error('Failed to notify admin:', error);
  }
}

// For production, use webhooks instead:
// bot.setWebHook(`${process.env.APP_URL}/bot${process.env.TELEGRAM_BOT_TOKEN}`);

module.exports = { bot };