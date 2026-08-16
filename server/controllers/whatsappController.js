const DevelopmentRequest = require("../models/DevelopmentRequest");
const { analyzeRequest } = require("../services/intelligenceService");

// Verify WhatsApp webhook
const verifyWebhook = (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (
    mode === "subscribe" &&
    token === process.env.WHATSAPP_VERIFY_TOKEN
  ) {
    console.log("WhatsApp webhook verified successfully");

    return res.status(200).send(challenge);
  }

  return res.sendStatus(403);
};

// Receive WhatsApp message
const receiveWhatsAppMessage = async (req, res) => {
  try {
    const body = req.body;

    console.log(
      "WhatsApp Webhook Received:",
      JSON.stringify(body, null, 2)
    );

    // Send success response immediately
    res.sendStatus(200);

    // Check for message data
    const message =
      body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

    if (!message) {
      console.log("No WhatsApp message found.");
      return;
    }

    // Only process text messages
    if (message.type !== "text") {
      console.log("Only text messages are supported.");
      return;
    }

    const citizenMessage = message.text.body;

    const senderPhone = message.from;

    // Analyze message
    const analysis = analyzeRequest(citizenMessage);

    // Save request
    const newRequest = await DevelopmentRequest.create({
      citizenName: `WhatsApp User ${senderPhone}`,
      message: citizenMessage,
      language: "en",
      category: analysis.category,
      priority: analysis.priority,
      source: "Messaging",

      location: {
        country: "India",
        state: "Karnataka",
        district: "Unknown",
      },
    });

    console.log(
      "WhatsApp development request saved:",
      newRequest._id
    );
  } catch (error) {
    console.error(
      "WhatsApp Webhook Error:",
      error.message
    );
  }
};

module.exports = {
  verifyWebhook,
  receiveWhatsAppMessage,
};