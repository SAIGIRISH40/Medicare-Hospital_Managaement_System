const express = require("express");
const router = express.Router();

const billingController = require("../controllers/billingController");
const { verifyToken } = require("../middleware/authMiddleware");
const { allowRoles } = require("../middleware/roleMiddleware");

// Calculate bill
router.post(
  "/",
  verifyToken,
  allowRoles("admin", "reception"),
  billingController.calculateBill
);

router.get(
  "/visits",
  verifyToken,
  allowRoles("admin", "reception"),
  billingController.getBillingVisits
);

router.put(
  "/pay/:visit_id",
  verifyToken,
  allowRoles("admin", "reception"),
  billingController.markBillPaid
);

// Get billing details for a visit
router.get(
  "/details/:visit_id",
  verifyToken,
  allowRoles("admin", "reception"),
  billingController.getBillingDetails
);



module.exports = router;