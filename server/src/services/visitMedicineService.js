const pool = require("../config/db");

// 1️⃣ Add Medicine to Visit (SAFE VERSION)
const addMedicineToVisit = async (data) => {
  const { visit_id, medicine_id, quantity } = data;

  // 1. Get medicine details
  const medResult = await pool.query(
    "SELECT price, quantity AS stock FROM medicines WHERE medicine_id = $1",
    [medicine_id]
  );

  if (medResult.rows.length === 0) {
    throw new Error("Medicine not found");
  }

  const medicine = medResult.rows[0];

  // 2. Check if already exists in visit
  const existingResult = await pool.query(
    `SELECT quantity 
     FROM visit_medicines 
     WHERE visit_id = $1 AND medicine_id = $2`,
    [visit_id, medicine_id]
  );

  // CASE A: Already exists → update quantity
  if (existingResult.rows.length > 0) {
    const oldQty = existingResult.rows[0].quantity;
    const newQty = oldQty + quantity;

    const diff = quantity;

    // check stock for additional quantity only
    if (medicine.stock < diff) {
      throw new Error("Not enough stock");
    }

    await pool.query(
      `UPDATE visit_medicines
       SET quantity = $1
       WHERE visit_id = $2 AND medicine_id = $3`,
      [newQty, visit_id, medicine_id]
    );

    // reduce stock
    await pool.query(
      `UPDATE medicines
       SET quantity = quantity - $1,
           updated_at = CURRENT_TIMESTAMP
       WHERE medicine_id = $2`,
      [diff, medicine_id]
    );

  } 
  // CASE B: New entry
  else {
    if (medicine.stock < quantity) {
      throw new Error("Not enough stock");
    }

    await pool.query(
      `
      INSERT INTO visit_medicines (visit_id, medicine_id, quantity)
      VALUES ($1, $2, $3)
      ON CONFLICT (visit_id, medicine_id) DO NOTHING
      `,
      [visit_id, medicine_id, quantity]
    );

    await pool.query(
      `UPDATE medicines
       SET quantity = quantity - $1,
           updated_at = CURRENT_TIMESTAMP
       WHERE medicine_id = $2`,
      [quantity, medicine_id]
    );
  }

  // 3. Recalculate medicine fee
  const totalResult = await pool.query(
    `
    SELECT COALESCE(SUM(vm.quantity * m.price), 0) AS total
    FROM visit_medicines vm
    JOIN medicines m ON vm.medicine_id = m.medicine_id
    WHERE vm.visit_id = $1
    `,
    [visit_id]
  );

  const medicine_fee = totalResult.rows[0].total;

  // 4. Update visit
  await pool.query(
    `
    UPDATE visits
    SET medicine_fee = $1,
        updated_at = CURRENT_TIMESTAMP
    WHERE visit_id = $2
    `,
    [medicine_fee, visit_id]
  );

  return {
    message: "Medicine added/updated successfully",
    medicine_fee,
  };
};

module.exports = {
  addMedicineToVisit,
};