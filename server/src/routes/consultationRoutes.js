const express = require("express");
const router = express.Router();

const consultationController = require(
  "../controllers/consultationController"
);


const {
  verifyToken,
} = require("../middleware/authMiddleware");

const {
  allowRoles,
} = require("../middleware/roleMiddleware");


// =========================
// SAVE CONSULTATION
// =========================
router.post(
  "/save",
  verifyToken,
  allowRoles("doctor"),
  consultationController.saveConsultation
);

router.post(
  "/complete",
  verifyToken,
  allowRoles("doctor"),
  consultationController.completeConsultation
);
module.exports = router;