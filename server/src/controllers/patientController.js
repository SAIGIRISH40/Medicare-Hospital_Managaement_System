const patientService = require("../services/patientService");

// 1️⃣ Create Patient
const createPatient = async (req, res) => {
  try {
    const patient = await patientService.createPatient(req.body);
    res.status(201).json(patient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 2️⃣ Get All Patients
const getAllPatients = async (req, res) => {
  try {
    const patients = await patientService.getAllPatients();
    res.status(200).json(patients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 3️⃣ Get Patient by ID
const getPatientById = async (req, res) => {
  try {
    const { id } = req.params;
    const patient = await patientService.getPatientById(id);

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.status(200).json(patient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 4️⃣ Update Patient
const updatePatient = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedPatient = await patientService.updatePatient(id, req.body);

    if (!updatedPatient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.status(200).json(updatedPatient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 5️⃣ Delete Patient
const deletePatient = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await patientService.deletePatient(id);

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createPatient,
  getAllPatients,
  getPatientById,
  updatePatient,
  deletePatient,
};