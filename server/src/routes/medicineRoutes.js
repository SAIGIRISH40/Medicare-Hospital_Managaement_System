const express = require("express");
const router = express.Router();

const medicineController = require("../controllers/medicineController");
const { verifyToken } = require("../middleware/authMiddleware");
const { allowRoles } = require("../middleware/roleMiddleware");

// CREATE MEDICINE
router.post(
  "/",
  verifyToken,
  allowRoles("doctor"),
  medicineController.createMedicine
);

// GET ALL
router.get(
  "/",
  verifyToken,
  allowRoles("admin", "doctor", "reception"),
  medicineController.getAllMedicines
);

// GET BY ID
router.get(
  "/:id",
  verifyToken,
  allowRoles("admin", "doctor", "reception"),
  medicineController.getMedicineById
);

// UPDATE
router.put(
  "/:id",
  verifyToken,
  allowRoles("admin","doctor"),
  medicineController.updateMedicine
);

// DELETE
router.delete(
  "/:id",
  verifyToken,
  allowRoles("admin"),
  medicineController.deleteMedicine
);
router.get(
  "/low-stock",
   verifyToken,
   allowRoles("admin","doctor"),
   medicineController.getLowStockMedicines
  );

module.exports = router;