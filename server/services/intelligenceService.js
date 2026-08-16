const analyzeRequest = (message) => {
  const text = message.toLowerCase();

  let category = "Other";
  let priority = "Medium";

  // WATER
  const waterKeywords = [
    "water",
    "drinking water",
    "ಕುಡಿಯುವ ನೀರು",
    "ನೀರು",
    "ನೀರಿನ ಸಮಸ್ಯೆ",
  ];

  // ROAD
  const roadKeywords = [
    "road",
    "roads",
    "pothole",
    "bridge",
    "ರಸ್ತೆ",
    "ಗುಂಡಿ",
  ];

  // HEALTHCARE
  const healthcareKeywords = [
    "hospital",
    "doctor",
    "health",
    "healthcare",
    "clinic",
    "ಆಸ್ಪತ್ರೆ",
    "ವೈದ್ಯ",
    "ಆರೋಗ್ಯ",
  ];

  // AGRICULTURE
  const agricultureKeywords = [
    "farmer",
    "crop",
    "irrigation",
    "agriculture",
    "fertilizer",
    "ರೈತ",
    "ಬೆಳೆ",
    "ಕೃಷಿ",
    "ನೀರಾವರಿ",
  ];

  // EDUCATION
  const educationKeywords = [
    "school",
    "college",
    "teacher",
    "education",
    "ಶಾಲೆ",
    "ಕಾಲೇಜು",
    "ಶಿಕ್ಷಣ",
  ];

  // ELECTRICITY
  const electricityKeywords = [
    "electricity",
    "power",
    "current",
    "transformer",
    "ವಿದ್ಯುತ್",
    "ಕರೆಂಟ್",
  ];

  // SANITATION
  const sanitationKeywords = [
    "garbage",
    "drainage",
    "waste",
    "sewage",
    "cleaning",
    "ಕಸ",
    "ಚರಂಡಿ",
    "ತ್ಯಾಜ್ಯ",
  ];

  const categories = [
    { name: "Water", keywords: waterKeywords },
    { name: "Road", keywords: roadKeywords },
    { name: "Healthcare", keywords: healthcareKeywords },
    { name: "Agriculture", keywords: agricultureKeywords },
    { name: "Education", keywords: educationKeywords },
    { name: "Electricity", keywords: electricityKeywords },
    { name: "Sanitation", keywords: sanitationKeywords },
  ];

  // Detect category
  for (const item of categories) {
    if (item.keywords.some((keyword) => text.includes(keyword))) {
      category = item.name;
      break;
    }
  }

  // Detect priority
  const criticalKeywords = [
    "emergency",
    "urgent",
    "danger",
    "life threatening",
    "severe",
    "ತುರ್ತು",
    "ಅಪಾಯಕಾರಿ",
    "ಗಂಭೀರ",
  ];

  const highKeywords = [
    "many people",
    "serious problem",
    "no water",
    "completely damaged",
    "very bad",
    "ತುಂಬಾ ಜನ",
    "ತೀವ್ರ ಸಮಸ್ಯೆ",
    "ನೀರು ಇಲ್ಲ",
  ];

  if (
    criticalKeywords.some((keyword) => text.includes(keyword))
  ) {
    priority = "Critical";
  } else if (
    highKeywords.some((keyword) => text.includes(keyword))
  ) {
    priority = "High";
  }

  return {
    category,
    priority,
  };
};

module.exports = {
  analyzeRequest,
};