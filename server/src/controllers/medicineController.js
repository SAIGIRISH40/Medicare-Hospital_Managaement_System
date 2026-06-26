const medicineService = require("../services/medicineService");

// CREATE MEDICINE
const createMedicine = async (req, res) => {
  try {
    const result = await medicineService.createMedicine(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// GET ALL
const getAllMedicines = async (req, res) => {
  try {
    const { search } = req.query;

    const result =
      await medicineService.getAllMedicines(search);

    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// GET BY ID
const getMedicineById = async (req, res) => {
  try {
    const result = await medicineService.getMedicineById(req.params.id);

    if (!result) {
      return res.status(404).json({ message: "Medicine not found" });
    }

    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// UPDATE
const updateMedicine = async (req, res) => {
  try {
    const result = await medicineService.updateMedicine(
      req.params.id,
      req.body
    );

    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE
const deleteMedicine = async (req, res) => {
  try {
    const result = await medicineService.deleteMedicine(req.params.id);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getLowStockMedicines = async (req, res) => {
  try {
    const data = await medicineService.getLowStockMedicines();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createMedicine,
  getAllMedicines,
  getMedicineById,
  updateMedicine,
  deleteMedicine,
  getLowStockMedicines
};