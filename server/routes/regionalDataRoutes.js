const express = require("express");

const {
  createRegionalData,
  getRegionalData,
} = require("../controllers/regionalDataController");

const router = express.Router();

// Create regional demographic and infrastructure data
router.post("/", createRegionalData);

// Get all regional data
router.get("/", getRegionalData);

module.exports = router;