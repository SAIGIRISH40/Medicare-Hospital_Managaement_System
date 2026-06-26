const pool = require("../config/db");


// 1️⃣ CREATE VISIT
const createVisit = async (data) => {
  const { patient_id, doctor_id, status, consultation_fee } = data;

  const result = await pool.query(
    `INSERT INTO visits (patient_id, doctor_id, status, consultation_fee)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [
      patient_id,
      doctor_id,
      status || "Pending",
      consultation_fee || 1500,
    ]
  );

  return result.rows[0];
};


// 2️⃣ GET ALL VISITS (ADMIN)
const getAllVisits = async () => {
  const result = await pool.query(
    `SELECT 
        v.visit_id,
        v.date,
        v.status,
        v.diagnosis,
        v.total_bill,
        p.name AS patient_name,
        p.phone,
        d.name AS doctor_name
     FROM visits v
     JOIN patients p ON v.patient_id = p.patient_id
     JOIN doctors d ON v.doctor_id = d.doctor_id
     ORDER BY v.visit_id DESC`
  );

  return result.rows;
};


// ⭐ 3️⃣ GET VISITS BY DOCTOR WITH FILTERS
const getVisitsByDoctor = async (user_id, { filter, date }) => {

  // 🔥 Step 1: Get doctor_id
  const docRes = await pool.query(
    "SELECT doctor_id FROM users WHERE user_id = $1",
    [user_id]
  );

  if (docRes.rows.length === 0 || !docRes.rows[0].doctor_id) {
    throw new Error("Doctor not found");
  }

  const doctor_id = docRes.rows[0].doctor_id;

  // 🔥 Step 2: Build query
  let query = `
    SELECT 
      v.visit_id,
      v.date,
      v.status,
      v.diagnosis,
      v.total_bill,
      p.name AS patient_name,
      p.phone
    FROM visits v
    JOIN patients p ON v.patient_id = p.patient_id
    WHERE v.doctor_id = $1
  `;

  let values = [doctor_id];
  let index = 2;

  if (date) {
    query += ` AND DATE(v.date) = $${index}`;
    values.push(date);
    index++;
  } else if (filter === "today") {
    query += ` AND DATE(v.date) = CURRENT_DATE`;
  } else if (filter === "week") {
    query += ` AND v.date >= CURRENT_DATE - INTERVAL '7 days'`;
  } else if (filter === "month") {
    query += `
      AND EXTRACT(MONTH FROM v.date) = EXTRACT(MONTH FROM CURRENT_DATE)
      AND EXTRACT(YEAR FROM v.date) = EXTRACT(YEAR FROM CURRENT_DATE)
    `;
  }

  query += ` ORDER BY v.date DESC`;

  const result = await pool.query(query, values);
  return result.rows;
};

// 4️⃣ GET VISIT BY ID
const getVisitById = async (id) => {
  const result = await pool.query(
    `SELECT 
        v.*,
        p.name AS patient_name,
        p.phone,
        p.age,
        p.gender,
        d.name AS doctor_name
     FROM visits v
     JOIN patients p ON v.patient_id = p.patient_id
     JOIN doctors d ON v.doctor_id = d.doctor_id
     WHERE v.visit_id = $1`,
    [id]
  );

  return result.rows[0];
};


// 5️⃣ UPDATE VISIT (DOCTOR ACTION)
const updateVisit = async (id, data) => {
  const {
    status,
    diagnosis,
    notes,
    medicine_fee,
    test_fee,
  } = data;

  // 🔥 Auto calculate total
  const result = await pool.query(
    `UPDATE visits
     SET 
       status = COALESCE($1, status),
       diagnosis = COALESCE($2, diagnosis),
       notes = COALESCE($3, notes),
       medicine_fee = COALESCE($4, medicine_fee),
       test_fee = COALESCE($5, test_fee),
       total_bill = COALESCE(consultation_fee, 0) 
                    + COALESCE($4, medicine_fee, 0)
                    + COALESCE($5, test_fee, 0),
       updated_at = CURRENT_TIMESTAMP
     WHERE visit_id = $6
     RETURNING *`,
    [status, diagnosis, notes, medicine_fee, test_fee, id]
  );

  if (result.rows.length === 0) {
    throw new Error("Visit not found");
  }

  return result.rows[0];
};


// 6️⃣ DELETE VISIT
const deleteVisit = async (id) => {
  const result = await pool.query(
    `DELETE FROM visits WHERE visit_id = $1 RETURNING *`,
    [id]
  );

  if (result.rows.length === 0) {
    throw new Error("Visit not found");
  }

  return { message: "Visit deleted successfully" };
};

// 5️⃣ GET PATIENT HISTORY
const getPatientHistory = async (visit_id) => {

  const currentVisit = await pool.query(
    `
    SELECT patient_id
    FROM visits
    WHERE visit_id = $1
    `,
    [visit_id]
  );

  if (currentVisit.rows.length === 0) {
    throw new Error("Visit not found");
  }

  const patient_id = currentVisit.rows[0].patient_id;

  const visitsResult = await pool.query(
    `
    SELECT
      visit_id,
      date,
      diagnosis,
      status
    FROM visits
    WHERE patient_id = $1
      AND visit_id <> $2
    ORDER BY date DESC
    `,
    [patient_id, visit_id]
  );

  const history = [];

  for (const visit of visitsResult.rows) {

    const medicinesResult = await pool.query(
      `
      SELECT
        m.name,
        vm.quantity
      FROM visit_medicines vm
      JOIN medicines m
        ON m.medicine_id = vm.medicine_id
      WHERE vm.visit_id = $1
      `,
      [visit.visit_id]
    );

    const testsResult = await pool.query(
      `
      SELECT
        t.name
      FROM visit_tests vt
      JOIN tests t
        ON t.test_id = vt.test_id
      WHERE vt.visit_id = $1
      `,
      [visit.visit_id]
    );

    history.push({
      ...visit,
      medicines: medicinesResult.rows,
      tests: testsResult.rows,
    });
  }

  return history;
}


// GET ALL PATIENTS OF DOCTOR
const getAllPatientsByDoctor = async (user_id) => {
  const docRes = await pool.query(
    `SELECT doctor_id
     FROM users
     WHERE user_id = $1`,
    [user_id]
  );

  if (
    docRes.rows.length === 0 ||
    !docRes.rows[0].doctor_id
  ) {
    throw new Error("Doctor not found");
  }

  const doctor_id = docRes.rows[0].doctor_id;

  const result = await pool.query(
    `
    SELECT DISTINCT ON (p.patient_id)
      p.patient_id,
      p.name,
      p.phone,
      p.age,
      p.gender,
      v.visit_id,
      v.date,
      v.status,
      v.diagnosis
    FROM visits v
    JOIN patients p
      ON p.patient_id = v.patient_id
    WHERE v.doctor_id = $1
    ORDER BY p.patient_id, v.date DESC
    `,
    [doctor_id]
  );

  return result.rows;
};

const getVisitDetails = async (visit_id) => {

  const visitResult = await pool.query(
    `
    SELECT
      v.*,
      p.name AS patient_name,
      p.phone,
      p.age,
      p.gender,
      d.name AS doctor_name
    FROM visits v
    JOIN patients p
      ON p.patient_id = v.patient_id
    JOIN doctors d
      ON d.doctor_id = v.doctor_id
    WHERE v.visit_id = $1
    `,
    [visit_id]
  );

  if (visitResult.rows.length === 0) {
    throw new Error("Visit not found");
  }

  const medicinesResult = await pool.query(
    `
    SELECT
      m.name,
      vm.quantity
    FROM visit_medicines vm
    JOIN medicines m
      ON m.medicine_id = vm.medicine_id
    WHERE vm.visit_id = $1
    `,
    [visit_id]
  );

  const testsResult = await pool.query(
    `
    SELECT
      t.name
    FROM visit_tests vt
    JOIN tests t
      ON t.test_id = vt.test_id
    WHERE vt.visit_id = $1
    `,
    [visit_id]
  );

  return {
    visit: visitResult.rows[0],
    medicines: medicinesResult.rows,
    tests: testsResult.rows,
  };
};

module.exports = {
  createVisit,
  getAllVisits,
  getVisitsByDoctor,
  getVisitById,
  getPatientHistory,
  updateVisit,
  deleteVisit,
  getAllPatientsByDoctor,
  getVisitDetails
};