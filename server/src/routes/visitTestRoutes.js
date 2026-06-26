const express = require("express");
const router = express.Router();

const visitTestController = require("../controllers/visitTestController");

const { verifyToken } = require("../middleware/authMiddleware");
const { allowRoles } = require("../middleware/roleMiddleware");


// =========================
// ADD TEST TO VISIT
// =========================
router.post(
  "/",
  verifyToken,
  allowRoles("doctor"),
  visitTestController.addTest
);

/*
router.get(
  "/:visit_id",
  verifyToken,
  allowRoles("doctor", "admin", "reception"),
  visitTestController.getVisitTests
);


router.delete(
  "/:id",
  verifyToken,
  allowRoles("doctor"),
  visitTestController.removeTestFromVisit
);
*/
module.exports = router;