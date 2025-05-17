const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const authenticate = require('../middlewares/auth');


// Add middleware to ensure sessionId is present
const ensureSessionId = (req, res, next) => {
  const sessionId = req.headers["x-session-id"] || req.body.sessionId;
  if (!sessionId) {
    return res.status(400).json({ success: false, error: "Session ID is required" });
  }
  next();
};

router.post("/add",  ensureSessionId, cartController.addToCart);
router.post("/remove", ensureSessionId, cartController.removeFromCart);
router.get("/:sessionId", cartController.getCart);

module.exports = router;