import { useEffect, useState } from "react";
import API from "../../../api/axios";
import { toast } from "react-toastify";
import Loader from "../../../components/common/Loader";

export default function Patients() {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const fetchPatients = async () => {
    try {
      const res = await API.get("/patients");

      setPatients(res.data);
      setFilteredPatients(res.data);
    } catch (err) {
      toast.error(
        err.response?.data?.error ||
          "Failed to load patients"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  useEffect(() => {
    let data = [...patients];

    // Search
    if (search) {
      data = data.filter(
        (p) =>
          p.name
            ?.toLowerCase()
            .includes(search.toLowerCase()) ||
          p.phone
            ?.toString()
            .includes(search)
      );
    }

    const today = new Date();

    // Today
    if (filter === "today") {
      const todayStr = today
        .toISOString()
        .split("T")[0];

      data = data.filter((p) => {
        const patientDate = new Date(
          p.created_at
        )
          .toISOString()
          .split("T")[0];

        return patientDate === todayStr;
      });
    }

    // This Month
    if (filter === "month") {
      const currentMonth = today
        .toISOString()
        .slice(0, 7);

      data = data.filter((p) => {
        const patientMonth = new Date(
          p.created_at
        )
          .toISOString()
          .slice(0, 7);

        return patientMonth === currentMonth;
      });
    }

    setFilteredPatients(data);
  }, [search, filter, patients]);

  if (loading) return <Loader />;

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">

        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Patients
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            View and filter registered patients
          </p>
        </div>

        <div className="flex gap-3 flex-wrap">

          {/* SEARCH */}
          <input
            type="text"
            placeholder="Search patient..."
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

          {/* FILTER */}
          <select
            value={filter}
            onChange={(e) =>
              setFilter(e.target.value)
            }
            className="
              px-4 py-2
              border
              rounded-xl
              focus:outline-none
              focus:ring-2
              focus:ring-green-300
            "
          >
            <option value="all">
              All Time
            </option>

            <option value="today">
              Today
            </option>

            <option value="month">
              This Month
            </option>
          </select>

          {/* RESET */}
          <button
            onClick={() => {
              setSearch("");
              setFilter("all");
            }}
            className="
              bg-gray-500
              hover:bg-gray-600
              text-white
              px-4
              py-2
              rounded-xl
              transition
            "
          >
            Reset
          </button>

        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">

        <table className="w-full text-center">

          <thead>
  <tr className="bg-green-50 text-gray-700">
    <th className="p-3">S.No</th>
    <th className="p-3">Name</th>
    <th className="p-3">Phone</th>
    <th className="p-3">Gender</th>
  </tr>
</thead>

         <tbody>
  {filteredPatients.length > 0 ? (
    filteredPatients.map((p, i) => (
      <tr
        key={p.patient_id}
        className="
          border-b
          hover:bg-green-50
          transition
        "
      >
        <td className="p-3 font-medium text-gray-600">
          {i + 1}
        </td>

        <td className="p-3 font-medium">
          {p.name}
        </td>

        <td className="p-3">
          {p.phone}
        </td>

        <td className="p-3 capitalize">
          {p.gender}
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td
        colSpan="4"
        className="
          p-6
          text-center
          text-gray-500
        "
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