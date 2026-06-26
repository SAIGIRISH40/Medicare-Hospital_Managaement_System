import { useEffect, useState } from "react";
import API from "../../../api/axios";
import { toast } from "react-toastify";
import Loader from "../../../components/common/Loader";
import DeleteModal from "../../../components/common/DeleteModal";

export default function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [specializationFilter, setSpecializationFilter] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);

  // 🔥 DELETE STATES
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteName, setDeleteName] = useState("");

  const [form, setForm] = useState({
    username: "",
    email: "",
    role: "doctor",
    name: "",
    phone: "",
    specialization: "",
    experience: "",
    gender: "",
  });

  // 🔹 Fetch doctors
  const fetchDoctors = async () => {
    try {
      const res = await API.get("/doctors");
      setDoctors(res.data);
      setFilteredDoctors(res.data);
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed ❌");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  // 🔹 Search + Filter
  useEffect(() => {
    let data = [...doctors];

    if (search) {
      data = data.filter((doc) =>
        doc.name.toLowerCase().includes(search.toLowerCase()) ||
        doc.email.toLowerCase().includes(search.toLowerCase()) ||
        doc.phone.toString().includes(search)
      );
    }

    if (specializationFilter) {
      data = data.filter(
        (doc) => doc.specialization === specializationFilter
      );
    }

    setFilteredDoctors(data);
  }, [search, specializationFilter, doctors]);

  // 🔹 Input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ➕ Add
  const openAdd = () => {
    setForm({
      username: "",
      email: "",
      role: "doctor",
      name: "",
      phone: "",
      specialization: "",
      experience: "",
      gender: "",
    });
    setEditId(null);
    setShowModal(true);
  };

  // ✏️ Edit
  const openEdit = (doc) => {
    setForm({
      username: doc.username || "",
      email: doc.email || "",
      role: "doctor",
      name: doc.name,
      phone: doc.phone,
      specialization: doc.specialization,
      experience: doc.experience,
      gender: doc.gender || "",
    });
    setEditId(doc.doctor_id);
    setShowModal(true);
  };

  // ✅ Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.username || !form.email || !form.name || !form.phone || !form.specialization || !form.experience) {
      return toast.error("All fields are required ❌");
    }

    try {
      if (editId) {
        await API.put(`/doctors/${editId}`, form);
        toast.success("Doctor updated ✅");
      } else {
        await API.post("/auth/create", form);
        toast.success("Doctor added ✅");
      }

      setShowModal(false);
      fetchDoctors();
    } catch (err) {
      toast.error(err.response?.data?.error || "Error ❌");
    }
  };

  // 🔥 OPEN DELETE MODAL
  const openDelete = (doc) => {
    setDeleteId(doc.doctor_id);
    setDeleteName(doc.name);
    setDeleteOpen(true);
  };

  // 🔥 CONFIRM DELETE
  const confirmDelete = async () => {
    try {
      await API.delete(`/doctors/${deleteId}`);
      toast.success("Deleted ✅");
      setDeleteOpen(false);
      fetchDoctors();
    } catch (err) {
      console.log(err);
      toast.error("Delete failed ❌");
    }
  };

  if (loading) return <Loader />;

  const specializations = [...new Set(doctors.map((d) => d.specialization))];

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Doctors</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage clinical practitioners and medical fields
          </p>
        </div>

        <div className="flex gap-2 flex-wrap w-full md:w-auto">
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300 flex-1 md:flex-none"
          />

          <select
            value={specializationFilter}
            onChange={(e) => setSpecializationFilter(e.target.value)}
            className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300 bg-white"
          >
            <option value="">All Specializations</option>
            {specializations.map((spec, i) => (
              <option key={i} value={spec}>
                {spec}
              </option>
            ))}
          </select>

          <button
            onClick={openAdd}
            className="bg-primary text-white px-4 py-2 rounded-lg hover:opacity-90 transition"
          >
            + Add Doctor
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full text-center border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="p-3 font-semibold">S.No</th>
              <th className="p-3 font-semibold">Name</th>
              <th className="p-3 font-semibold">Email</th>
              <th className="p-3 font-semibold">Phone</th>
              <th className="p-3 font-semibold">Specialization</th>
              <th className="p-3 font-semibold">Experience</th>
              <th className="p-3 font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredDoctors.length > 0 ? (
              filteredDoctors.map((doc, i) => (
                <tr
                  key={doc.doctor_id}
                  className="border-b hover:bg-green-50/50 transition"
                >
                  <td className="p-3 text-gray-600">{i + 1}</td>
                  <td className="p-3 font-medium text-gray-800">{doc.name}</td>
                  <td className="p-3 text-gray-600">{doc.email}</td>
                  <td className="p-3 text-gray-600">{doc.phone}</td>
                  <td className="p-3 text-gray-800">{doc.specialization}</td>
                  <td className="p-3 text-gray-600">{doc.experience} yrs</td>
                  <td className="p-3">
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => openEdit(doc)}
                        className="text-blue-600 hover:text-blue-800 font-medium transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => openDelete(doc)}
                        className="text-red-600 hover:text-red-800 font-medium transition"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="p-6 text-gray-500">
                  No doctors found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 🔥 ADD / EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-2xl w-[500px] shadow-xl animate-in fade-in zoom-in-95 duration-150">
            <h2 className="text-xl font-semibold mb-6 text-center text-gray-800">
              {editId ? "Update Doctor" : "Add Doctor"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                name="username"
                placeholder="Username"
                value={form.username}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
              />
              <input
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
              />
              <input
                name="name"
                placeholder="Name"
                value={form.name}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
              />
              <input
                name="phone"
                placeholder="Phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
              />
              <input
                name="specialization"
                placeholder="Specialization"
                value={form.specialization}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
              />
              <input
                name="experience"
                type="number"
                placeholder="Experience"
                value={form.experience}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
              />

              <div>
                <label className="block text-sm text-gray-600 mb-2 font-medium">
                  Gender
                </label>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 text-gray-700 cursor-pointer select-none">
                    <input
                      type="radio"
                      name="gender"
                      value="male"
                      checked={form.gender === "male"}
                      onChange={handleChange}
                      className="accent-primary"
                    />
                    Male
                  </label>
                  <label className="flex items-center gap-2 text-gray-700 cursor-pointer select-none">
                    <input
                      type="radio"
                      name="gender"
                      value="female"
                      checked={form.gender === "female"}
                      onChange={handleChange}
                      className="accent-primary"
                    />
                    Female
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button className="flex-1 bg-primary text-white py-3 rounded-lg hover:opacity-90 transition font-medium">
                  {editId ? "Update" : "Add"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-400 text-white py-3 rounded-lg hover:bg-gray-500 transition font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 🔥 DELETE MODAL */}
      <DeleteModal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Doctor"
        message={`Are you sure you want to delete ${deleteName}?`}
      />
    </div>
  );
}