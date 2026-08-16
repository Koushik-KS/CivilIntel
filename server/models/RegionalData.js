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

    population: {
      type: Number,
      required: true,
    },

    infrastructureIndex: {
      type: Number,
      min: 0,
      max: 100,
      required: true,
    },

    publicInvestment: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("RegionalData", regionalDataSchema);