const pool = require("../config/db");

const {
  addMedicineToVisit,
} = require("./visitMedicineService");

const {
  addTestToVisit,
} = require("./visitTestService");


// =========================
// SAVE CONSULTATION
// =========================
const saveConsultation = async ({
  visit_id,
  diagnosis,
  tests,
  medicines,
}) => {

  // 1️⃣ Check visit exists
  const visitResult = await pool.query(
    "SELECT * FROM visits WHERE visit_id = $1",
    [visit_id]
  );

  if (visitResult.rows.length === 0) {
    throw new Error("Visit not found");
  }

  // 2️⃣ Save diagnosis + status
  await pool.query(
    `
    UPDATE visits
    SET
      diagnosis = $1,
      status = 'In Consultation',
      updated_at = CURRENT_TIMESTAMP
    WHERE visit_id = $2
    `,
    [diagnosis || "", visit_id]
  );

  // 3️⃣ Save tests
  if (tests && tests.length > 0) {
    for (const test of tests) {
      await addTestToVisit({
        visit_id,
        test_id: test.test_id,
      });
    }
  }


  // 5️⃣ Return updated visit
  const result = await pool.query(
    `
    SELECT *
    FROM visits
    WHERE visit_id = $1
    `,
    [visit_id]
  );

  return result.rows[0];
};

module.exports = {
  saveConsultation,
};