const express = require("express");

const {
  verifyWebhook,
  receiveWhatsAppMessage,
} = require("../controllers/whatsappController");

const router = express.Router();

// WhatsApp webhook verification
router.get("/webhook", verifyWebhook);

// Receive WhatsApp messages
router.post("/webhook", receiveWhatsAppMessage);

module.exports = router;