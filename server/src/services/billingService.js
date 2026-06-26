const pool = require("../config/db");

// 1️⃣ Calculate Total Bill (FIXED: Now returns payment_status!)
const calculateTotalBill = async (visit_id) => {
  // Get all fees AND payment_status
  const result = await pool.query(
    `SELECT consultation_fee, medicine_fee, test_fee, payment_status
     FROM visits
     WHERE visit_id = $1`,
    [visit_id]
  );

  if (result.rows.length === 0) {
    throw new Error("Visit not found");
  }

  const visit = result.rows[0];

  const consultation_fee = parseFloat(visit.consultation_fee) || 0;
  const medicine_fee = parseFloat(visit.medicine_fee) || 0;
  const test_fee = parseFloat(visit.test_fee) || 0;
  const payment_status = visit.payment_status; // Captured here

  // Calculate total
  const total_bill = consultation_fee + medicine_fee + test_fee;

  // Update DB
  await pool.query(
    `UPDATE visits
     SET total_bill = $1,
         updated_at = CURRENT_TIMESTAMP
     WHERE visit_id = $2`,
    [total_bill, visit_id]
  );

  return {
    visit_id,
    consultation_fee,
    medicine_fee,
    test_fee,
    total_bill,
    payment_status, // Sent back to frontend safely
  };
};

// 2️⃣ Get Medicines for a Visit
const getMedicinesByVisitId = async (visit_id) => {
  const result = await pool.query(
    `SELECT
        m.medicine_id,
        m.name,
        m.price,
        vm.quantity,
        (vm.quantity * m.price) AS total
     FROM visit_medicines vm
     JOIN medicines m
       ON vm.medicine_id = m.medicine_id
     WHERE vm.visit_id = $1
     ORDER BY m.name`,
    [visit_id]
  );

  return result.rows;
};

// 3️⃣ Get Tests for a Visit
const getTestsByVisitId = async (visit_id) => {
  const result = await pool.query(
    `SELECT
        t.test_id,
        t.name,
        t.price
     FROM visit_tests vt
     JOIN tests t
       ON vt.test_id = t.test_id
     WHERE vt.visit_id = $1
     ORDER BY t.name`,
    [visit_id]
  );

  return result.rows;
};

// 4️⃣ Get Billing Visits
const getBillingVisits = async () => {
  const result = await pool.query(`
    SELECT
      v.visit_id,
      p.name AS patient_name,
      d.name AS doctor_name,
      v.total_bill,
      v.payment_status,
      v.date
    FROM visits v
    JOIN patients p
      ON v.patient_id = p.patient_id
    JOIN doctors d
      ON v.doctor_id = d.doctor_id
    WHERE v.status = 'Completed'
    ORDER BY
      CASE
        WHEN v.payment_status = 'UNPAID' THEN 0
        ELSE 1
      END,
      v.visit_id DESC
  `);

  return result.rows;
};

// 5️⃣ Mark Bill Paid
const markBillPaid = async (visit_id) => {
  const result = await pool.query(
    `
    UPDATE visits
    SET
      payment_status = 'PAID',
      updated_at = CURRENT_TIMESTAMP
    WHERE visit_id = $1
    RETURNING *
    `,
    [visit_id]
  );

  if (result.rows.length === 0) {
    throw new Error("Visit not found");
  }

  return result.rows[0];
};

module.exports = {
  calculateTotalBill,
  getMedicinesByVisitId,
  getTestsByVisitId,
  getBillingVisits,
  markBillPaid,
};