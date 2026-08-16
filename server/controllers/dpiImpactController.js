const DPIImpact = require("../models/DPIImpact");

// Calculate impact score
const calculateImpact = (impact) => {
  const beforeRequests = impact.beforeMetrics.citizenRequests || 0;
  const afterRequests = impact.afterMetrics.citizenRequests || 0;

  const beforeCritical = impact.beforeMetrics.criticalIssues || 0;
  const afterCritical = impact.afterMetrics.criticalIssues || 0;

  const beforeInfrastructure =
    impact.beforeMetrics.infrastructureIndex || 0;

  const afterInfrastructure =
    impact.afterMetrics.infrastructureIndex || 0;

  // Reduction in citizen requests
  const requestReduction =
    beforeRequests > 0
      ? ((beforeRequests - afterRequests) / beforeRequests) * 100
      : 0;

  // Reduction in critical issues
  const criticalReduction =
    beforeCritical > 0
      ? ((beforeCritical - afterCritical) / beforeCritical) * 100
      : 0;

  // Improvement in infrastructure
  const infrastructureImprovement =
    afterInfrastructure - beforeInfrastructure;

  // Final impact score
  const impactScore = Math.max(
    0,
    Math.min(
      100,
      Math.round(
        requestReduction * 0.35 +
          criticalReduction * 0.35 +
          infrastructureImprovement * 0.3
      )
    )
  );

  let impactLevel = "Low";

  if (impactScore >= 80) {
    impactLevel = "Excellent";
  } else if (impactScore >= 60) {
    impactLevel = "High";
  } else if (impactScore >= 35) {
    impactLevel = "Medium";
  }

  return {
    impactScore,
    impactLevel,
    requestReduction: Math.round(requestReduction),
    criticalReduction: Math.round(criticalReduction),
    infrastructureImprovement: Math.round(
      infrastructureImprovement
    ),
  };
};

// Create DPI impact record
const createDPIImpact = async (req, res) => {
  try {
    const dpiImpact = await DPIImpact.create(req.body);

    res.status(201).json({
      success: true,
      message: "DPI impact record created successfully.",
      data: dpiImpact,
      impact: calculateImpact(dpiImpact),
    });
  } catch (error) {
    console.error("Create DPI Impact Error:", error);

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all DPI impact records
const getDPIImpacts = async (req, res) => {
  try {
    const impacts = await DPIImpact.find().sort({
      createdAt: -1,
    });

    const data = impacts.map((impact) => ({
      ...impact.toObject(),
      impact: calculateImpact(impact),
    }));

    res.status(200).json({
      success: true,
      count: data.length,
      data,
    });
  } catch (error) {
    console.error("Get DPI Impacts Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get one DPI impact record
const getDPIImpactById = async (req, res) => {
  try {
    const impact = await DPIImpact.findById(req.params.id);

    if (!impact) {
      return res.status(404).json({
        success: false,
        message: "DPI impact record not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        ...impact.toObject(),
        impact: calculateImpact(impact),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createDPIImpact,
  getDPIImpacts,
  getDPIImpactById,
};