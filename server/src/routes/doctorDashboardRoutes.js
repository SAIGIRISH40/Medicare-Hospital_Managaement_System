const express = require("express");

const router = express.Router();

const dashboardController = require(
  "../controllers/doctorDashboardController"
);

const {
  verifyToken,
} = require("../middleware/authMiddleware");

const {
  allowRoles,
} = require("../middleware/roleMiddleware");

router.get(
  "/",
  verifyToken,
  allowRoles("doctor"),
  dashboardController.getDoctorDashboard
);

module.exports = router;