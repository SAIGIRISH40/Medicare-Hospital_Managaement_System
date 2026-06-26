const visitService = require("../services/visitService");

// 1️⃣ Create Visit
const createVisit = async (req, res) => {
  try {
    const visit = await visitService.createVisit(req.body);
    res.status(201).json(visit);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 2️⃣ Get All Visits
const getAllVisits = async (req, res) => {
  try {
    const visits = await visitService.getAllVisits();
    res.status(200).json(visits);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getDoctorVisits = async (req, res) => {
  try {
   const user_id = req.user.user_id;
    const { filter, date } = req.query;

    const visits = await visitService.getVisitsByDoctor(
      user_id,
      { filter, date }
    );

    res.json(visits);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// 3️⃣ Get Visit by ID
const getVisitById = async (req, res) => {
  try {
    const { id } = req.params;
    const visit = await visitService.getVisitById(id);

    if (!visit) {
      return res.status(404).json({ message: "Visit not found" });
    }

    res.status(200).json(visit);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 4️⃣ Update Visit (Doctor updates)
const updateVisit = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedVisit = await visitService.updateVisit(id, req.body);

    if (!updatedVisit) {
      return res.status(404).json({ message: "Visit not found" });
    }

    res.status(200).json(updatedVisit);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 5️⃣ Delete Visit
const deleteVisit = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await visitService.deleteVisit(id);

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 4️⃣ GET PATIENT HISTORY
const getPatientHistory = async (req, res) => {
  try {
    const { visitId } = req.params;

    const history =
      await visitService.getPatientHistory(visitId);

    res.status(200).json(history);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// GET ALL PATIENTS OF DOCTOR
const getAllPatientsByDoctor = async (req, res) => {
  try {
    const user_id = req.user.user_id;

    const patients =
      await visitService.getAllPatientsByDoctor(
        user_id
      );

    res.status(200).json(patients);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

const getVisitDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const details =
      await visitService.getVisitDetails(id);

    res.status(200).json(details);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

module.exports = {
  createVisit,
  getAllVisits,
  getVisitById,
  getDoctorVisits,
  getPatientHistory,
  updateVisit,
  getAllPatientsByDoctor,
  deleteVisit,
  getVisitDetails 
};