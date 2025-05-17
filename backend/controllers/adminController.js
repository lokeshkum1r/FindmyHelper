const Worker = require('../models/Worker');
const { bot } = require('../config/telegramBot');

exports.sendMessageToAllWorkers = async (req, res) => {
  const { message } = req.body;

  try {
    const workers = await Worker.find({ isTelegramLinked: true });

    if (!workers || workers.length === 0) {
      return res.status(404).json({ message: "No linked workers found." });
    }

    for (const worker of workers) {
      if (worker.telegramChatId) {
        await bot.sendMessage(worker.telegramChatId, message);
      }
    }

    res.status(200).json({ message: "Message sent to all linked workers." });
  } catch (error) {
    console.error("Error sending message to workers:", error);
    res.status(500).json({ message: "Failed to send message." });
  }
};
