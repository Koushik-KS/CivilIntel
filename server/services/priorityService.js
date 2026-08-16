const getProjectRecommendation = (category) => {
  const recommendations = {
    Water: "Prioritize Drinking Water Infrastructure Project",
    Road: "Prioritize Road Repair and Connectivity Project",
    Healthcare: "Prioritize Healthcare Facility Development Project",
    Agriculture: "Prioritize Agricultural Irrigation and Farmer Support Project",
    Education: "Prioritize School and Educational Infrastructure Project",
    Electricity: "Prioritize Electricity and Power Infrastructure Project",
    Sanitation: "Prioritize Sanitation and Waste Management Project",
    Other: "Conduct Detailed Regional Development Assessment",
  };

  return recommendations[category] || recommendations.Other;
};

const calculatePriorityScore = ({
  requestCount = 0,
  criticalCount = 0,
  highCount = 0,

  // Demographic data
  population = 0,
  populationDensity = 0,
  ruralPopulation = 0,
  urbanPopulation = 0,

  // Infrastructure data
  infrastructureIndex = 100,
  infrastructure = {},

  // Investment data
  publicInvestment = 0,
}) => {
  // 1. Citizen demand - maximum 30 points
  const demandScore = Math.min(requestCount * 3, 30);

  // 2. Urgency - maximum 15 points
  const urgencyScore = Math.min(
    criticalCount * 5 + highCount * 2,
    15
  );

  // 3. Overall infrastructure gap - maximum 20 points
  const infrastructureGapScore = Math.max(
    0,
    Math.min(
      ((100 - infrastructureIndex) / 100) * 20,
      20
    )
  );

  // 4. Population impact - maximum 15 points
  const populationScore = Math.min(
    (population / 300000) * 15,
    15
  );

  // 5. Population density impact - maximum 5 points
  const populationDensityScore = Math.min(
    (populationDensity / 5000) * 5,
    5
  );

  // 6. Rural / urban population impact - maximum 5 points
  const totalPopulation = ruralPopulation + urbanPopulation;

  const populationDistributionScore =
    totalPopulation > 0
      ? Math.min(
          (Math.max(ruralPopulation, urbanPopulation) /
            totalPopulation) *
            5,
          5
        )
      : 0;

  // 7. Detailed infrastructure gap - maximum 5 points
  const infrastructureValues = [
    infrastructure.roads || 0,
    infrastructure.healthcare || 0,
    infrastructure.education || 0,
    infrastructure.water || 0,
    infrastructure.electricity || 0,
  ];

  const averageInfrastructure =
    infrastructureValues.reduce(
      (sum, value) => sum + value,
      0
    ) / infrastructureValues.length;

  const detailedInfrastructureGapScore = Math.max(
    0,
    Math.min(
      ((100 - averageInfrastructure) / 100) * 5,
      5
    )
  );

  // 8. Public investment gap - maximum 5 points
  const investmentGapScore = Math.max(
    0,
    Math.min(
      5 - publicInvestment / 1000000,
      5
    )
  );

  // Final score
  const totalScore = Math.min(
    Math.round(
      demandScore +
        urgencyScore +
        infrastructureGapScore +
        populationScore +
        populationDensityScore +
        populationDistributionScore +
        detailedInfrastructureGapScore +
        investmentGapScore
    ),
    100
  );

  let level = "Low";

  if (totalScore >= 80) {
    level = "Critical";
  } else if (totalScore >= 60) {
    level = "High";
  } else if (totalScore >= 35) {
    level = "Medium";
  }

  return {
    totalScore,
    level,

    breakdown: {
      citizenDemand: Math.round(demandScore),
      urgency: Math.round(urgencyScore),
      infrastructureGap: Math.round(
        infrastructureGapScore
      ),
      populationImpact: Math.round(populationScore),
      populationDensity: Math.round(
        populationDensityScore
      ),
      populationDistribution: Math.round(
        populationDistributionScore
      ),
      detailedInfrastructureGap: Math.round(
        detailedInfrastructureGapScore
      ),
      investmentGap: Math.round(investmentGapScore),
    },
  };
};

module.exports = {
  calculatePriorityScore,
  getProjectRecommendation,
};