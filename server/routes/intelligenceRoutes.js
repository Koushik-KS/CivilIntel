const express = require("express");
const router = express.Router();

const {
  getHotspots,
  getPriorityRecommendations,
  getDashboardStats,
  analyzeMessage,
} = require("../controllers/intelligenceController");

// Dashboard statistics
router.get("/stats", getDashboardStats);

// Demand hotspots
router.get("/hotspots", getHotspots);

// AI project recommendations
router.get("/recommendations", getPriorityRecommendations);

// AI Citizen Message Analysis
router.post("/analyze-message", analyzeMessage);

module.exports = router;