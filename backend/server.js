require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const axios = require("axios");

// Routes
const userRoutes = require("./routes/userRoutes");
const orderRoutes = require("./routes/orderRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const cartRoutes = require("./routes/cartRoutes");
const paytmRoutes = require("./routes/paytmRoutes");
const workerRoutes = require('./routes/workerRoutes');
const adminRoutes = require('./routes/adminRoutes');
const addressRoutes = require("./routes/addressRoutes");

// Telegram Integration
require('./controllers/telegramController');
const { notifyWorker } = require('./services/notificationService');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Environment variables validation
if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI is not defined in .env");
  process.exit(1);
}

if (!process.env.TELEGRAM_BOT_TOKEN) {
  console.warn("⚠️ TELEGRAM_BOT_TOKEN not set - Telegram features will be disabled");
}

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });

// Routes
app.get("/", (req, res) => res.send("🚀 API is running..."));

// Improved Telegram-integrated helper join route
app.post("/join", async (req, res) => {
  const { fullName, skills, phoneNumber } = req.body;

  if (!fullName || !skills || !phoneNumber) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    // 1. Save to database using workerRegistrationRoutes
    const workerResponse = await axios.post('http://localhost:5000/api/workers/register', {
      fullName,
      skills,
      phoneNumber
    });

    if (workerResponse.status !== 201) {
      throw new Error(workerResponse.data.message || "Worker registration failed");
    }

    // 2. Send Telegram welcome message
    if (process.env.TELEGRAM_BOT_TOKEN) {
      const welcomeMessage = `Welcome, ${fullName}!\n\n` +
        `Please use the following command to link your account: /start ${phoneNumber}\n\n` +
        `You will receive service requests here after linking.`;

      await axios.post(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
        chat_id: process.env.TELEGRAM_CHAT_ID, // Use admin's chat ID initially
        text: welcomeMessage
      });
    }

    res.status(200).json({
      success: true,
      message: "Registration successful. Please check your Telegram for further instructions."
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      message: "Registration failed. " + (error.response?.data?.description || error.message)
    });
  }
});

// Mount other routes
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/carts", cartRoutes);
app.use("/api/paytm", paytmRoutes);
app.use('/api/admin', adminRoutes);
app.use("/api/addresses", addressRoutes);
app.use('/api/workers', workerRoutes);


// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  if (!process.env.TELEGRAM_BOT_TOKEN) {
    console.log("⚠️ Telegram bot token not configured - some features disabled");
  }
});