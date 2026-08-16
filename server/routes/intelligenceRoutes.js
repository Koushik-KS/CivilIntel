const express = require("express");
const router = express.Router();

const {
  getHotspots,
  getPriorityRecommendations,
  getDashboardStats,
} = require("../controllers/intelligenceController");

router.get("/stats", getDashboardStats);
router.get("/hotspots", getHotspots);
router.get("/recommendations", getPriorityRecommendations);

module.exports = router;