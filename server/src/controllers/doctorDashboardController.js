const dashboardService = require(
  "../services/doctorDashboardService"
);

const getDoctorDashboard = async (
  req,
  res
) => {
  try {

    const user_id =
      req.user.user_id;

    const filter =
      req.query.filter || "week";

    const data =
      await dashboardService.getDoctorDashboard(
        user_id,
        filter
      );

    res.status(200).json(data);

  } catch (error) {

    res.status(500).json({
      error: error.message,
    });

  }
};

module.exports = {
  getDoctorDashboard,
};