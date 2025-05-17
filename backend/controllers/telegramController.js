const { bot } = require('../config/telegramBot');
const Worker = require('../models/Worker');
const Order = require('../models/Order');
const axios = require('axios');

// Helper function to calculate ETA based on location
const calculateETA = () => {
  // This would typically use location data for real calculation
  // For now returning a random time between 15-45 minutes
  return Math.floor(Math.random() * 30) + 15;
};

// Link worker account to Telegram
bot.onText(/\/start (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const phoneNumber = match[1]; // Extract phone from /start <phone>

  try {
    // Find and link the worker's Telegram account
    const worker = await Worker.findOneAndUpdate(
      { phoneNumber },
      { 
        telegramChatId: chatId,
        isTelegramLinked: true,
        telegramUsername: msg.from.username || '',
        telegramFirstName: msg.from.first_name || ''
      },
      { new: true }
    );

    if (worker) {
      // Successfully linked, send confirmation message
      bot.sendMessage(chatId, `✅ Successfully linked!\n\nHi ${worker.fullName}, you'll receive service requests here.`);
    } else {
      // Worker not found, prompt for registration
      bot.sendMessage(chatId, '❌ Worker not found. Please register first.');
    }
  } catch (error) {
    console.error('Telegram linking error:', error);
    bot.sendMessage(chatId, '⚠️ Error linking account. Please try again.');
  }
});

// Handle accept/reject actions for job requests
bot.on('callback_query', async (callbackQuery) => {
  const { data, message } = callbackQuery;
  const [action, orderId] = data.split('_');
  const chatId = message.chat.id;

  try {
    // Find the worker based on telegram chat ID
    const worker = await Worker.findOne({ telegramChatId: chatId });
    
    if (!worker) {
      return bot.answerCallbackQuery(callbackQuery.id, {
        text: "Worker profile not found. Please register first.",
        show_alert: true
      });
    }

    if (action === 'accept') {
      // Get worker details for the order
      const workerDetails = {
        helperName: worker.fullName,
        helperPhone: worker.phoneNumber,
        helperRating: worker.rating || 4.5, // Default or actual rating if available
        helperPhoto: worker.photo || 'https://via.placeholder.com/150', // Default or actual photo
        helperETA: calculateETA(),
        helperChatId: chatId,
        helperTelegramUsername: worker.telegramUsername || callbackQuery.from.username
      };

      // Update order status and assign helper
      const order = await Order.findByIdAndUpdate(
        orderId,
        { 
          status: 'accepted',
          ...workerDetails
        },
        { new: true }
      );
      
      if (!order) {
        return bot.answerCallbackQuery(callbackQuery.id, {
          text: "Order not found or already assigned.",
          show_alert: true
        });
      }
      
      // Confirm to worker
      bot.sendMessage(chatId, `✅ You've accepted order #${orderId}!

📦 Order Details:
👤 Customer: ${order.address.fullName}
📱 Phone: ${order.address.phone}
📍 Address: ${order.address.street}, ${order.address.city}

Please contact the customer and proceed with the service.`);
      
      // Edit the original message to remove buttons
      bot.editMessageReplyMarkup({ inline_keyboard: [] }, {
        chat_id: chatId,
        message_id: message.message_id
      });
      
      // Answer the callback query
      bot.answerCallbackQuery(callbackQuery.id, {
        text: "Order accepted successfully!",
        show_alert: false
      });
      
    } else if (action === 'reject') {
      // Just notify the worker
      bot.sendMessage(chatId, `❌ You've rejected order #${orderId}.`);
      
      // Edit the original message to remove buttons
      bot.editMessageReplyMarkup({ inline_keyboard: [] }, {
        chat_id: chatId,
        message_id: message.message_id
      });
      
      // Answer the callback query
      bot.answerCallbackQuery(callbackQuery.id, {
        text: "Order rejected.",
        show_alert: false
      });
    }
  } catch (error) {
    console.error('Callback query processing error:', error);
    bot.answerCallbackQuery(callbackQuery.id, {
      text: "Error processing your action. Please try again.",
      show_alert: true
    });
  }
});

// Handle location sharing from workers
bot.on('location', async (msg) => {
  const chatId = msg.chat.id;
  
  try {
    // Find worker by telegram chat ID
    const worker = await Worker.findOne({ telegramChatId: chatId });
    
    if (!worker) {
      return bot.sendMessage(chatId, "Worker profile not found. Please register first.");
    }
    
    // Find any active orders for this worker
    const activeOrder = await Order.findOne({ 
      helperChatId: chatId,
      status: 'accepted'
    });
    
    if (!activeOrder) {
      return bot.sendMessage(chatId, "No active orders found. Your location has been received but not linked to any order.");
    }
    
    // Update worker's current location
    worker.currentLocation = {
      type: 'Point',
      coordinates: [msg.location.longitude, msg.location.latitude]
    };
    await worker.save();
    
    // Update the order with worker's current location
    activeOrder.helperLocation = {
      latitude: msg.location.latitude,
      longitude: msg.location.longitude,
      updatedAt: new Date()
    };
    await activeOrder.save();
    
    bot.sendMessage(chatId, "✅ Your location has been updated and shared with the customer.");
    
  } catch (error) {
    console.error('Location processing error:', error);
    bot.sendMessage(chatId, "Error processing your location. Please try again.");
  }
});

module.exports = { bot };