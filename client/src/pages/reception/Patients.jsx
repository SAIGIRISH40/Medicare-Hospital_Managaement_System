import { useEffect, useState } from "react";
import API from "../../api/axios";
import { toast } from "react-toastify";
import Loader from "../../components/common/Loader";

export default function Patients() {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: "",
    phone: "",
    address: "",
  });

  const fetchPatients = async () => {
    try {
      const res = await API.get("/patients");
      setPatients(res.data);
      setFilteredPatients(res.data);
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed ❌");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  useEffect(() => {
    let data = [...patients];

    if (search.trim()) {
      const keyword = search.toLowerCase();

      data = data.filter(
        (p) =>
          p.name?.toLowerCase().includes(keyword) ||
          p.phone?.toString().includes(keyword)
      );
    }

    setFilteredPatients(data);
  }, [search, patients]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const openAdd = () => {
    setForm({
      name: "",
      age: "",
      gender: "",
      phone: "",
      address: "",
    });

    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.name ||
      !form.age ||
      !form.gender ||
      !form.phone
    ) {
      return toast.error("Required fields missing ❌");
    }

    try {
      await API.post("/patients", form);

      toast.success("Patient added successfully ✅");

      setShowModal(false);
      fetchPatients();
    } catch (err) {
      toast.error(
        err.response?.data?.error || "Something went wrong ❌"
      );
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Patients
          </h2>

          <p className="text-sm text-gray-500">
            Manage patient records and registrations
          </p>
        </div>

        <div className="flex flex-wrap gap-3">

          <input
            type="text"
            placeholder="Search by name or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
              px-4 py-2
              border
              rounded-xl
              focus:outline-none
              focus:ring-2
              focus:ring-green-300
            "
          />

          <button
            onClick={openAdd}
            className="
              bg-primary
              text-white
              px-5
              py-2
              rounded-xl
              hover:opacity-90
              transition
            "
          >
            + Add Patient
          </button>

        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">

        <table className="w-full text-center border-collapse">

          <thead>
            <tr className="bg-green-50 text-gray-700">
              <th className="p-3">S.No</th>
              <th className="p-3">Name</th>
              <th className="p-3">Age</th>
              <th className="p-3">Gender</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Address</th>
            </tr>
          </thead>

          <tbody>
            {filteredPatients.length > 0 ? (
              filteredPatients.map((patient, index) => (
                <tr
                  key={patient.patient_id}
                  className="
                    border-b
                    hover:bg-green-50
                    transition
                  "
                >
                  <td className="p-3">
                    {index + 1}
                  </td>

                  <td className="p-3 font-medium">
                    {patient.name}
                  </td>

                  <td className="p-3">
                    {patient.age}
                  </td>

                  <td className="p-3 capitalize">
                    {patient.gender}
                  </td>

                  <td className="p-3">
                    {patient.phone}
                  </td>

                  <td className="p-3">
                    {patient.address || "—"}
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

      {/* ADD PATIENT MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">

          <div className="bg-white w-[500px] rounded-2xl shadow-xl p-8">

            <h2 className="text-2xl font-semibold text-center mb-6">
              Add Patient
            </h2>

            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >

              <input
                type="text"
                name="name"
                placeholder="Patient Name"
                value={form.name}
                onChange={handleChange}
                className="w-full p-3 border rounded-xl"
              />

              <input
                type="number"
                name="age"
                placeholder="Age"
                value={form.age}
                onChange={handleChange}
                className="w-full p-3 border rounded-xl"
              />

              {/* GENDER RADIO */}
              <div>
                <label className="block mb-2 font-medium text-gray-700">
                  Gender
                </label>

                <div className="flex gap-6">

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      value="male"
                      checked={form.gender === "male"}
                      onChange={handleChange}
                    />
                    Male
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      value="female"
                      checked={form.gender === "female"}
                      onChange={handleChange}
                    />
                    Female
                  </label>

                </div>
              </div>

              <input
                type="text"
                name="phone"
                placeholder="Phone Number"
                value={form.phone}
                onChange={handleChange}
                className="w-full p-3 border rounded-xl"
              />

              <textarea
                name="address"
                placeholder="Address (Optional)"
                value={form.address}
                onChange={handleChange}
                rows="3"
                className="w-full p-3 border rounded-xl resize-none"
              />

              <div className="flex gap-3 pt-2">

                <button
                  type="submit"
                  className="
                    flex-1
                    bg-primary
                    text-white
                    py-3
                    rounded-xl
                    hover:opacity-90
                  "
                >
                  Add Patient
                </button>

                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="
                    flex-1
                    bg-gray-400
                    text-white
                    py-3
                    rounded-xl
                  "
                >
                  Cancel
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
}