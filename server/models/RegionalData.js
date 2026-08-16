const mongoose = require("mongoose");

const regionalDataSchema = new mongoose.Schema(
  {
    country: {
      type: String,
      required: true,
      default: "India",
    },

    state: {
      type: String,
      required: true,
    },

    district: {
      type: String,
      required: true,
    },

    // Address / location details
    address: {
      city: {
        type: String,
        default: "",
      },

      taluk: {
        type: String,
        default: "",
      },

      village: {
        type: String,
        default: "",
      },

      pincode: {
        type: String,
        default: "",
      },

      latitude: {
        type: Number,
        default: null,
      },

      longitude: {
        type: Number,
        default: null,
      },
    },

    // Demographic data
    population: {
      type: Number,
      required: true,
    },

    populationDensity: {
      type: Number,
      default: 0,
    },

    ruralPopulation: {
      type: Number,
      default: 0,
    },

    urbanPopulation: {
      type: Number,
      default: 0,
    },

    // Infrastructure data
    infrastructureIndex: {
      type: Number,
      min: 0,
      max: 100,
      required: true,
    },

    infrastructure: {
      roads: {
        type: Number,
        default: 0,
      },

      healthcare: {
        type: Number,
        default: 0,
      },

      education: {
        type: Number,
        default: 0,
      },

      water: {
        type: Number,
        default: 0,
      },

      electricity: {
        type: Number,
        default: 0,
      },
    },

    // Public investment data
    publicInvestment: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "RegionalData",
  regionalDataSchema
);