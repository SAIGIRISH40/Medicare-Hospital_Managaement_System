const express = require("express");
const router = express.Router();

const patientController = require("../controllers/patientController");
const { verifyToken } = require("../middleware/authMiddleware");
const { allowRoles } = require("../middleware/roleMiddleware");

// Create patient → admin, reception
router.post(
  "/",
  verifyToken,
  allowRoles("admin", "reception"),
  patientController.createPatient
);

// Get patients → doctor, admin, reception
router.get(
  "/",
  verifyToken,
  allowRoles("admin", "doctor", "reception"),
  patientController.getAllPatients
);

// Update patient → admin, reception
router.put(
  "/:id",
  verifyToken,
  allowRoles("admin", "reception"),
  patientController.updatePatient
);

module.exports = router;