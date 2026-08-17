const DevelopmentRequest = require("../models/DevelopmentRequest");
const RegionalData = require("../models/RegionalData");

const {
  calculatePriorityScore,
  getProjectRecommendation,
} = require("../services/priorityService");

// ==========================================
// GET DEMAND HOTSPOTS
// ==========================================
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

// ==========================================
// GET AI PRIORITY RECOMMENDATIONS
// ==========================================
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

      // Skip incomplete location data
      if (!country || !state || !district) {
        continue;
      }

      // Find regional intelligence data
      // Case-insensitive matching:
      // Chikkamagaluru = chikkamagaluru = CHIKKAMAGALURU
      const regionalData = await RegionalData.findOne({
        country: {
          $regex: `^${country.trim()}$`,
          $options: "i",
        },
        state: {
          $regex: `^${state.trim()}$`,
          $options: "i",
        },
        district: {
          $regex: `^${district.trim()}$`,
          $options: "i",
        },
      });

      // Skip regions without intelligence data
      if (!regionalData) {
        console.log(
          `No RegionalData found for: ${country}, ${state}, ${district}`
        );
        continue;
      }

      // Calculate AI priority score
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

        // Public investment data
        publicInvestment: regionalData.publicInvestment,
      });

      recommendations.push({
        country: regionalData.country,
        state: regionalData.state,
        district: regionalData.district,
        category,

        address: regionalData.address,

        citizenDemand: {
          requestCount: hotspot.requestCount,
          criticalCount: hotspot.criticalCount,
          highCount: hotspot.highCount,
        },

        demographicData: {
          population: regionalData.population,
          populationDensity: regionalData.populationDensity,
          ruralPopulation: regionalData.ruralPopulation,
          urbanPopulation: regionalData.urbanPopulation,
        },

        infrastructureData: {
          infrastructureIndex:
            regionalData.infrastructureIndex,

          infrastructure:
            regionalData.infrastructure,
        },

        investmentData: {
          publicInvestment:
            regionalData.publicInvestment,
        },

        priority: priorityResult,

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

// ==========================================
// GET DASHBOARD STATISTICS
// ==========================================
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

// ==========================================
// ANALYZE CITIZEN MESSAGE
// ==========================================
const analyzeMessage = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please provide a development message.",
      });
    }

    const text = message.toLowerCase();

    let category = "General Infrastructure";
    let urgency = "Medium";
    let recommendation =
      "Further regional infrastructure assessment is required.";

    // CATEGORY DETECTION
    if (
      text.includes("water") ||
      text.includes("drainage") ||
      text.includes("flood") ||
      text.includes("flooding") ||
      text.includes("rainfall") ||
      text.includes("water supply")
    ) {
      category = "Water & Drainage";
      recommendation =
        "Develop drainage, flood management, and water infrastructure.";
    } else if (
      text.includes("road") ||
      text.includes("roads") ||
      text.includes("pothole") ||
      text.includes("potholes") ||
      text.includes("street") ||
      text.includes("bridge")
    ) {
      category = "Road Infrastructure";
      recommendation =
        "Repair damaged roads and improve transport infrastructure.";
    } else if (
      text.includes("hospital") ||
      text.includes("health") ||
      text.includes("healthcare") ||
      text.includes("medical") ||
      text.includes("doctor")
    ) {
      category = "Healthcare";
      recommendation =
        "Improve healthcare facilities and medical infrastructure.";
    } else if (
      text.includes("school") ||
      text.includes("education") ||
      text.includes("college") ||
      text.includes("classroom")
    ) {
      category = "Education";
      recommendation =
        "Improve educational facilities and public learning infrastructure.";
    } else if (
      text.includes("electricity") ||
      text.includes("power") ||
      text.includes("power cut") ||
      text.includes("electric")
    ) {
      category = "Electricity";
      recommendation =
        "Improve electricity distribution and power infrastructure.";
    } else if (
      text.includes("internet") ||
      text.includes("network") ||
      text.includes("digital") ||
      text.includes("connectivity") ||
      text.includes("broadband")
    ) {
      category = "Digital Infrastructure";
      recommendation =
        "Improve digital connectivity and public digital infrastructure.";
    } else if (
      text.includes("garbage") ||
      text.includes("waste") ||
      text.includes("pollution") ||
      text.includes("sanitation")
    ) {
      category = "Waste Management";
      recommendation =
        "Strengthen waste collection, sanitation, and environmental infrastructure.";
    }

    // URGENCY DETECTION
    if (
      text.includes("emergency") ||
      text.includes("urgent") ||
      text.includes("danger") ||
      text.includes("severe") ||
      text.includes("immediately") ||
      text.includes("critical") ||
      text.includes("life threatening")
    ) {
      urgency = "Critical";
    } else if (
      text.includes("heavy") ||
      text.includes("damaged") ||
      text.includes("flooding") ||
      text.includes("poor") ||
      text.includes("serious") ||
      text.includes("badly") ||
      text.includes("major")
    ) {
      urgency = "High";
    }

    // LOCATION DETECTION
    let location = "Not identified";

    const locationPatterns = [
      /(?:in|at|near|from)\s+([a-zA-Z\s]+?)(?:\.|,|because|where|and|$)/i,
    ];

    for (const pattern of locationPatterns) {
      const match = message.match(pattern);

      if (match && match[1]) {
        const detectedLocation =
          match[1].trim();

        if (detectedLocation.length > 2) {
          location = detectedLocation;
          break;
        }
      }
    }

    return res.status(200).json({
      success: true,
      message:
        "CivilIntel AI analyzed your development request.",
      data: {
        category,
        urgency,
        location,
        recommendation,
      },
    });
  } catch (error) {
    console.error(
      "Message Analysis Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to analyze the development message.",
    });
  }
};

// ==========================================
// EXPORT CONTROLLERS
// ==========================================
module.exports = {
  getHotspots,
  getPriorityRecommendations,
  getDashboardStats,
  analyzeMessage,
};