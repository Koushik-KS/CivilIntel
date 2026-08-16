const RegionalData = require("../models/RegionalData");

const regionalData = [
  {
    country: "India",
    state: "Karnataka",
    district: "Chikkamagaluru",
    population: 120000,
    infrastructureIndex: 42,
    publicInvestment: 2500000,
  },
  {
    country: "India",
    state: "Karnataka",
    district: "Hassan",
    population: 180000,
    infrastructureIndex: 58,
    publicInvestment: 5000000,
  },
  {
    country: "India",
    state: "Karnataka",
    district: "Mysuru",
    population: 250000,
    infrastructureIndex: 75,
    publicInvestment: 12000000,
  },
  {
    country: "India",
    state: "Karnataka",
    district: "Mandya",
    population: 160000,
    infrastructureIndex: 48,
    publicInvestment: 3000000,
  },
];

const seedRegionalData = async () => {
  try {
    await RegionalData.deleteMany();
    await RegionalData.insertMany(regionalData);

    console.log("Regional data seeded successfully");
  } catch (error) {
    console.error("Seeding error:", error.message);
  }
};

module.exports = seedRegionalData;