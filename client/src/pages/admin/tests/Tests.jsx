import { useEffect, useState } from "react";
import API from "../../../api/axios";
import { toast } from "react-toastify";
import Loader from "../../../components/common/Loader";
import DeleteModal from "../../../components/common/DeleteModal";

export default function Tests() {
  const [tests, setTests] = useState([]);
  const [filteredTests, setFilteredTests] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);

  // 🔥 DELETE STATES
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteName, setDeleteName] = useState("");

  const [form, setForm] = useState({
    name: "",
    price: "",
  });

  // 🔹 Fetch
  const fetchTests = async () => {
    try {
      const res = await API.get("/tests");
      setTests(res.data);
      setFilteredTests(res.data);
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed ❌");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTests();
  }, []);

  // 🔍 Search + 💰 Sort
  useEffect(() => {
    let data = [...tests];

    if (search) {
      data = data.filter((t) =>
        t.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (sortOrder === "asc") {
      data.sort((a, b) => a.price - b.price);
    } else if (sortOrder === "desc") {
      data.sort((a, b) => b.price - a.price);
    }

    setFilteredTests(data);
  }, [search, sortOrder, tests]);

  // 🔁 Toggle Sort
  const togglePriceSort = () => {
    if (sortOrder === "asc") setSortOrder("desc");
    else if (sortOrder === "desc") setSortOrder("");
    else setSortOrder("asc");
  };

  // 🔹 Input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ➕ Add
  const openAdd = () => {
    setForm({ name: "", price: "" });
    setEditId(null);
    setShowModal(true);
  };

  // ✏️ Edit
  const openEdit = (t) => {
    setForm({
      name: t.name,
      price: t.price,
    });
    setEditId(t.test_id);
    setShowModal(true);
  };

  // ✅ Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.price) {
      return toast.error("All fields required ❌");
    }

    try {
      if (editId) {
        await API.put(`/tests/${editId}`, form);
        toast.success("Updated ✅");
      } else {
        await API.post("/tests", form);
        toast.success("Added ✅");
      }

      setShowModal(false);
      fetchTests();
    } catch (err) {
      toast.error(err.response?.data?.error || "Error ❌");
    }
  };

  // 🔥 OPEN DELETE
  const openDelete = (test) => {
    setDeleteId(test.test_id);
    setDeleteName(test.name);
    setDeleteOpen(true);
  };

  // 🔥 CONFIRM DELETE
  const confirmDelete = async () => {
    try {
      await API.delete(`/tests/${deleteId}`);
      toast.success("Deleted ✅");
      setDeleteOpen(false);
      fetchTests();
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.error || "Delete failed ❌");
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">

     
      {/* HEADER */}
<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

  <div>
    <h2 className="text-2xl font-bold text-gray-800">
      Tests
    </h2>

    <p className="text-sm text-gray-500">
      Manage laboratory tests and pricing
    </p>
  </div>

  <div className="flex flex-wrap gap-3">

    <input
      type="text"
      placeholder="Search test name..."
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
      + Add Test
    </button>

  </div>

</div>

      {/* TABLE */}
      <div className="overflow-x-auto">

  <table className="w-full text-center border-collapse">
        <thead>
  <tr className="bg-green-50 text-gray-700">

    <th className="p-3">S.No</th>

    <th className="p-3">
      Test Name
    </th>

    <th
      onClick={togglePriceSort}
      className="
        p-3
        cursor-pointer
        select-none
      "
    >
      Price
      {sortOrder === "asc"
        ? " ↑"
        : sortOrder === "desc"
        ? " ↓"
        : ""}
    </th>

    <th className="p-3">
      Actions
    </th>

  </tr>
</thead>

        <tbody>
          {filteredTests.length > 0 ? (
            filteredTests.map((t, i) => (
              <tr  key={t.test_id} className="  border-b  hover:bg-green-50 transition ">
               <td className="p-3">
  {i + 1}
</td>

<td className="p-3 font-medium">
  {t.name}
</td>

<td className="p-3 font-semibold text-primary">
  ₹ {t.price}
</td>

<td className="p-3">
  <div className="flex justify-center gap-2">

    <button
      onClick={() => openEdit(t)}
      className="
        px-3 py-1
        bg-blue-100
        text-blue-700
        rounded-lg
        hover:bg-blue-200
      "
    >
      Edit
    </button>

    <button
      onClick={() => openDelete(t)}
      className="
        px-3 py-1
        bg-red-100
        text-red-700
        rounded-lg
        hover:bg-red-200
      "
    >
      Delete
    </button>

  </div>
</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="p-4 text-gray-500">
                No tests found
              </td>
            </tr>
          )}
        </tbody>
        </table>

</div>
      {/* ADD / EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">

          <div className="bg-white p-8 rounded-2xl w-[400px] shadow-xl">

            <h2 className="text-xl font-semibold mb-6 text-center">
              {editId ? "Update Test" : "Add Test"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">

              <input
                name="name"
                placeholder="Test Name"
                value={form.name}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg"
              />

              <input
                name="price"
                type="number"
                placeholder="Price"
                value={form.price}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg"
              />

              <div className="flex gap-3">
                <button className="flex-1 bg-primary text-white py-3 rounded-lg">
                  {editId ? "Update" : "Add"}
                </button>

                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-400 text-white py-3 rounded-lg"
                >
                  Cancel
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      <DeleteModal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Test"
        message={`Are you sure you want to delete ${deleteName}?`}
      />

    </div>
  );
}