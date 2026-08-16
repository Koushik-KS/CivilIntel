const mongoose = require("mongoose");

const developmentRequestSchema = new mongoose.Schema(
  {
    citizenName: {
      type: String,
      trim: true,
      default: "Anonymous Citizen",
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    language: {
      type: String,
      default: "en",
    },

    category: {
      type: String,
      enum: [
        "Road",
        "Water",
        "Healthcare",
        "Agriculture",
        "Education",
        "Electricity",
        "Sanitation",
        "Other",
      ],
      default: "Other",
    },

    location: {
      country: {
        type: String,
        default: "India",
      },
      state: String,
      district: String,
      latitude: Number,
      longitude: Number,
    },

    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Critical"],
      default: "Medium",
    },

    status: {
      type: String,
      enum: ["New", "Under Review", "Planned", "In Progress", "Completed"],
      default: "New",
    },

    source: {
      type: String,
      enum: ["Text", "Voice", "Messaging"],
      default: "Text",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "DevelopmentRequest",
  developmentRequestSchema
);