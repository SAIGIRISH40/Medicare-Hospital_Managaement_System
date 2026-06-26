const jwt = require("jsonwebtoken");
const pool = require("../config/db");

const JWT_SECRET = process.env.JWT_SECRET;

// =========================
// 🔐 VERIFY TOKEN MIDDLEWARE
// =========================
const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // ❌ No token
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    // 🔑 Verify token
    const decoded = jwt.verify(token, JWT_SECRET);

    // 🧠 Get user from DB (IMPORTANT)
    //console.log("DECODED TOKEN:", decoded);
    const result = await pool.query(
      "SELECT user_id, role, status FROM users WHERE user_id = $1",
      [decoded.user_id]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "User not found" });
    }

    const user = result.rows[0];

    // 🚫 Check VALID / INVALID
    if (user.status !== "VALID") {
      return res.status(403).json({ error: "Access denied. User disabled" });
    }

    // 📌 Attach user to request
    req.user = user;

    next();

  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

module.exports = {
  verifyToken,
};