const express = require("express");
const router = express.Router();

const staffController = require("../controllers/staffController");

const {
  verifyToken,
} = require("../middleware/authMiddleware");

const {
  allowRoles,
} = require("../middleware/roleMiddleware");

// GET ALL STAFF
router.get(
  "/",
  verifyToken,
  allowRoles("admin"),
  staffController.getAllStaff
);

// DEACTIVATE STAFF
router.put(
  "/:id/deactivate",
  verifyToken,
  allowRoles("admin"),
  staffController.deactivateStaff
);

module.exports = router;