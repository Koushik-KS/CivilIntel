const express = require("express");
const router = express.Router();

const {
  getHotspots,
} = require("../controllers/intelligenceController");

router.get("/hotspots", getHotspots);

module.exports = router;