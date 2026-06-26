const express = require("express");
const router = express.Router();

const doctorController = require("../controllers/doctorController");
const { verifyToken } = require("../middleware/authMiddleware");
const { allowRoles } = require("../middleware/roleMiddleware");

// Admin manages doctors
router.post(
  "/",
  verifyToken,
  allowRoles("admin"),
  doctorController.createDoctor
);

router.get(
  "/",
  verifyToken,
  allowRoles("admin", "reception"),
  doctorController.getAllDoctors
);

router.get(
  "/:id",
  verifyToken,
  allowRoles("admin", "doctor","reception"),
  doctorController.getDoctorById
);

router.put(
  "/:id",
  verifyToken,
  allowRoles("admin"),
  doctorController.updateDoctor
);

router.delete(
  "/:id",
  verifyToken,
  allowRoles("admin"),
  doctorController.deleteDoctor
);

module.exports = router;