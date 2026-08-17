const DPIImpact = require("../models/DPIImpact");

const dpiImpactData = [
  {
    country: "India",
    state: "Karnataka",
    district: "Chikkamagaluru",
    projectName: "Smart Water Supply Improvement",
    category: "Water & Drainage",
    status: "Completed",

    beforeMetrics: {
      citizenRequests: 120,
      criticalIssues: 35,
      infrastructureIndex: 42,
    },

    afterMetrics: {
      citizenRequests: 45,
      criticalIssues: 8,
      infrastructureIndex: 78,
    },

    publicInvestment: 2500000,
  },

  {
    country: "India",
    state: "Karnataka",
    district: "Chikkamagaluru",
    projectName: "Rural Road Modernization Project",
    category: "Road Infrastructure",
    status: "In Progress",

    beforeMetrics: {
      citizenRequests: 90,
      criticalIssues: 25,
      infrastructureIndex: 48,
    },

    afterMetrics: {
      citizenRequests: 55,
      criticalIssues: 12,
      infrastructureIndex: 70,
    },

    publicInvestment: 5000000,
  },

  {
    country: "India",
    state: "Karnataka",
    district: "Hassan",
    projectName: "Digital Healthcare Access Initiative",
    category: "Healthcare",
    status: "Completed",

    beforeMetrics: {
      citizenRequests: 150,
      criticalIssues: 40,
      infrastructureIndex: 55,
    },

    afterMetrics: {
      citizenRequests: 50,
      criticalIssues: 10,
      infrastructureIndex: 82,
    },

    publicInvestment: 8000000,
  },
];

const seedDPIImpactData = async () => {
  try {
    await DPIImpact.deleteMany();

    await DPIImpact.insertMany(dpiImpactData);

    console.log("DPI impact data seeded successfully");
    console.log(`${dpiImpactData.length} DPI impact records added`);
  } catch (error) {
    console.error("DPI Impact Seeding Error:", error.message);
  }
};

module.exports = seedDPIImpactData;