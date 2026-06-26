const authService = require("../services/authService");


// =========================
// 1️⃣ ADMIN CREATE USER
// =========================
const createUser = async (req, res) => {
  try {
    const result = await authService.createUserByAdmin(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


// =========================
// 2️⃣ LOGIN
// =========================
const login = async (req, res) => {
  try {
    const result = await authService.loginUser(req.body);
    res.status(200).json(result);
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
};


// =========================
// 3️⃣ FIRST LOGIN PASSWORD SET
// =========================
const setFirstPassword = async (req, res) => {
  try {
    const { user_id, newPassword } = req.body;

    const result = await authService.setFirstPassword(user_id, newPassword);

    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


// =========================
// 4️⃣ CHANGE PASSWORD
// =========================
const changePassword = async (req, res) => {
  try {
    const user_id = req.user.user_id;   // ✅ FROM TOKEN
    const { oldPassword, newPassword } = req.body;

    console.log("USER ID:", user_id);

    const result = await authService.changePassword(
      user_id,
      oldPassword,
      newPassword
    );

    res.status(200).json(result);

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


// =========================
// 5️⃣ FORGOT PASSWORD
// =========================
const forgotPassword = async (req, res) => {
  try {
    const { identifier } = req.body;

    const result = await authService.forgotPassword(identifier);

    res.status(200).json(result);
  } catch (err) {
    // 🔐 Always generic response
    res.status(200).json({
      message: "If account exists, OTP sent",
    });
  }
};




// =========================
// 7️⃣ RESET PASSWORD
// =========================
const resetPassword = async (req, res) => {
  try {
    const {
      identifier,
      otp,
      newPassword,
    } = req.body;

    const result =
      await authService.resetPassword(
        identifier,
        otp,
        newPassword
      );

    res.status(200).json(result);

  } catch (err) {
    res.status(400).json({
      error: err.message,
    });
  }
};

// =========================
// 7️⃣ DISABLE USER (ADMIN)
// =========================
const disableUser = async (req, res) => {
  try {
    const { user_id } = req.body;

    const result = await authService.disableUser(user_id);

    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


// =========================
// 8️⃣ ENABLE USER (ADMIN)
// =========================
const enableUser = async (req, res) => {
  try {
    const { user_id } = req.body;

    const result = await authService.enableUser(user_id);

    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


module.exports = {
  createUser,
  login,
  setFirstPassword,
  changePassword,
  forgotPassword,
  resetPassword,
  disableUser,
  enableUser,
};