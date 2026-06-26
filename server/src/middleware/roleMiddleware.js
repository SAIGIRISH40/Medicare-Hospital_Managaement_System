

const allowRoles = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      const user = req.user;

      // ❌ No user (token not verified)
      if (!user) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      // ❌ Role not allowed
      if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({ error: "Access denied" });
      }

      next();
    } catch (err) {
      return res.status(500).json({ error: "Server error" });
    }
  };
};

module.exports = {
  allowRoles,
};