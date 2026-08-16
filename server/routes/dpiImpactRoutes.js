const express = require("express");

const {
  createDPIImpact,
  getDPIImpacts,
  getDPIImpactById,
} = require("../controllers/dpiImpactController");

const router = express.Router();

// Create DPI impact record
router.post("/", createDPIImpact);

// Get all DPI impact records
router.get("/", getDPIImpacts);

// Get one DPI impact record
router.get("/:id", getDPIImpactById);

module.exports = router;