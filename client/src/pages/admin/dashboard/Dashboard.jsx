import { useEffect, useState } from "react";
import API from "../../../api/axios";
import Loader from "../../../components/common/Loader";
import { toast } from "react-toastify";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    patients: 0,
    doctors: 0,
    visits: 0,
    tests: 0,
    medicines: 0,
  });

  const [today, setToday] = useState({
    patients: 0,
    visits: 0,
    pending: 0,
    completed: 0,
  });

  const [lowStock, setLowStock] = useState([]);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const [
        patientsRes,
        doctorsRes,
        visitsRes,
        testsRes,
        medicinesRes,
      ] = await Promise.all([
        API.get("/patients"),
        API.get("/doctors"),
        API.get("/visits"),
        API.get("/tests"),
        API.get("/medicines"),
      ]);

      const patients = patientsRes.data || [];
      const doctors = doctorsRes.data || [];
      const visits = visitsRes.data || [];
      const tests = testsRes.data || [];
      const medicines = medicinesRes.data || [];

      const todayDate = new Date().toDateString();

      const todayVisits = visits.filter(
        (visit) =>
          new Date(visit.date).toDateString() === todayDate
      );

      setStats({
        patients: patients.length,
        doctors: doctors.length,
        visits: visits.length,
        tests: tests.length,
        medicines: medicines.length,
      });

      setToday({
        patients: new Set(
          todayVisits.map((visit) => visit.patient_id)
        ).size,
        visits: todayVisits.length,
        pending: todayVisits.filter(
          (visit) => visit.status === "Pending"
        ).length,
        completed: todayVisits.filter(
          (visit) => visit.status === "Completed"
        ).length,
      });

      setLowStock(
        medicines.filter(
          (medicine) =>
            Number(medicine.quantity) <=
            Number(medicine.min_stock)
        )
      );
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
      title: "Patients",
      value: stats.patients,
      subtitle: "Registered Patients",
      icon: "👤",
    },
    {
      title: "Doctors",
      value: stats.doctors,
      subtitle: "Active Doctors",
      icon: "🩺",
    },
    {
      title: "Visits",
      value: stats.visits,
      subtitle: "Total Visits",
      icon: "📅",
    },
    {
      title: "Tests",
      value: stats.tests,
      subtitle: "Available Tests",
      icon: "🧪",
    },
    {
      title: "Medicines",
      value: stats.medicines,
      subtitle: "Inventory Items",
      icon: "💊",
    },
  ];

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          Hospital Dashboard
        </h1>

        <p className="text-gray-500 mt-1">
          Overview of hospital operations and inventory
        </p>
      </div>

      {/* OVERVIEW CARDS */}
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
              hover:shadow-md
              transition
            "
          >
            <div className="flex items-center justify-between">
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

            <p className="text-xs text-gray-400 mt-1">
              {card.subtitle}
            </p>
          </div>
        ))}
      </div>

      {/* TODAY ACTIVITY */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold mb-5">
          Today's Activity
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

          <div className="border rounded-lg p-4 text-center">
            <p className="text-gray-500 text-sm">
              Patients
            </p>

            <p className="text-3xl font-bold text-primary mt-2">
              {today.patients}
            </p>
          </div>

          <div className="border rounded-lg p-4 text-center">
            <p className="text-gray-500 text-sm">
              Visits
            </p>

            <p className="text-3xl font-bold text-primary mt-2">
              {today.visits}
            </p>
          </div>

          <div className="border rounded-lg p-4 text-center">
            <p className="text-gray-500 text-sm mb-2">
              Status
            </p>

            <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-medium">
              Pending: {today.pending}
            </span>
          </div>

          <div className="border rounded-lg p-4 text-center">
            <p className="text-gray-500 text-sm mb-2">
              Status
            </p>

            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
              Completed: {today.completed}
            </span>
          </div>

        </div>
      </div>

      {/* LOW STOCK MEDICINES */}
      <div className="bg-white rounded-xl shadow p-6">

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            ⚠ Low Stock Medicines
          </h2>

          <span className="text-sm text-gray-500">
            Inventory Alert
          </span>
        </div>

        {lowStock.length === 0 ? (
          <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg">
            All medicines are sufficiently stocked.
          </div>
        ) : (
          <table className="w-full text-center">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3">Medicine</th>
                <th className="p-3">Available Qty</th>
                <th className="p-3">Minimum Required</th>
              </tr>
            </thead>

            <tbody>
              {lowStock.map((medicine) => (
                <tr
                  key={medicine.medicine_id}
                  className="border-b"
                >
                  <td className="p-3 font-medium">
                    {medicine.name}
                  </td>

                  <td className="p-3 text-red-600 font-bold">
                    {medicine.quantity}
                  </td>

                  <td className="p-3">
                    {medicine.min_stock}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

      </div>

    </div>
  );
}