const express = require("express");
const router = express.Router();

const testController = require("../controllers/testController");
const { verifyToken } = require("../middleware/authMiddleware");
const { allowRoles } = require("../middleware/roleMiddleware");

// CREATE TEST
router.post(
  "/",
  verifyToken,
  allowRoles("doctor","admin"),
  testController.createTest
);

// GET ALL TESTS
router.get(
  "/",
  verifyToken,
  allowRoles("admin", "doctor", "reception"),
  testController.getAllTests
);

// GET TEST BY ID
router.get(
  "/:id",
  verifyToken,
  allowRoles("admin", "doctor", "reception"),
  testController.getTestById
);

// UPDATE TEST
router.put(
  "/:id",
  verifyToken,
  allowRoles("doctor","admin"),
  testController.updateTest
);

// DELETE TEST
router.delete(
  "/:id",
  verifyToken,
  allowRoles("admin"),
  testController.deleteTest
);

module.exports = router;