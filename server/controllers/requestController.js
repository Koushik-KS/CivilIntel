const DevelopmentRequest = require("../models/DevelopmentRequest");
const { analyzeRequest } = require("../services/intelligenceService");

// Create citizen development request
const createRequest = async (req, res) => {
  try {
    const { message, language = "en" } = req.body;

    // Validate message
    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Development request message is required.",
      });
    }

    // Analyze citizen message
    const analysis = analyzeRequest(message, language);

    // Save request with AI intelligence results
    const newRequest = await DevelopmentRequest.create({
      ...req.body,
      category: analysis.category,
      priority: analysis.priority,
      urgencyScore: analysis.urgencyScore,
      confidenceScore: analysis.confidenceScore,
      detectedLanguage: analysis.detectedLanguage,
      detectedSignals: analysis.detectedSignals,
    });

    res.status(201).json({
      success: true,
      message: "Development request analyzed and submitted successfully",
      analysis,
      data: newRequest,
    });
  } catch (error) {
    console.error("Create Request Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all development requests
const getRequests = async (req, res) => {
  try {
    const requests = await DevelopmentRequest.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: requests.length,
      data: requests,
    });
  } catch (error) {
    console.error("Get Requests Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createRequest,
  getRequests,
};