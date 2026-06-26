import { useEffect, useState } from "react";
import API from "../../../api/axios";
import Loader from "../../../components/common/Loader";
import { toast } from "react-toastify";

export default function AdminVisits() {
  const [loading, setLoading] = useState(true);
  const [visits, setVisits] = useState([]);
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // 🔹 Filter States
  const [search, setSearch] = useState("");
  const [doctorFilter, setDoctorFilter] = useState("");
  const [periodFilter, setPeriodFilter] = useState("");
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    fetchVisits();
  }, []);

  // 🔹 Fetch Data (Visits + Doctors)
  const fetchVisits = async () => {
    try {
      const [visitsRes, doctorsRes] = await Promise.all([
        API.get("/visits"),
        API.get("/doctors"),
      ]);

      setVisits(visitsRes.data);
      setDoctors(doctorsRes.data);
    } catch (err) {
      console.log(err);
      toast.error("Failed to load visits");
    } finally {
      setLoading(false);
    }
  };

  const openVisit = async (visitId) => {
    try {
      const res = await API.get(`/visits/${visitId}/details`);
      setSelectedVisit(res.data);
      setShowModal(true);
    } catch (err) {
      console.log(err);
      toast.error("Failed to load visit details");
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // 🔹 Filtering Pipeline
  const filteredVisits = visits.filter((visit) => {
    const matchesSearch = visit.patient_name
      ?.toLowerCase()
      .includes(search.toLowerCase());

    const matchesDoctor = !doctorFilter || visit.doctor_name === doctorFilter;

    let matchesPeriod = true;

    if (periodFilter) {
      const visitDate = new Date(visit.date);
      const today = new Date();

      if (periodFilter === "today") {
        matchesPeriod = visitDate.toDateString() === today.toDateString();
      }

      if (periodFilter === "week") {
        const weekAgo = new Date();
        weekAgo.setDate(today.getDate() - 7);
        matchesPeriod = visitDate >= weekAgo;
      }

      if (periodFilter === "month") {
        matchesPeriod =
          visitDate.getMonth() === today.getMonth() &&
          visitDate.getFullYear() === today.getFullYear();
      }
    }

    return matchesSearch && matchesDoctor && matchesPeriod;
  });

  if (loading) return <Loader />;

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      {/* HEADER WITH FILTERS PLACED RIGHT */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">All Visits</h1>
          <p className="text-sm text-gray-500 mt-0.5">Complete visit records</p>
        </div>

        <div className="flex gap-2 flex-wrap w-full md:w-auto">
          <input
            type="text"
            placeholder="Search patient..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300 flex-1 md:flex-none min-w-[160px]"
          />

          <select
            value={doctorFilter}
            onChange={(e) => setDoctorFilter(e.target.value)}
            className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300 bg-white flex-1 md:flex-none min-w-[150px]"
          >
            <option value="">All Doctors</option>
            {doctors.map((doctor) => (
              <option key={doctor.doctor_id} value={doctor.name}>
                {doctor.name}
              </option>
            ))}
          </select>

          <select
            value={periodFilter}
            onChange={(e) => setPeriodFilter(e.target.value)}
            className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300 bg-white flex-1 md:flex-none min-w-[130px]"
          >
            <option value="">All Time</option>
            <option value="today">Today</option>
            <option value="week">Last 7 Days</option>
            <option value="month">This Month</option>
          </select>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full text-center border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="p-3 font-semibold">Patient</th>
              <th className="p-3 font-semibold">Doctor</th>
              <th className="p-3 font-semibold">Date</th>
              <th className="p-3 font-semibold">Status</th>
              <th className="p-3 font-semibold">Bill</th>
              <th className="p-3 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredVisits.length > 0 ? (
              filteredVisits.map((visit) => (
                <tr
                  key={visit.visit_id}
                  className="border-b hover:bg-green-50/50 transition"
                >
                  <td className="p-3 font-medium text-gray-800">
                    {visit.patient_name}
                  </td>
                  <td className="p-3 text-gray-700">{visit.doctor_name}</td>
                  <td className="p-3 text-gray-600">
                    {formatDate(visit.date)}
                  </td>
                  <td className="p-3">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        visit.status === "Completed"
                          ? "bg-green-100 text-green-700"
                          : visit.status === "In Consultation"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {visit.status}
                    </span>
                  </td>
                  <td className="p-3 font-semibold text-gray-800">
                    ₹{visit.total_bill || 0}
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => openVisit(visit.visit_id)}
                      className="text-blue-600 hover:text-blue-800 font-medium transition"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="p-6 text-gray-500">
                  No visits found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* DETAILS MODAL */}
      {showModal && selectedVisit && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl p-8 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <h2 className="text-xl font-bold text-gray-800">Visit Details</h2>
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg font-medium transition"
              >
                Close
              </button>
            </div>

            {/* Visit Summary fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl mb-6 text-sm text-gray-700">
              <p>
                <strong className="text-gray-900">Patient:</strong>{" "}
                {selectedVisit.visit.patient_name}
              </p>
              <p>
                <strong className="text-gray-900">Doctor:</strong>{" "}
                {selectedVisit.visit.doctor_name}
              </p>
              <p>
                <strong className="text-gray-900">Status:</strong>{" "}
                <span
                  className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ml-1 ${
                    selectedVisit.visit.status === "Completed"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {selectedVisit.visit.status}
                </span>
              </p>
              <p>
                <strong className="text-gray-900">Diagnosis:</strong>{" "}
                {selectedVisit.visit.diagnosis || "N/A"}
              </p>
              <p className="md:col-span-2">
                <strong className="text-gray-900">Notes:</strong>{" "}
                {selectedVisit.visit.notes || "None"}
              </p>
            </div>

            {/* Two Column Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Medicines column */}
              <div>
                <h3 className="font-semibold text-gray-800 text-base mb-3">
                  Medicines
                </h3>
                {selectedVisit?.medicines?.length > 0 ? (
                  <div className="space-y-2">
                    {selectedVisit.medicines.map((med) => (
                      <div
                        key={med.medicine_id}
                        className="bg-blue-50/70 border border-blue-100 p-3 rounded-lg"
                      >
                        <p className="font-medium text-blue-900">{med.name}</p>
                        <p className="text-xs text-blue-700 mt-0.5">
                          Qty: {med.quantity}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg border border-dashed">
                    No medicines prescribed
                  </p>
                )}
              </div>

              {/* Tests column */}
              <div>
                <h3 className="font-semibold text-gray-800 text-base mb-3">
                  Tests
                </h3>
                {selectedVisit?.tests?.length > 0 ? (
                  <div className="space-y-2">
                    {selectedVisit.tests.map((test) => (
                      <div
                        key={test.test_id}
                        className="bg-green-50/70 border border-green-100 p-3 rounded-lg"
                      >
                        <p className="font-medium text-green-900 font-medium">
                          {test.name}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg border border-dashed">
                    No tests prescribed
                  </p>
                )}
              </div>
            </div>

            <hr className="my-6 border-gray-200" />

            {/* Billing breakdown */}
            <div>
              <h3 className="font-semibold text-gray-800 text-base mb-3">
                Billing Breakdown
              </h3>
              <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm text-gray-600 border">
                <div className="flex justify-between">
                  <span>Consultation Fee</span>
                  <span>₹{selectedVisit.visit.consultation_fee}</span>
                </div>
                <div className="flex justify-between">
                  <span>Medicine Fee</span>
                  <span>₹{selectedVisit.visit.medicine_fee}</span>
                </div>
                <div className="flex justify-between pb-2 border-b">
                  <span>Test Fee</span>
                  <span>₹{selectedVisit.visit.test_fee}</span>
                </div>
                <div className="flex justify-between font-bold text-base text-gray-900 pt-1">
                  <span>Total Bill</span>
                  <span className="text-primary">
                    ₹{selectedVisit.visit.total_bill}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}