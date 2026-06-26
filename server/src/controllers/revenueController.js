const revenueService = require("../services/revenueService");

// GET REVENUE REPORT
const getRevenueReport = async (req, res) => {
  try {
    const { filter } = req.query;

    const data =
      await revenueService.getRevenueData(filter);

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

module.exports = {
  getRevenueReport,
};