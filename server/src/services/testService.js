const pool = require("../config/db");

// 🔹 CREATE TEST
const createTest = async ({ name, price }) => {
  const result = await pool.query(
    `INSERT INTO tests (name, price, is_valid)
     VALUES ($1, $2, TRUE)
     RETURNING *`,
    [name, price]
  );

  return result.rows[0];
};

// 🔹 GET ALL TESTS (WITH SEARCH + ONLY ACTIVE)
const getAllTests = async (search) => {
  let query = `
    SELECT * FROM tests
    WHERE is_valid = TRUE
  `;

  const values = [];

  if (search) {
    query += ` AND LOWER(name) LIKE LOWER($1)`;
    values.push(`%${search}%`);
  }

  query += ` ORDER BY test_id DESC`;

  const result = await pool.query(query, values);
  return result.rows;
};

// 🔹 GET TEST BY ID (ONLY ACTIVE)
const getTestById = async (id) => {
  const result = await pool.query(
    `SELECT * FROM tests
     WHERE test_id = $1
     AND is_valid = TRUE`,
    [id]
  );

  return result.rows[0];
};

// 🔹 UPDATE TEST (ONLY IF ACTIVE)
const updateTest = async (id, { name, price }) => {
  const result = await pool.query(
    `UPDATE tests
     SET name = $1,
         price = $2,
         updated_at = CURRENT_TIMESTAMP
     WHERE test_id = $3
     AND is_valid = TRUE
     RETURNING *`,
    [name, price, id]
  );

  if (result.rows.length === 0) {
    throw new Error("Test not found or inactive");
  }

  return result.rows[0];
};

// 🔹 SOFT DELETE TEST
const deleteTest = async (id) => {
  const result = await pool.query(
    `UPDATE tests
     SET is_valid = FALSE,
         updated_at = CURRENT_TIMESTAMP
     WHERE test_id = $1
     AND is_valid = TRUE
     RETURNING *`,
    [id]
  );

  if (result.rows.length === 0) {
    throw new Error("Test not found or already deleted");
  }

  return { message: "Test deleted successfully" };
};

module.exports = {
  createTest,
  getAllTests,
  getTestById,
  updateTest,
  deleteTest,
};