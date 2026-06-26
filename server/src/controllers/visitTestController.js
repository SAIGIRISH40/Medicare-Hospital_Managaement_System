const visitTestService = require("../services/visitTestService");

// 1️ Add Test to Visit
const addTest = async (req, res) => {
  try {
    const result = await visitTestService.addTestToVisit(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  addTest,
};