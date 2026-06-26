const express = require("express");
const router = express.Router();

const visitController = require("../controllers/visitController");
const { verifyToken } = require("../middleware/authMiddleware");
const { allowRoles } = require("../middleware/roleMiddleware");


// =========================
// 1️⃣ CREATE VISIT (Reception)
// =========================
router.post(
  "/",
  verifyToken,
  allowRoles("reception"),
  visitController.createVisit
);


// =========================
// 2️⃣ GET ALL VISITS (Admin)
// =========================
router.get(
  "/",
  verifyToken,
  allowRoles("admin", "reception"),
  visitController.getAllVisits
);


// =========================
// 3️⃣ GET DOCTOR VISITS
// =========================
router.get(
  "/doctor",
  verifyToken,
  allowRoles("doctor"),
  visitController.getDoctorVisits
);


router.get(
  "/:id/details",
  verifyToken,
  allowRoles("admin"),
  visitController.getVisitDetails
);

// =========================
// 4️⃣ GET PATIENT HISTORY
// =========================
router.get(
  "/:visitId/history",
  verifyToken,
  allowRoles("doctor"),
  visitController.getPatientHistory
);


// GET ALL PATIENTS OF DOCTOR
router.get(
  "/doctor/all-patients",
  verifyToken,
  allowRoles("doctor"),
  visitController.getAllPatientsByDoctor
);

// =========================
// 5️⃣ GET VISIT BY ID
// =========================
router.get(
  "/:id",
  verifyToken,
  allowRoles("admin", "doctor", "reception"),
  visitController.getVisitById
);


// =========================
// 6️⃣ UPDATE VISIT (Doctor)
// =========================
router.put(
  "/:id",
  verifyToken,
  allowRoles("doctor"),
  visitController.updateVisit
);


// =========================
// 7️⃣ DELETE VISIT (Admin)
// =========================
router.delete(
  "/:id",
  verifyToken,
  allowRoles("admin"),
  visitController.deleteVisit
);

module.exports = router;