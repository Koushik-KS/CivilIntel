const express = require("express");
const router = express.Router();

const {
  getHotspots,
  getPriorityRecommendations,
} = require("../controllers/intelligenceController");

router.get("/hotspots", getHotspots);
router.get("/recommendations", getPriorityRecommendations);

module.exports = router;