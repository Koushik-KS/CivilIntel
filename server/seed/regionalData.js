const RegionalData = require("../models/RegionalData");

const regionalData = [
  {
    country: "India",
    state: "Karnataka",
    district: "Chikkamagaluru",
    address: {
      city: "Chikkamagaluru",
      taluk: "Chikkamagaluru",
      village: "",
      pincode: "577101",
    },
    population: 120000,
    populationDensity: 350,
    ruralPopulation: 75000,
    urbanPopulation: 45000,
    infrastructureIndex: 42,
    infrastructure: {
      roads: 35,
      healthcare: 50,
      education: 60,
      water: 40,
      electricity: 65,
    },
    publicInvestment: 2500000,
  },
  {
    country: "India",
    state: "Karnataka",
    district: "Hassan",
    population: 180000,
    populationDensity: 400,
    ruralPopulation: 100000,
    urbanPopulation: 80000,
    infrastructureIndex: 58,
    infrastructure: {
      roads: 55,
      healthcare: 60,
      education: 65,
      water: 58,
      electricity: 70,
    },
    publicInvestment: 5000000,
  },
  {
    country: "India",
    state: "Karnataka",
    district: "Mysuru",
    population: 250000,
    populationDensity: 500,
    ruralPopulation: 100000,
    urbanPopulation: 150000,
    infrastructureIndex: 75,
    infrastructure: {
      roads: 80,
      healthcare: 78,
      education: 82,
      water: 75,
      electricity: 85,
    },
    publicInvestment: 12000000,
  },
];

const seedRegionalData = async () => {
  try {
    await RegionalData.deleteMany();

    await RegionalData.insertMany(regionalData);

    console.log("Regional data seeded successfully");
    console.log(`${regionalData.length} regions added`);
  } catch (error) {
    console.error("Seeding error:", error.message);
  }
};

module.exports = seedRegionalData;