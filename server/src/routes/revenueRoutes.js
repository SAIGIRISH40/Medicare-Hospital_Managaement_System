const express = require("express");
const router = express.Router();

const revenueController = require("../controllers/revenueController");

const {
  verifyToken,
} = require("../middleware/authMiddleware");

const {
  allowRoles,
} = require("../middleware/roleMiddleware");

// GET REVENUE REPORT
router.get(
  "/",
  verifyToken,
  allowRoles("admin"),
  revenueController.getRevenueReport
);

module.exports = router;