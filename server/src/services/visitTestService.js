const pool = require("../config/db");

// 1️⃣ Add Test to Visit (SAFE VERSION)
const addTestToVisit = async (data) => {
  const { visit_id, test_id } = data;

  // 1. Check if test exists
  const testResult = await pool.query(
    "SELECT price FROM tests WHERE test_id = $1",
    [test_id]
  );

  if (testResult.rows.length === 0) {
    throw new Error("Test not found");
  }

  const testPrice = testResult.rows[0].price;

  // 2. Insert safely (NO DUPLICATES)
  const insertResult = await pool.query(
    `
    INSERT INTO visit_tests (visit_id, test_id)
    VALUES ($1, $2)
    ON CONFLICT (visit_id, test_id) DO NOTHING
    RETURNING *
    `,
    [visit_id, test_id]
  );

  let message;

  if (insertResult.rows.length === 0) {
    message = "Test already exists in visit";
  } else {
    message = "Test added successfully";
  }

  // 3. Recalculate total test fee
  const totalResult = await pool.query(
    `
    SELECT COALESCE(SUM(t.price), 0) AS total
    FROM visit_tests vt
    JOIN tests t ON vt.test_id = t.test_id
    WHERE vt.visit_id = $1
    `,
    [visit_id]
  );

  const test_fee = totalResult.rows[0].total;

  // 4. Update visits table
  await pool.query(
    `
    UPDATE visits
    SET test_fee = $1,
        updated_at = CURRENT_TIMESTAMP
    WHERE visit_id = $2
    `,
    [test_fee, visit_id]
  );

  return {
    message,
    test_fee,
  };
};

module.exports = {
  addTestToVisit,
};