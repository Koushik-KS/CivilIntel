const mongoose = require("mongoose");

const dpiImpactSchema = new mongoose.Schema(
  {
    country: {
      type: String,
      required: true,
    },

    state: {
      type: String,
      required: true,
    },

    district: {
      type: String,
      required: true,
    },

    projectName: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["Planned", "In Progress", "Completed"],
      default: "Planned",
    },

    // Situation before DPI/project implementation
    beforeMetrics: {
      citizenRequests: {
        type: Number,
        default: 0,
      },

      criticalIssues: {
        type: Number,
        default: 0,
      },

      infrastructureIndex: {
        type: Number,
        min: 0,
        max: 100,
        default: 0,
      },
    },

    // Situation after DPI/project implementation
    afterMetrics: {
      citizenRequests: {
        type: Number,
        default: 0,
      },

      criticalIssues: {
        type: Number,
        default: 0,
      },

      infrastructureIndex: {
        type: Number,
        min: 0,
        max: 100,
        default: 0,
      },
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

module.exports = mongoose.model("DPIImpact", dpiImpactSchema);