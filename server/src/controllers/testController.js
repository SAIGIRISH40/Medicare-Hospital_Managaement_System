const testService = require("../services/testService");

// CREATE TEST
const createTest = async (req, res) => {
  try {
    const result = await testService.createTest(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// GET ALL TESTS
const getAllTests = async (req, res) => {
  try {
    const { search } = req.query;

    const result = await testService.getAllTests(search);

    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// GET TEST BY ID
const getTestById = async (req, res) => {
  try {
    const result = await testService.getTestById(req.params.id);

    if (!result) {
      return res.status(404).json({ message: "Test not found" });
    }

    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// UPDATE TEST
const updateTest = async (req, res) => {
  try {
    const result = await testService.updateTest(
      req.params.id,
      req.body
    );
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE TEST
const deleteTest = async (req, res) => {
  try {
    const result = await testService.deleteTest(req.params.id);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  createTest,
  getAllTests,
  getTestById,
  updateTest,
  deleteTest,
};