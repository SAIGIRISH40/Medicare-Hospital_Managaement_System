const pool = require("../config/db");

// 1️ Create Doctor
const createDoctor = async (data) => {
  const { name, specialization, experience, join_date, phone, gender } = data;

  const result = await pool.query(
    `INSERT INTO doctors (name, specialization, experience, join_date, phone, gender)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [name, specialization, experience, join_date, phone, gender]
  );

  return result.rows[0];
};

// 2️ Get All Doctors
const getAllDoctors = async () => {
  const result = await pool.query(`
    SELECT 
      d.doctor_id,
      d.name,
      d.phone,
      d.specialization,
      d.experience,
      d.join_date,
      u.username,
      u.email,
      u.status
    FROM doctors d
    JOIN users u ON d.doctor_id = u.doctor_id
    WHERE u.status = 'VALID'   -- ✅ ONLY ACTIVE USERS
    ORDER BY d.doctor_id DESC
  `);

  return result.rows;
};

// 3️ Get Doctor by ID
const getDoctorById = async (id) => {
  const result = await pool.query(
    "SELECT * FROM doctors WHERE doctor_id = $1",
    [id]
  );
  return result.rows[0];
};

// 4️ Update Doctor
const updateDoctor = async (id, data) => {
  const { name, specialization, experience, join_date, phone, gender ,email, username} = data;

  const result = await pool.query(
    `UPDATE doctors
     SET name = $1,
         specialization = $2,
         experience = $3,
         join_date = $4,
         phone = $5,
         gender = $6,
         updated_at = CURRENT_TIMESTAMP
     WHERE doctor_id = $7
     RETURNING *`,
    [name, specialization, experience, join_date, phone, gender, id]
  );
const res = await pool.query(
    `UPDATE users
     SET username = $2,
         email=$1,
         updated_at = CURRENT_TIMESTAMP
     WHERE doctor_id = $3
     RETURNING *`,
    [email,username,id]
  );
  return result.rows[0]+res.rows[0];
};

// 5️ Delete Doctor
const deleteDoctor = async (doctorId) => {
  const result = await pool.query(
    `UPDATE users 
     SET status = 'INVALID', updated_at = CURRENT_TIMESTAMP
     WHERE doctor_id = $1
     RETURNING *`,
    [doctorId]
  );

  if (result.rowCount === 0) {
    throw new Error("Doctor not found");
  }

  return result.rows[0];
};

module.exports = {
  createDoctor,
  getAllDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
};