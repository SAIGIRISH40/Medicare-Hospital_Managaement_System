const pool = require("../config/db");

const {
  addMedicineToVisit,
} = require("./visitMedicineService");

const completeConsultation = async ({
  visit_id,
  medicines,
}) => {

  // 1️⃣ Check visit exists
  const visitResult = await pool.query(
    `
    SELECT *
    FROM visits
    WHERE visit_id = $1
    `,
    [visit_id]
  );

  if (visitResult.rows.length === 0) {
    throw new Error("Visit not found");
  }

  // 2️⃣ Save medicines
  if (medicines && medicines.length > 0) {
    for (const medicine of medicines) {
      await addMedicineToVisit({
        visit_id,
        medicine_id: medicine.medicine_id,
        quantity: medicine.quantity,
      });
    }
  }

  // 3️⃣ Get latest fees
  const updatedVisit = await pool.query(
    `
    SELECT
      consultation_fee,
      medicine_fee,
      test_fee
    FROM visits
    WHERE visit_id = $1
    `,
    [visit_id]
  );

  const visit = updatedVisit.rows[0];

  const consultation_fee =
    Number(visit.consultation_fee || 0);

  const medicine_fee =
    Number(visit.medicine_fee || 0);

  const test_fee =
    Number(visit.test_fee || 0);

  const total_bill =
    consultation_fee +
    medicine_fee +
    test_fee;

  // 4️⃣ Mark visit completed
  const result = await pool.query(
    `
    UPDATE visits
    SET
      status = 'Completed',
      total_bill = $1,
      updated_at = CURRENT_TIMESTAMP
    WHERE visit_id = $2
    RETURNING *
    `,
    [total_bill, visit_id]
  );

  return result.rows[0];
};

module.exports = {
  completeConsultation,
};