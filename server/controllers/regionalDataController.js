const RegionalData = require("../models/RegionalData");

// Create regional data
const createRegionalData = async (req, res) => {
  try {
    const {
      country,
      state,
      district,
      population,
      populationDensity,
      ruralPopulation,
      urbanPopulation,
      infrastructureIndex,
      infrastructure,
      publicInvestment,
    } = req.body;

    // Check if this region already exists
    const existingRegion = await RegionalData.findOne({
      country,
      state,
      district,
    });

    if (existingRegion) {
      return res.status(400).json({
        success: false,
        message: "Regional data already exists for this location.",
      });
    }

    const regionalData = await RegionalData.create({
      country,
      state,
      district,
      population,
      populationDensity,
      ruralPopulation,
      urbanPopulation,
      infrastructureIndex,
      infrastructure,
      publicInvestment,
    });

    res.status(201).json({
      success: true,
      message: "Regional data created successfully.",
      data: regionalData,
    });
  } catch (error) {
    console.error("Create Regional Data Error:", error);

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all regional data
const getRegionalData = async (req, res) => {
  try {
    const regions = await RegionalData.find().sort({
      country: 1,
      state: 1,
      district: 1,
    });

    res.status(200).json({
      success: true,
      count: regions.length,
      data: regions,
    });
  } catch (error) {
    console.error("Get Regional Data Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get one region
const getRegionalDataByLocation = async (req, res) => {
  try {
    const { country, state, district } = req.query;

    const region = await RegionalData.findOne({
      country,
      state,
      district,
    });

    if (!region) {
      return res.status(404).json({
        success: false,
        message: "Regional data not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: region,
    });
  } catch (error) {
    console.error("Get Regional Data Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update regional data
const updateRegionalData = async (req, res) => {
  try {
    const { id } = req.params;

    const regionalData = await RegionalData.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!regionalData) {
      return res.status(404).json({
        success: false,
        message: "Regional data not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Regional data updated successfully.",
      data: regionalData,
    });
  } catch (error) {
    console.error("Update Regional Data Error:", error);

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createRegionalData,
  getRegionalData,
  getRegionalDataByLocation,
  updateRegionalData,
};