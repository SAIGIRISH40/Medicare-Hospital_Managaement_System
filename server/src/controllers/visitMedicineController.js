const visitMedicineService = require("../services/visitMedicineService");

// 1️⃣ Add Medicine to Visit
const addMedicine = async (req, res) => {
  try {
    const result = await visitMedicineService.addMedicineToVisit(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  addMedicine,
};