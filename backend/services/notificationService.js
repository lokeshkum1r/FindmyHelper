// services/notificationService.js
const { bot } = require('../config/telegramBot');
const Request = require('../models/Request');

async function notifyWorker(workerId, requestId) {
  try {
    const request = await Request.findById(requestId).populate('user');
    const worker = await Worker.findById(workerId);

    if (!worker) {
      throw new Error(`Worker with ID ${workerId} not found`);
    }

    const message = `📌 New ${request.serviceType} Request!\n\n` +
      `User: ${request.user.name}\n` +
      `When: ${request.preferredTime}\n` +
      `📍 Location: ${request.location.address}`;

    await bot.sendMessage(worker.telegramChatId, message, {
      reply_markup: {
        inline_keyboard: [
          [
            { text: '✅ Accept', callback_data: `accept_${request._id}` },
            { text: '❌ Reject', callback_data: `reject_${request._id}` }
          ]
        ]
      }
    });

    if (request.location.coordinates) {
      await bot.sendLocation(
        worker.telegramChatId,
        request.location.coordinates.lat,
        request.location.coordinates.lng
      );
    }
  } catch (error) {
    console.error('Telegram notification failed:', error.message);
  }
}

async function notifyAvailableWorkers(order) {
  try {
    // Find available workers near the order location
    const workers = await Worker.find({
      isAvailable: true,
      // Add location-based query if you have worker locations
      // skills: { $in: order.serviceType } // If you have service types
    });

    if (workers.length === 0) {
      console.log('No available workers found');
      return;
    }

    // Send notification to each available worker
    for (const worker of workers) {
      if (worker.telegramChatId) {
        const message = `📦 New Service Request!\n\n` +
          `Order ID: ${order._id}\n` +
          `Service: ${order.serviceType || 'General Help'}\n` +
          `When: ${order.preferredTime || 'ASAP'}\n` +
          `Location: ${order.location?.address || 'Not specified'}\n` +
          `Payment: $${order.totalAmount || '0'}`;

        await bot.sendMessage(worker.telegramChatId, message, {
          reply_markup: {
            inline_keyboard: [
              [
                { text: '✅ Accept', callback_data: `accept_${order._id}` },
                { text: '❌ Reject', callback_data: `reject_${order._id}` }
              ]
            ]
          }
        });

        if (order.location?.coordinates) {
          await bot.sendLocation(
            worker.telegramChatId,
            order.location.coordinates.lat,
            order.location.coordinates.lng
          );
        }
      }
    }
  } catch (error) {
    console.error('Failed to notify workers:', error);
  }
}

module.exports = { notifyWorker, notifyAvailableWorkers };