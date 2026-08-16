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

      const regionalData = await RegionalData.findOne({
        district,
        state,
      });

      if (!regionalData) continue;

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

// Get dashboard statistics
const getDashboardStats = async (req, res) => {
  try {
    // Total citizen requests
    const totalRequests =
      await DevelopmentRequest.countDocuments();

    // Critical citizen issues
    const criticalIssues =
      await DevelopmentRequest.countDocuments({
        priority: "Critical",
      });

    // High priority citizen issues
    const highPriorityProjects =
      await DevelopmentRequest.countDocuments({
        priority: "High",
      });

    // Unique districts with citizen requests
    const hotspots =
      await DevelopmentRequest.distinct("location.district");

    // Category-wise demand
    const categoryDemand =
      await DevelopmentRequest.aggregate([
        {
          $group: {
            _id: "$category",
            count: { $sum: 1 },
          },
        },
        {
          $sort: {
            count: -1,
          },
        },
      ]);

    res.status(200).json({
      success: true,
      data: {
        totalRequests,
        activeHotspots: hotspots.length,
        criticalIssues,
        highPriorityProjects,
        categoryDemand,
      },
    });
  } catch (error) {
    console.error("Dashboard Stats Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getHotspots,
  getPriorityRecommendations,
  getDashboardStats,
};