const DevelopmentRequest = require("../models/DevelopmentRequest");

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

module.exports = {
  getHotspots,
};