import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import { toast } from "react-toastify";
import Loader from "../../components/common/Loader";

export default function DoctorPatients() {
  const navigate = useNavigate();

  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  // format date safely
  const formatDate = (d) => {
    if (!d) return "—";
    const dateObj = new Date(d);
    if (isNaN(dateObj.getTime())) return "Invalid";
    return dateObj.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // fetch visits
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await API.get("/visits/doctor");

        const activePatients = res.data.filter(
          (p) =>
            p.status === "Pending" ||
            p.status === "In Consultation"
        );

        setPatients(activePatients);
        setFilteredPatients(activePatients);
      } catch (err) {
        console.log(err);
        toast.error("Failed to fetch patients");
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  // search filter
  useEffect(() => {
    let data = patients;

    if (search) {
      data = data.filter((p) =>
        (p.patient_name || "")
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        (p.phone || "")
          .toLowerCase()
          .includes(search.toLowerCase())
      );
    }

    setFilteredPatients(data);
  }, [search, patients]);

  if (loading) return <Loader />;

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 space-y-6">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Patients To Treat
          </h2>

          <p className="text-sm text-gray-500">
            Pending and ongoing consultations
          </p>
        </div>

        <div className="flex gap-3 w-full md:w-auto">

          <input
            type="text"
            placeholder="Search patient name or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
              px-4 py-2
              border
              rounded-xl
              w-full md:w-80
              focus:outline-none
              focus:ring-2
              focus:ring-green-300
            "
          />

        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">

        <table className="w-full text-center border-collapse">

          <thead>
            <tr className="bg-green-50 text-gray-700">
              <th className="p-3">#</th>
              <th className="p-3">Patient</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Date</th>
              <th className="p-3">Status</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredPatients.length > 0 ? (
              filteredPatients.map((p, i) => (
                <tr
                  key={p.visit_id}
                  className="
                    border-b
                    hover:bg-green-50
                    transition
                  "
                >
                  <td className="p-3">{i + 1}</td>

                  <td className="p-3 font-medium">
                    {p.patient_name}
                  </td>

                  <td className="p-3">
                    {p.phone || "—"}
                  </td>

                  <td className="p-3">
                    {formatDate(p.date)}
                  </td>

                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        p.status === "Completed"
                          ? "bg-green-100 text-green-700"
                          : p.status === "In Consultation"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>

                  <td className="p-3">
                    <button
                      onClick={() =>
                        navigate(
                          `/doctor/consultation/${p.visit_id}`
                        )
                      }
                      className="
                        bg-primary
                        text-white
                        px-4 py-1.5
                        rounded-xl
                        hover:opacity-90
                        transition
                      "
                    >
                      Consult
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="p-6 text-gray-500"
                >
                  No patients found
                </td>
              </tr>
            )}
          </tbody>

        </table>
      </div>
    </div>
  );
}