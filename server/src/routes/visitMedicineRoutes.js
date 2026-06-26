const express = require("express");
const router = express.Router();

const visitMedicineController = require("../controllers/visitMedicineController");

const { verifyToken } = require("../middleware/authMiddleware");
const { allowRoles } = require("../middleware/roleMiddleware");


// =========================
// ADD MEDICINE TO VISIT
// =========================
router.post(
  "/",
  verifyToken,
  allowRoles("doctor"),
  visitMedicineController.addMedicine
);


// =========================
// GET MEDICINES OF VISIT
// =========================
/*router.get(
  "/:visit_id",
  verifyToken,
  allowRoles("doctor", "admin", "reception"),
  visitMedicineController.getVisitMedicines
);

// =========================
// DELETE MEDICINE FROM VISIT (optional)
// =========================
router.delete(
  "/:id",
  verifyToken,
  allowRoles("doctor"),
  visitMedicineController.removeMedicineFromVisit
);
*/
module.exports = router;