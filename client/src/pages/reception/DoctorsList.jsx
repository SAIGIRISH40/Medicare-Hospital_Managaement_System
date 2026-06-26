import { useEffect, useState } from "react";
import API from "../../api/axios";
import { toast } from "react-toastify";
import Loader from "../../components/common/Loader";

export default function DoctorsList() {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [specializationFilter, setSpecializationFilter] = useState("");

  // 🔹 Fetch doctors
  const fetchDoctors = async () => {
    try {
      const res = await API.get("/doctors");
      setDoctors(res.data);
      setFilteredDoctors(res.data);
    } catch (err) {
      toast.error(
        err.response?.data?.error ||
          "Failed to fetch doctors ❌"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  // 🔍 Search + Filter
  useEffect(() => {
    let data = [...doctors];

    if (search) {
      data = data.filter(
        (doc) =>
          doc.name
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          doc.specialization
            .toLowerCase()
            .includes(search.toLowerCase())
      );
    }

    if (specializationFilter) {
      data = data.filter(
        (doc) =>
          doc.specialization ===
          specializationFilter
      );
    }

    setFilteredDoctors(data);
  }, [search, specializationFilter, doctors]);

  if (loading) return <Loader />;

  const specializations = [
    ...new Set(
      doctors.map((d) => d.specialization)
    ),
  ];

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">

        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Doctors
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            View available doctors and specializations
          </p>
        </div>

        <div className="flex gap-3 flex-wrap">

          {/* SEARCH */}
          <input
            type="text"
            placeholder="Search doctor..."
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
            value={specializationFilter}
            onChange={(e) =>
              setSpecializationFilter(
                e.target.value
              )
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
            <option value="">
              All Specializations
            </option>

            {specializations.map((spec, i) => (
              <option
                key={i}
                value={spec}
              >
                {spec}
              </option>
            ))}
          </select>

        </div>

      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">

        <table className="w-full text-center">

          <thead>
            <tr className="bg-green-50 text-gray-700">
              <th className="p-3">S.No</th>
              <th className="p-3">Name</th>
              <th className="p-3">
                Specialization
              </th>
              <th className="p-3">
                Experience
              </th>
              <th className="p-3">Phone</th>
            </tr>
          </thead>

          <tbody>
            {filteredDoctors.length > 0 ? (
              filteredDoctors.map(
                (doc, i) => (
                  <tr
                    key={doc.doctor_id}
                    className="
                      border-b
                      hover:bg-green-50
                      transition
                    "
                  >
                    <td className="p-3">
                      {i + 1}
                    </td>

                    <td className="p-3 font-medium">
                      {doc.name}
                    </td>

                    <td className="p-3">
                      <span
                        className="
                          bg-green-100
                          text-green-700
                          px-3
                          py-1
                          rounded-full
                          text-sm
                        "
                      >
                        {doc.specialization}
                      </span>
                    </td>

                    <td className="p-3">
                      {doc.experience} yrs
                    </td>

                    <td className="p-3">
                      {doc.phone}
                    </td>
                  </tr>
                )
              )
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="
                    p-6
                    text-gray-500
                    text-center
                  "
                >
                  No doctors found
                </td>
              </tr>
            )}
          </tbody>

        </table>

      </div>

    </div>
  );
}