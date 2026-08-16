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
            country: "$location.country",
            state: "$location.state",
            district: "$location.district",
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
          country: "$_id.country",
          state: "$_id.state",
          district: "$_id.district",
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
    console.error("Hotspots Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get complete AI priority recommendations
const getPriorityRecommendations = async (req, res) => {
  try {
    const hotspots = await DevelopmentRequest.aggregate([
      {
        $group: {
          _id: {
            country: "$location.country",
            state: "$location.state",
            district: "$location.district",
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
      const {
        country,
        state,
        district,
        category,
      } = hotspot._id;

      // Find demographic, infrastructure and investment data
      const regionalData = await RegionalData.findOne({
        country,
        state,
        district,
      });

      // Skip regions without regional intelligence data
      if (!regionalData) continue;

      const priorityResult = calculatePriorityScore({
        // Citizen demand
        requestCount: hotspot.requestCount,
        criticalCount: hotspot.criticalCount,
        highCount: hotspot.highCount,

        // Demographic data
        population: regionalData.population,
        populationDensity: regionalData.populationDensity,
        ruralPopulation: regionalData.ruralPopulation,
        urbanPopulation: regionalData.urbanPopulation,

        // Infrastructure data
        infrastructureIndex: regionalData.infrastructureIndex,
        infrastructure: regionalData.infrastructure,

        // Public investment
        publicInvestment: regionalData.publicInvestment,
      });

      recommendations.push({
        country,
        state,
        district,
        category,

        // Exact regional address
        address: regionalData.address,

        // Citizen demand intelligence
        citizenDemand: {
          requestCount: hotspot.requestCount,
          criticalCount: hotspot.criticalCount,
          highCount: hotspot.highCount,
        },

        // Demographic intelligence
        demographicData: {
          population: regionalData.population,
          populationDensity: regionalData.populationDensity,
          ruralPopulation: regionalData.ruralPopulation,
          urbanPopulation: regionalData.urbanPopulation,
        },

        // Infrastructure intelligence
        infrastructureData: {
          infrastructureIndex:
            regionalData.infrastructureIndex,
          infrastructure:
            regionalData.infrastructure,
        },

        // Government investment intelligence
        investmentData: {
          publicInvestment:
            regionalData.publicInvestment,
        },

        // AI priority result
        priority: priorityResult,

        // Recommended development project
        recommendedProject:
          getProjectRecommendation(category),
      });
    }

    // Highest priority first
    recommendations.sort(
      (a, b) =>
        b.priority.totalScore -
        a.priority.totalScore
    );

    res.status(200).json({
      success: true,
      count: recommendations.length,
      data: recommendations,
    });
  } catch (error) {
    console.error(
      "Priority Recommendations Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get dashboard statistics
const getDashboardStats = async (req, res) => {
  try {
    const totalRequests =
      await DevelopmentRequest.countDocuments();

    const criticalIssues =
      await DevelopmentRequest.countDocuments({
        priority: "Critical",
      });

    const highPriorityProjects =
      await DevelopmentRequest.countDocuments({
        priority: "High",
      });

    // Unique regions with citizen requests
    const hotspotRegions =
      await DevelopmentRequest.aggregate([
        {
          $group: {
            _id: {
              country: "$location.country",
              state: "$location.state",
              district: "$location.district",
            },
          },
        },
      ]);

    // Category-wise citizen demand
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

    // Total regions with intelligence data
    const regionalDataCount =
      await RegionalData.countDocuments();

    res.status(200).json({
      success: true,
      data: {
        totalRequests,
        activeHotspots: hotspotRegions.length,
        criticalIssues,
        highPriorityProjects,
        regionalDataCount,
        categoryDemand,
      },
    });
  } catch (error) {
    console.error(
      "Dashboard Stats Error:",
      error
    );

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