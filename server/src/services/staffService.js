const pool = require("../config/db");

// GET ALL RECEPTION STAFF
const getAllStaff = async () => {
  const result = await pool.query(
    `
    SELECT
      u.user_id,
      u.username,
      u.email,
      u.status,
      u.created_at,

      s.staff_id,
      s.name,
      s.phone

    FROM users u
    JOIN staff s
      ON u.staff_id = s.staff_id

    WHERE u.role = 'reception'

    ORDER BY s.staff_id DESC
    `
  );

  return result.rows;
};

// DEACTIVATE STAFF
const deactivateStaff = async (user_id) => {
  const result = await pool.query(
    `
    UPDATE users
    SET
      status = 'INVALID',
      updated_at = CURRENT_TIMESTAMP
    WHERE user_id = $1
      AND role = 'reception'
    RETURNING
      user_id,
      username,
      email,
      status
    `,
    [user_id]
  );

  if (result.rows.length === 0) {
    throw new Error("Staff not found");
  }

  return result.rows[0];
};

module.exports = {
  getAllStaff,
  deactivateStaff,
};