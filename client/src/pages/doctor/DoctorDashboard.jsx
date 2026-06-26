import { useEffect, useState } from "react";
import API from "../../api/axios";
import Loader from "../../components/common/Loader";
import { toast } from "react-toastify";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);

  const [dashboard, setDashboard] = useState({
    pendingPatients: 0,
    completedPatients: 0,
    todayPatients: 0,
    totalVisits: 0,
    chartData: [],
    recentVisits: [],
  });

  const [filter, setFilter] = useState("week");

  useEffect(() => {
    fetchDashboard();
  }, [filter]);

  const fetchDashboard = async () => {
    try {
      setLoading(true);

      const res = await API.get(
        `/doctor-dashboard?filter=${filter}`
      );

      setDashboard(res.data);
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
      value: dashboard.totalVisits,
      icon: "👨‍⚕️",
    },
    {
      title: "Pending Patients",
      value: dashboard.pendingPatients,
      icon: "⏳",
    },
    {
      title: "Today's Patients",
      value: dashboard.todayPatients,
      icon: "📅",
    },
  ];

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Doctor Dashboard
        </h1>

        <p className="text-sm text-gray-500">
          Consultation and patient overview
        </p>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

        {cards.map((card) => (
          <div
            key={card.title}
            className="
              bg-gradient-to-r
              from-green-50
              to-white
              border-l-4
              border-primary
              rounded-2xl
              p-5
              shadow-md
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

      {/* GRAPH + SUMMARY */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* GRAPH */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-md p-6">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

            <h2 className="text-xl font-semibold text-gray-800">
              Consultation Trend
            </h2>

            <select
              value={filter}
              onChange={(e) =>
                setFilter(e.target.value)
              }
              className="
                border
                rounded-xl
                px-4
                py-2
                focus:outline-none
                focus:ring-2
                focus:ring-green-300
              "
            >
              <option value="today">
                Daily
              </option>

              <option value="week">
                Weekly
              </option>

              <option value="month">
                Monthly
              </option>
            </select>

          </div>

          {dashboard.chartData?.length > 0 ? (

            <div className="h-80">

              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <LineChart
                  data={dashboard.chartData}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                  />

                  <XAxis
                    dataKey="label"
                  />

                  <YAxis />

                  <Tooltip />

                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#16a34a"
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>

            </div>

          ) : (

            <p className="text-gray-500">
              No chart data available
            </p>

          )}

        </div>

        {/* SUMMARY PANEL */}
        <div className="bg-white rounded-2xl shadow-md p-6">

          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Quick Summary
          </h2>

          <div className="space-y-5">

            <div className="border-b pb-4">
              <p className="text-sm text-gray-500">
                Pending Patients
              </p>

              <p className="text-3xl font-bold text-yellow-600 mt-1">
                {dashboard.pendingPatients}
              </p>
            </div>

            <div className="border-b pb-4">
              <p className="text-sm text-gray-500">
                Patients Consulted
              </p>

              <p className="text-3xl font-bold text-green-600 mt-1">
                {dashboard.completedPatients}
              </p>
            </div>

            <div className="border-b pb-4">
              <p className="text-sm text-gray-500">
                Today's Patients
              </p>

              <p className="text-3xl font-bold text-blue-600 mt-1">
                {dashboard.todayPatients}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Total Visits
              </p>

              <p className="text-3xl font-bold text-primary mt-1">
                {dashboard.totalVisits}
              </p>
            </div>

          </div>

        </div>

      </div>

      {/* RECENT VISITS */}
      <div className="bg-white rounded-2xl shadow-md p-6">

        <h2 className="text-xl font-semibold mb-4">
          Recent Visits
        </h2>

        <div className="overflow-x-auto">

          <table className="w-full text-center border-collapse">

            <thead>
              <tr className="bg-green-50 text-gray-700">

                <th className="p-3">
                  Visit ID
                </th>

                <th className="p-3">
                  Patient
                </th>

                <th className="p-3">
                  Date
                </th>

                <th className="p-3">
                  Status
                </th>

              </tr>
            </thead>

            <tbody>

              {dashboard.recentVisits?.length > 0 ? (

                dashboard.recentVisits.map(
                  (visit) => (
                    <tr
                      key={visit.visit_id}
                      className="
                        border-b
                        hover:bg-green-50
                        transition
                      "
                    >

                      <td className="p-3">
                        #{visit.visit_id}
                      </td>

                      <td className="p-3 font-medium">
                        {visit.patient_name}
                      </td>

                      <td className="p-3">
                        {new Date(
                          visit.date
                        ).toLocaleDateString()}
                      </td>

                      <td className="p-3">

                        <span
                          className={
                            visit.status ===
                            "Completed"
                              ? "bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium"
                              : visit.status ===
                                "In Consultation"
                              ? "bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium"
                              : "bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-medium"
                          }
                        >
                          {visit.status}
                        </span>

                      </td>

                    </tr>
                  )
                )

              ) : (

                <tr>
                  <td
                    colSpan="4"
                    className="p-6 text-gray-500"
                  >
                    No recent visits found
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