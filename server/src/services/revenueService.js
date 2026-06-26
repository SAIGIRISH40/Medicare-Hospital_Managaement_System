const pool = require("../config/db");

// GET REVENUE DATA
const getRevenueData = async (filter) => {
  let condition = "";

  if (filter === "today") {
    condition = "AND DATE(v.date) = CURRENT_DATE";
  } else if (filter === "week") {
    condition =
      "AND v.date >= CURRENT_DATE - INTERVAL '7 days'";
  } else if (filter === "month") {
    condition = `
      AND EXTRACT(MONTH FROM v.date) =
      EXTRACT(MONTH FROM CURRENT_DATE)
      AND EXTRACT(YEAR FROM v.date) =
      EXTRACT(YEAR FROM CURRENT_DATE)
    `;
  }

  // Summary
  const summaryResult = await pool.query(
    `
    SELECT
      COALESCE(SUM(v.consultation_fee),0) AS consultation_total,
      COALESCE(SUM(v.medicine_fee),0) AS medicine_total,
      COALESCE(SUM(v.test_fee),0) AS test_total,
      COALESCE(SUM(v.total_bill),0) AS revenue_total
    FROM visits v
    WHERE v.status = 'Completed'
    ${condition}
    `
  );

  // Table Data
  const tableResult = await pool.query(
    `
    SELECT
      p.name AS patient_name,
      v.consultation_fee,
      v.medicine_fee,
      v.test_fee,
      v.total_bill,
      v.date
    FROM visits v
    JOIN patients p
      ON p.patient_id = v.patient_id
    WHERE v.status = 'Completed'
    ${condition}
    ORDER BY v.date DESC
    `
  );

  return {
    summary: summaryResult.rows[0],
    bills: tableResult.rows,
  };
};

module.exports = {
  getRevenueData,
};