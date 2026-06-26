const pool = require("../config/db");

// 1️⃣ Create Patient
const createPatient = async (data) => {
  const { name, age, phone, gender, address } = data;

  const result = await pool.query(
    `INSERT INTO patients (name, age, phone, gender, address)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [name, age, phone, gender, address]
  );

  return result.rows[0];
};

// 2️⃣ Get All Patients
const getAllPatients = async () => {
  const result = await pool.query("SELECT * FROM patients ORDER BY patient_id DESC");
  return result.rows;
};

// 3️⃣ Get Patient by ID
const getPatientById = async (id) => {
  const result = await pool.query(
    "SELECT * FROM patients WHERE patient_id = $1",
    [id]
  );
  return result.rows[0];
};

// 4️⃣ Update Patient
const updatePatient = async (id, data) => {
  const { name, age, phone, gender, address } = data;

  const result = await pool.query(
    `UPDATE patients
     SET name = $1,
         age = $2,
         phone = $3,
         gender = $4,
         address = $5,
         updated_at = CURRENT_TIMESTAMP
     WHERE patient_id = $6
     RETURNING *`,
    [name, age, phone, gender, address, id]
  );

  return result.rows[0];
};

// 5️⃣ Delete Patient
const deletePatient = async (id) => {
  await pool.query(
    "DELETE FROM patients WHERE patient_id = $1",
    [id]
  );

  return { message: "Patient deleted successfully" };
};

module.exports = {
  createPatient,
  getAllPatients,
  getPatientById,
  updatePatient,
  deletePatient,
};