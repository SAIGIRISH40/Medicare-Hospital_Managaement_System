import { useEffect, useState } from "react";
import API from "../../api/axios";
import Loader from "../../components/common/Loader";
import { toast } from "react-toastify";

export default function ReceptionDashboard() {
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    patients: 0,
    todayVisits: 0,
    pending: 0,
    completed: 0,
    doctors: 0,
  });

  const [todayVisitsList, setTodayVisitsList] = useState([]);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const [patientsRes, visitsRes, doctorsRes] = await Promise.all([
        API.get("/patients"),
        API.get("/visits"),
        API.get("/doctors"),
      ]);

      const patients = patientsRes.data || [];
      const visits = visitsRes.data || [];
      const doctors = doctorsRes.data || [];

      const today = new Date().toDateString();

      const todayVisits = visits.filter(
        (v) => new Date(v.date).toDateString() === today
      );

      setStats({
        patients: patients.length,
        todayVisits: todayVisits.length,
        pending: todayVisits.filter(
          (v) => v.status === "Pending"
        ).length,
        completed: todayVisits.filter(
          (v) => v.status === "Completed"
        ).length,
        doctors: doctors.length,
      });

      setTodayVisitsList(todayVisits.slice(0, 10));
    } catch (err) {
      console.log(err);
      toast.error("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  const cards = [
    {
      title: "Total Patients",
      value: stats.patients,
      icon: "👤",
    },
    {
      title: "Today's Visits",
      value: stats.todayVisits,
      icon: "📅",
    },
    {
      title: "Pending",
      value: stats.pending,
      icon: "⏳",
    },
    {
      title: "Completed",
      value: stats.completed,
      icon: "✅",
    },
    {
      title: "Active Doctors",
      value: stats.doctors,
      icon: "🩺",
    },
  ];

  return (
    <div className="space-y-6">
      
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          Reception Dashboard
        </h1>

        <p className="text-gray-500 mt-1">
          Daily patient and visit overview
        </p>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {cards.map((card) => (
          <div
            key={card.title}
            className="
              bg-gradient-to-r
              from-green-50
              to-white
              border-l-4
              border-primary
              rounded-xl
              p-5
              shadow-sm
            "
          >
            <div className="flex justify-between items-center">
              <h3 className="text-gray-600 font-medium">
                {card.title}
              </h3>

              <span className="text-2xl">
                {card.icon}
              </span>
            </div>

            <p className="text-4xl font-bold text-primary mt-3">
              {card.value}
            </p>
          </div>
        ))}
      </div>

      {/* OVERVIEW SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* TODAY OVERVIEW */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold mb-4">
            Today's Overview
          </h2>

          <div className="space-y-4">

            <div className="flex justify-between">
              <span className="text-gray-600">
                Today's Visits
              </span>

              <span className="font-semibold">
                {stats.todayVisits}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">
                Pending Consultations
              </span>

              <span className="font-semibold text-yellow-600">
                {stats.pending}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">
                Completed Consultations
              </span>

              <span className="font-semibold text-green-600">
                {stats.completed}
              </span>
            </div>

          </div>
        </div>

        {/* DOCTOR AVAILABILITY */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold mb-4">
            Doctor Availability
          </h2>

          <div className="flex justify-between items-center">
            <span className="text-gray-600">
              Active Doctors
            </span>

            <span className="font-bold text-primary text-xl">
              {stats.doctors}
            </span>
          </div>

          <p className="text-sm text-gray-500 mt-4">
            Doctors currently registered and available for consultations.
          </p>
        </div>

      </div>

      {/* TODAY VISITS TABLE */}
      <div className="bg-white rounded-xl shadow p-6">

        <h2 className="text-xl font-semibold mb-4">
          Today's Visits
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-center">

            <thead>
              <tr className="bg-green-50 text-gray-700">
                <th className="p-3">Patient</th>
                <th className="p-3">Doctor</th>
                <th className="p-3">Date</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>

            <tbody>
              {todayVisitsList.length > 0 ? (
                todayVisitsList.map((visit) => (
                  <tr
                    key={visit.visit_id}
                    className="border-b hover:bg-green-50 transition"
                  >
                    <td className="p-3">
                      {visit.patient_name}
                    </td>

                    <td className="p-3">
                      {visit.doctor_name}
                    </td>

                    <td className="p-3">
                      {new Date(
                        visit.date
                      ).toLocaleDateString()}
                    </td>

                    <td className="p-3">
                      <span
                        className={
                          visit.status === "Completed"
                            ? "bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm"
                            : "bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm"
                        }
                      >
                        {visit.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="p-6 text-gray-500"
                  >
                    No visits found for today
                  </td>
                </tr>
              )}
            </tbody>

          </table>
        </div>

      </div>

    </div>
  );
}