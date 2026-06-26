const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const { verifyToken } = require("../middleware/authMiddleware");
const { allowRoles } = require("../middleware/roleMiddleware");

// =========================
// 🔓 PUBLIC ROUTES
// =========================

// Login
router.post(
  "/login",
  authController.login
);

// Forgot Password (Send OTP)
router.post(
  "/forgot-password",
  authController.forgotPassword
);

// Reset Password using OTP
router.post(
  "/reset-password",
  authController.resetPassword
);

// First Login Password Setup
router.post(
  "/set-password",
  authController.setFirstPassword
);


// =========================
// 🔐 ADMIN ONLY
// =========================

// Create User
router.post(
  "/create",
  verifyToken,
  allowRoles("admin"),
  authController.createUser
);

// Disable User
router.post(
  "/disable",
  verifyToken,
  allowRoles("admin"),
  authController.disableUser
);

// Enable User
router.post(
  "/enable",
  verifyToken,
  allowRoles("admin"),
  authController.enableUser
);


// =========================
// 🔐 LOGGED-IN USERS
// =========================

// Change Password
router.post(
  "/change-password",
  verifyToken,
  allowRoles("admin", "doctor", "reception"),
  authController.changePassword
);

module.exports = router;