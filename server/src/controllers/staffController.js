const staffService = require("../services/staffService");

// GET ALL STAFF
const getAllStaff = async (req, res) => {
  try {
    const staff = await staffService.getAllStaff();

    res.status(200).json(staff);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// DEACTIVATE STAFF
const deactivateStaff = async (req, res) => {
  try {
    const { id } = req.params;

    const staff =
      await staffService.deactivateStaff(id);

    res.status(200).json(staff);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

module.exports = {
  getAllStaff,
  deactivateStaff,
};