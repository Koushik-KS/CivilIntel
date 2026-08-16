const DevelopmentRequest = require("../models/DevelopmentRequest");
const RegionalData = require("../models/RegionalData");

const {
  calculatePriorityScore,
  getProjectRecommendation,
} = require("../services/priorityService");

// Get demand hotspots
const getHotspots = async (req, res) => {
  try {
    const hotspots = await DevelopmentRequest.aggregate([
      {
        $group: {
          _id: {
            district: "$location.district",
            state: "$location.state",
            category: "$category",
          },
          requestCount: { $sum: 1 },
          criticalCount: {
            $sum: {
              $cond: [{ $eq: ["$priority", "Critical"] }, 1, 0],
            },
          },
          highCount: {
            $sum: {
              $cond: [{ $eq: ["$priority", "High"] }, 1, 0],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          district: "$_id.district",
          state: "$_id.state",
          category: "$_id.category",
          requestCount: 1,
          criticalCount: 1,
          highCount: 1,
        },
      },
      {
        $sort: {
          requestCount: -1,
          criticalCount: -1,
          highCount: -1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      count: hotspots.length,
      data: hotspots,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get complete priority recommendations
const getPriorityRecommendations = async (req, res) => {
  try {
    // Get citizen demand grouped by district + category
    const hotspots = await DevelopmentRequest.aggregate([
      {
        $group: {
          _id: {
            district: "$location.district",
            state: "$location.state",
            category: "$category",
          },
          requestCount: { $sum: 1 },
          criticalCount: {
            $sum: {
              $cond: [{ $eq: ["$priority", "Critical"] }, 1, 0],
            },
          },
          highCount: {
            $sum: {
              $cond: [{ $eq: ["$priority", "High"] }, 1, 0],
            },
          },
        },
      },
    ]);

    const recommendations = [];

    for (const hotspot of hotspots) {
      const { district, state, category } = hotspot._id;

      // Find matching regional data
      const regionalData = await RegionalData.findOne({
        district,
        state,
      });

      // Skip if no external regional data exists
      if (!regionalData) continue;

      // Calculate transparent priority score
      const priorityResult = calculatePriorityScore({
        requestCount: hotspot.requestCount,
        criticalCount: hotspot.criticalCount,
        highCount: hotspot.highCount,
        population: regionalData.population,
        infrastructureIndex: regionalData.infrastructureIndex,
        publicInvestment: regionalData.publicInvestment,
      });

      recommendations.push({
        country: regionalData.country,
        state,
        district,
        category,

        citizenDemand: {
          requestCount: hotspot.requestCount,
          criticalCount: hotspot.criticalCount,
          highCount: hotspot.highCount,
        },

        regionalContext: {
          population: regionalData.population,
          infrastructureIndex: regionalData.infrastructureIndex,
          publicInvestment: regionalData.publicInvestment,
        },

        priority: priorityResult,

        recommendedProject: getProjectRecommendation(category),
      });
    }

    // Highest-priority projects first
    recommendations.sort(
      (a, b) => b.priority.totalScore - a.priority.totalScore
    );

    res.status(200).json({
      success: true,
      count: recommendations.length,
      data: recommendations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getHotspots,
  getPriorityRecommendations,
};