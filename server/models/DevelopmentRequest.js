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

    // Language selected by citizen
    language: {
      type: String,
      default: "en",
    },

    // Language detected by CivilIntel AI
    detectedLanguage: {
      type: String,
      default: "en",
    },

    // AI detected development category
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

    // Citizen location
    location: {
      country: {
        type: String,
        default: "India",
      },

      state: {
        type: String,
        default: "",
      },

      district: {
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

    // AI calculated priority
    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Critical"],
      default: "Medium",
    },

    // AI urgency score: 0 to 100
    urgencyScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    // AI confidence score: 0 to 100
    confidenceScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    // Keywords/signals detected by AI
    detectedSignals: {
      type: [String],
      default: [],
    },

    // Request lifecycle status
    status: {
      type: String,
      enum: [
        "New",
        "Under Review",
        "Planned",
        "In Progress",
        "Completed",
      ],
      default: "New",
    },

    // How the citizen submitted the request
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

// Create and export the actual Mongoose model
const DevelopmentRequest = mongoose.model(
  "DevelopmentRequest",
  developmentRequestSchema
);

module.exports = DevelopmentRequest;