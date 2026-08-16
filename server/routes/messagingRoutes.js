const express = require("express");

const {
  receiveMessage,
} = require("../controllers/messagingController");

const router = express.Router();

router.post("/receive", receiveMessage);

module.exports = router;