const dotenv = require("dotenv");
const mongoose = require("mongoose");

const connectDB = require("../config/db");
const seedRegionalData = require("./regionalData");

dotenv.config();

const seedDatabase = async () => {
  try {
    await connectDB();

    await seedRegionalData();

    console.log("Database seeding completed");

    await mongoose.connection.close();

    process.exit(0);
  } catch (error) {
    console.error("Database seeding failed:", error);

    process.exit(1);
  }
};

seedDatabase();