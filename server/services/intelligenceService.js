const analyzeRequest = (message) => {
  const text = (message || "").toLowerCase();

  let category = "Other";
  let priority = "Medium";

  const categories = [
    {
      name: "Water",
      keywords: [
        "water",
        "drinking water",
        "water shortage",
        "no water",
        "ಕುಡಿಯುವ ನೀರು",
        "ನೀರು",
        "ನೀರಿನ ಸಮಸ್ಯೆ",
        "पानी",
        "पीने का पानी",
        "पानी की समस्या",
        "पानी नहीं",
      ],
    },

    {
      name: "Road",
      keywords: [
        "road",
        "roads",
        "pothole",
        "bridge",
        "damaged road",
        "ರಸ್ತೆ",
        "ಗುಂಡಿ",
        "ಹಾಳಾದ ರಸ್ತೆ",
        "सड़क",
        "गड्ढा",
        "पुल",
        "खराब सड़क",
      ],
    },

    {
      name: "Healthcare",
      keywords: [
        "hospital",
        "doctor",
        "health",
        "healthcare",
        "clinic",
        "medical",
        "medicine",
        "ಆಸ್ಪತ್ರೆ",
        "ವೈದ್ಯ",
        "ಆರೋಗ್ಯ",
        "ಚಿಕಿತ್ಸೆ",
        "अस्पताल",
        "डॉक्टर",
        "स्वास्थ्य",
        "चिकित्सा",
        "दवा",
      ],
    },

    {
      name: "Agriculture",
      keywords: [
        "farmer",
        "crop",
        "irrigation",
        "agriculture",
        "fertilizer",
        "farming",
        "ರೈತ",
        "ಬೆಳೆ",
        "ಕೃಷಿ",
        "ನೀರಾವರಿ",
        "ರಸಗೊಬ್ಬರ",
        "किसान",
        "फसल",
        "कृषि",
        "सिंचाई",
        "उर्वरक",
      ],
    },

    {
      name: "Education",
      keywords: [
        "school",
        "college",
        "teacher",
        "education",
        "students",
        "classroom",
        "ಶಾಲೆ",
        "ಕಾಲೇಜು",
        "ಶಿಕ್ಷಣ",
        "ಶಿಕ್ಷಕ",
        "ವಿದ್ಯಾರ್ಥಿ",
        "स्कूल",
        "कॉलेज",
        "शिक्षा",
        "शिक्षक",
        "छात्र",
      ],
    },

    {
      name: "Electricity",
      keywords: [
        "electricity",
        "power",
        "current",
        "transformer",
        "power cut",
        "electricity problem",
        "ವಿದ್ಯುತ್",
        "ಕರೆಂಟ್",
        "ವಿದ್ಯುತ್ ಸಮಸ್ಯೆ",
        "करंट",
        "बिजली",
        "बिजली की समस्या",
        "पावर कट",
        "ट्रांसफार्मर",
      ],
    },

    {
      name: "Sanitation",
      keywords: [
        "garbage",
        "drainage",
        "waste",
        "sewage",
        "cleaning",
        "dirty",
        "ಕಸ",
        "ಚರಂಡಿ",
        "ತ್ಯಾಜ್ಯ",
        "ಸ್ವಚ್ಛತೆ",
        "कचरा",
        "नाली",
        "सीवेज",
        "सफाई",
        "गंदगी",
      ],
    },
  ];

  // Find the category with the most matching keywords
  let highestMatches = 0;

  for (const item of categories) {
    const matches = item.keywords.filter((keyword) =>
      text.includes(keyword.toLowerCase())
    ).length;

    if (matches > highestMatches) {
      highestMatches = matches;
      category = item.name;
    }
  }

  // Critical priority keywords
  const criticalKeywords = [
    "emergency",
    "urgent",
    "danger",
    "life threatening",
    "severe",
    "critical",
    "death",
    "accident",

    "ತುರ್ತು",
    "ಅಪಾಯಕಾರಿ",
    "ಗಂಭೀರ",
    "ಜೀವ ಅಪಾಯ",

    "आपातकाल",
    "तुरंत",
    "खतरनाक",
    "गंभीर",
    "जान का खतरा",
  ];

  // High priority keywords
  const highKeywords = [
    "many people",
    "serious problem",
    "no water",
    "completely damaged",
    "very bad",
    "major problem",
    "large number",

    "ತುಂಬಾ ಜನ",
    "ತೀವ್ರ ಸಮಸ್ಯೆ",
    "ನೀರು ಇಲ್ಲ",
    "ತುಂಬಾ ಕೆಟ್ಟ",

    "बहुत लोग",
    "गंभीर समस्या",
    "पानी नहीं",
    "बहुत खराब",
    "बड़ी समस्या",
  ];

  if (
    criticalKeywords.some((keyword) =>
      text.includes(keyword.toLowerCase())
    )
  ) {
    priority = "Critical";
  } else if (
    highKeywords.some((keyword) =>
      text.includes(keyword.toLowerCase())
    )
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