const dotenv = require("dotenv");
const mongoose = require("mongoose");

const connectDB = require("../config/db");
const seedRegionalData = require("./regionalData");

dotenv.config();

const runSeed = async () => {
  try {
    await connectDB();
    await seedRegionalData();

    console.log("All seed data inserted successfully");

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error.message);
    process.exit(1);
  }
};

runSeed();