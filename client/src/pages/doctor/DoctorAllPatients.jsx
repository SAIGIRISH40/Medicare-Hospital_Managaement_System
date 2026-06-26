import { useEffect, useState } from "react";
import API from "../../api/axios";
import Loader from "../../components/common/Loader";
import { toast } from "react-toastify";

export default function DoctorAllPatients() {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] =
    useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const res = await API.get(
        "/visits/doctor/all-patients"
      );

      setPatients(res.data);
      setFilteredPatients(res.data);
    } catch (err) {
      console.log(err);
      toast.error("Failed to load patients");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let data = patients;

    if (search) {
      data = data.filter(
        (p) =>
          p.name
            ?.toLowerCase()
            .includes(search.toLowerCase()) ||
          p.phone
            ?.toLowerCase()
            .includes(search.toLowerCase())
      );
    }

    setFilteredPatients(data);
  }, [search, patients]);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  if (loading) return <Loader />;

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 space-y-6">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            My Patients
          </h1>

          <p className="text-sm text-gray-500">
            All patients treated by you
          </p>
        </div>

        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Search patient name or phone..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="
              px-4 py-2
              border
              rounded-xl
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
              <th className="p-3">Patient</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Age</th>
              <th className="p-3">Gender</th>
              <th className="p-3">Last Visit</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>

          <tbody>
            {filteredPatients.length > 0 ? (
              filteredPatients.map((patient) => (
                <tr
                  key={patient.patient_id}
                  className="
                    border-b
                    hover:bg-green-50
                    transition
                  "
                >
                  <td className="p-3 font-medium">
                    {patient.name}
                  </td>

                  <td className="p-3">
                    {patient.phone}
                  </td>

                  <td className="p-3">
                    {patient.age}
                  </td>

                  <td className="p-3 capitalize">
                    {patient.gender}
                  </td>

                  <td className="p-3">
                    {formatDate(patient.date)}
                  </td>

                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        patient.status === "Completed"
                          ? "bg-green-100 text-green-700"
                          : patient.status ===
                            "In Consultation"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {patient.status}
                    </span>
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