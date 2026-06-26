const pool = require("../config/db");

const getDoctorDashboard = async (
  user_id,
  filter = "week"
) => {

  const docRes = await pool.query(
    `
    SELECT doctor_id
    FROM users
    WHERE user_id = $1
    `,
    [user_id]
  );

  if (docRes.rows.length === 0) {
    throw new Error("Doctor not found");
  }

  const doctor_id = docRes.rows[0].doctor_id;

  // Pending Patients
  const pendingResult = await pool.query(
    `
    SELECT COUNT(*) AS count
    FROM visits
    WHERE doctor_id = $1
      AND status = 'Pending'
    `,
    [doctor_id]
  );

  // Completed Patients
  const completedResult = await pool.query(
    `
    SELECT COUNT(*) AS count
    FROM visits
    WHERE doctor_id = $1
      AND status = 'Completed'
    `,
    [doctor_id]
  );

  // Today's Patients
  const todayResult = await pool.query(
    `
    SELECT COUNT(*) AS count
    FROM visits
    WHERE doctor_id = $1
      AND DATE(date) = CURRENT_DATE
    `,
    [doctor_id]
  );

  // Total Visits
  const totalResult = await pool.query(
    `
    SELECT COUNT(*) AS count
    FROM visits
    WHERE doctor_id = $1
    `,
    [doctor_id]
  );

  // Recent Visits
  const recentResult = await pool.query(
    `
    SELECT
      v.visit_id,
      v.date,
      v.status,
      p.name AS patient_name
    FROM visits v
    JOIN patients p
      ON p.patient_id = v.patient_id
    WHERE v.doctor_id = $1
    ORDER BY v.date DESC
    LIMIT 5
    `,
    [doctor_id]
  );

  // Chart Data
  let chartQuery = "";

  if (filter === "today") {
    chartQuery = `
      SELECT
        EXTRACT(HOUR FROM date) AS label,
        COUNT(*) AS count
      FROM visits
      WHERE doctor_id = $1
        AND DATE(date) = CURRENT_DATE
      GROUP BY label
      ORDER BY label
    `;
  }

  else if (filter === "month") {
    chartQuery = `
      SELECT
        DATE(date) AS label,
        COUNT(*) AS count
      FROM visits
      WHERE doctor_id = $1
        AND date >= CURRENT_DATE - INTERVAL '30 days'
      GROUP BY label
      ORDER BY label
    `;
  }

  else {
    chartQuery = `
      SELECT
        DATE(date) AS label,
        COUNT(*) AS count
      FROM visits
      WHERE doctor_id = $1
        AND date >= CURRENT_DATE - INTERVAL '7 days'
      GROUP BY label
      ORDER BY label
    `;
  }

  const chartResult = await pool.query(
    chartQuery,
    [doctor_id]
  );

  return {
    pendingPatients:
      Number(pendingResult.rows[0].count),

    completedPatients:
      Number(completedResult.rows[0].count),

    todayPatients:
      Number(todayResult.rows[0].count),

    totalVisits:
      Number(totalResult.rows[0].count),

    chartData: chartResult.rows,

    recentVisits:
      recentResult.rows,
  };
};

module.exports = {
  getDoctorDashboard,
};