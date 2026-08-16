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
  requestCount,
  criticalCount,
  highCount,
  population,
  infrastructureIndex,
  publicInvestment,
}) => {
  // 1. Citizen demand score - maximum 40 points
  const demandScore = Math.min(requestCount * 4, 40);

  // Extra weight for urgent citizen needs
  const urgencyBonus = Math.min(
    criticalCount * 5 + highCount * 2,
    10
  );

  // 2. Infrastructure gap - maximum 30 points
  const infrastructureGapScore =
    ((100 - infrastructureIndex) / 100) * 30;

  // 3. Population impact - maximum 20 points
  // MVP normalization: 300,000 population = maximum impact
  const populationScore = Math.min(
    (population / 300000) * 20,
    20
  );

  // 4. Investment gap - maximum 10 points
  // MVP normalization: lower investment means higher gap
  const investmentScore = Math.max(
    0,
    Math.min(10, 10 - publicInvestment / 2000000)
  );

  const totalScore = Math.min(
    Math.round(
      demandScore +
        urgencyBonus +
        infrastructureGapScore +
        populationScore +
        investmentScore
    ),
    100
  );

  let level = "Low";

  if (totalScore >= 80) level = "Critical";
  else if (totalScore >= 60) level = "High";
  else if (totalScore >= 35) level = "Medium";

  return {
    totalScore,
    level,
    breakdown: {
      citizenDemand: Math.round(demandScore),
      urgency: Math.round(urgencyBonus),
      infrastructureGap: Math.round(infrastructureGapScore),
      populationImpact: Math.round(populationScore),
      investmentGap: Math.round(investmentScore),
    },
  };
};

module.exports = {
  calculatePriorityScore,
  getProjectRecommendation,
};