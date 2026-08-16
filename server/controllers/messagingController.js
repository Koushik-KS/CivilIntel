const DevelopmentRequest = require("../models/DevelopmentRequest");
const { analyzeRequest } = require("../services/intelligenceService");

// Receive citizen request from a messaging platform
const receiveMessage = async (req, res) => {
  try {
    const {
      citizenName,
      message,
      language = "en",
      platform = "WhatsApp",
      country = "India",
      state,
      district,
    } = req.body;

    if (!message || !state || !district) {
      return res.status(400).json({
        success: false,
        message: "Message, state and district are required.",
      });
    }

    // Analyze the citizen message
    const analysis = analyzeRequest(message);

    // Save as a Messaging request
    const newRequest = await DevelopmentRequest.create({
      citizenName: citizenName || "Anonymous Citizen",
      message,
      language,
      category: analysis.category,
      priority: analysis.priority,
      source: "Messaging",
      location: {
        country,
        state,
        district,
      },
    });

    res.status(201).json({
      success: true,
      message: `Request received from ${platform} and analyzed successfully.`,
      platform,
      analysis,
      data: newRequest,
    });
  } catch (error) {
    console.error("Messaging Request Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  receiveMessage,
};