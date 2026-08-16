const express = require("express");
const router = express.Router();

const {
  createRequest,
  getRequests,
} = require("../controllers/requestController");

// Create a new citizen development request
router.post("/", createRequest);

// Get all citizen development requests
router.get("/", getRequests);

module.exports = router;