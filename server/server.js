const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");

const requestRoutes = require("./routes/requestRoutes");
const intelligenceRoutes = require("./routes/intelligenceRoutes");
const regionalDataRoutes = require("./routes/regionalDataRoutes");
const messagingRoutes = require("./routes/messagingRoutes");
const dpiImpactRoutes = require("./routes/dpiImpactRoutes");
const whatsappRoutes = require("./routes/whatsappRoutes");

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// WhatsApp Webhook Verification
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  console.log("Webhook verification request received");
  console.log("Mode:", mode);
  console.log("Token:", token);

  if (
    mode === "subscribe" &&
    token === process.env.WHATSAPP_VERIFY_TOKEN
  ) {
    console.log("Webhook verified successfully!");
    return res.status(200).send(challenge);
  }

  console.log("Webhook verification failed");
  return res.sendStatus(403);
});

// Routes
app.use("/api/requests", requestRoutes);
app.use("/api/intelligence", intelligenceRoutes);
app.use("/api/regional-data", regionalDataRoutes);
app.use("/api/messaging", messagingRoutes);
app.use("/api/dpi-impact", dpiImpactRoutes);
app.use("/api/whatsapp", whatsappRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "CivilIntel API is running",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});