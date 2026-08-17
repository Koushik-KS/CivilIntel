const dotenv = require("dotenv");
const mongoose = require("mongoose");

const connectDB = require("../config/db");
const seedRegionalData = require("./regionalData");
const seedDPIImpactData = require("./dpiImpactData");

dotenv.config();

const seedDatabase = async () => {
  try {
    await connectDB();

    // Seed regional intelligence data
    await seedRegionalData();

    // Seed DPI impact data
    await seedDPIImpactData();

    console.log("Database seeding completed");

    await mongoose.connection.close();

    process.exit(0);
  } catch (error) {
    console.error("Database seeding failed:", error);

    await mongoose.connection.close();
    process.exit(1);
  }
};

seedDatabase();