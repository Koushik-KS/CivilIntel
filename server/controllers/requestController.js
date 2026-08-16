const DevelopmentRequest = require("../models/DevelopmentRequest");
const { analyzeRequest } = require("../services/intelligenceService");
// Create citizen development request
const createRequest = async (req, res) => {
  try {
    const { message } = req.body;

    // Analyze citizen message
    const analysis = analyzeRequest(message);

    const newRequest = await DevelopmentRequest.create({
      ...req.body,
      category: analysis.category,
      priority: analysis.priority,
    });

    res.status(201).json({
      success: true,
      message: "Development request analyzed and submitted successfully",
      analysis,
      data: newRequest,
    });
  } catch (error) {
    res.status(400).json({
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