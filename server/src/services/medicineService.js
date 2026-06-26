const pool = require("../config/db");

// 1️⃣ CREATE MEDICINE
const createMedicine = async (data) => {
  const { name, price, quantity, min_stock } = data;

  const result = await pool.query(
    `INSERT INTO medicines (name, price, quantity, min_stock, is_valid)
     VALUES ($1, $2, $3, $4, TRUE)
     RETURNING *`,
    [name, price, quantity, min_stock]
  );

  return result.rows[0];
};

const getAllMedicines = async (search) => {
  let query = `
    SELECT *
    FROM medicines
    WHERE is_valid = TRUE
  `;

  const values = [];

  if (search) {
    query += ` AND LOWER(name) LIKE LOWER($1)`;
    values.push(`%${search}%`);
  }

  query += ` ORDER BY medicine_id DESC`;

  const result = await pool.query(query, values);

  return result.rows;
};

// 3️⃣ GET MEDICINE BY ID (ONLY ACTIVE)
const getMedicineById = async (id) => {
  const result = await pool.query(
    `SELECT * FROM medicines
     WHERE medicine_id = $1
     AND is_valid = TRUE`,
    [id]
  );

  return result.rows[0];
};

// 4️⃣ UPDATE MEDICINE (ONLY IF ACTIVE)
const updateMedicine = async (id, data) => {
  const { name, price, quantity, min_stock } = data;

  const result = await pool.query(
    `UPDATE medicines
     SET name = $1,
         price = $2,
         quantity = $3,
         min_stock = $4,
         updated_at = CURRENT_TIMESTAMP
     WHERE medicine_id = $5
     AND is_valid = TRUE
     RETURNING *`,
    [name, price, quantity, min_stock, id]
  );

  if (result.rows.length === 0) {
    throw new Error("Medicine not found or inactive");
  }

  return result.rows[0];
};

// 5️⃣ SOFT DELETE MEDICINE
const deleteMedicine = async (id) => {
  const result = await pool.query(
    `UPDATE medicines
     SET is_valid = FALSE,
         updated_at = CURRENT_TIMESTAMP
     WHERE medicine_id = $1
     AND is_valid = TRUE
     RETURNING *`,
    [id]
  );

  if (result.rows.length === 0) {
    throw new Error("Medicine not found or already deleted");
  }

  return { message: "Medicine deleted successfully" };
};

// 6️⃣ LOW STOCK (ONLY ACTIVE)
const getLowStockMedicines = async () => {
  const query = `
    SELECT * FROM medicines
    WHERE is_valid = TRUE
    AND quantity < min_stock
    ORDER BY quantity ASC
  `;

  const result = await pool.query(query);
  return result.rows;
};

module.exports = {
  createMedicine,
  getAllMedicines,
  getMedicineById,
  updateMedicine,
  deleteMedicine,
  getLowStockMedicines,
};