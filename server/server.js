const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const requestRoutes = require("./routes/requestRoutes");
const intelligenceRoutes = require("./routes/intelligenceRoutes");


dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/requests", requestRoutes);
app.use("/api/intelligence", intelligenceRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "CivilIntel API is running"
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});