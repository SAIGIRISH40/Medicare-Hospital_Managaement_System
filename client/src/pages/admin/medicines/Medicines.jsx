import { useEffect, useState } from "react";
import API from "../../../api/axios";
import { toast } from "react-toastify";
import Loader from "../../../components/common/Loader";
import DeleteModal from "../../../components/common/DeleteModal";

export default function Medicines() {
  const [medicines, setMedicines] = useState([]);
  const [filteredMedicines, setFilteredMedicines] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [priceSort, setPriceSort] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);

  // 🔥 DELETE STATES
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteName, setDeleteName] = useState("");

  const [form, setForm] = useState({
  name: "",
  price: "",
  quantity: "",
  min_stock: "",
  current_stock: "",
  add_stock: "",
});

  // 🔹 Fetch
  const fetchMedicines = async () => {
    try {
      const res = await API.get("/medicines");
      setMedicines(res.data);
      setFilteredMedicines(res.data);
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed ❌");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicines();
  }, []);

  // 🔍 Search + 💰 Sort
  useEffect(() => {
    let data = [...medicines];

    if (search) {
      data = data.filter((m) =>
        m.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (priceSort === "asc") {
      data.sort((a, b) => a.price - b.price);
    } else if (priceSort === "desc") {
      data.sort((a, b) => b.price - a.price);
    }

    setFilteredMedicines(data);
  }, [search, priceSort, medicines]);

  // 🔁 Toggle Sort
  const togglePriceSort = () => {
    if (priceSort === "asc") setPriceSort("desc");
    else if (priceSort === "desc") setPriceSort("");
    else setPriceSort("asc");
  };

  // 🔹 Input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ➕ Open Add
 const openAdd = () => {
  setForm({
    name: "",
    price: "",
    quantity: "",
    min_stock: "",
    current_stock: "",
    add_stock: "",
  });

  setEditId(null);
  setShowModal(true);
};

  // ✏️ Open Edit
  const openEdit = (m) => {
  setForm({
    name: m.name,
    price: m.price,
    quantity: m.quantity,
    min_stock: m.min_stock,
    current_stock: m.quantity,
    add_stock: "",
  });

  setEditId(m.medicine_id);
  setShowModal(true);
};

  // ✅ Submit
  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!form.name || !form.price || !form.min_stock) {
    return toast.error("All fields required ❌");
  }

  try {
    let payload = {
      name: form.name,
      price: form.price,
      quantity: form.quantity,
      min_stock: form.min_stock,
    };

    if (editId) {
      payload.quantity =
        Number(form.current_stock) +
        Number(form.add_stock || 0);

      await API.put(`/medicines/${editId}`, payload);
      toast.success("Updated ✅");
    } else {
      if (!form.quantity) {
        return toast.error("Initial stock required ❌");
      }

      await API.post("/medicines", payload);
      toast.success("Added ✅");
    }

    setShowModal(false);
    fetchMedicines();
  } catch (err) {
    toast.error(err.response?.data?.error || "Error ❌");
  }
};

  // 🔥 OPEN DELETE MODAL
  const openDelete = (m) => {
    setDeleteId(m.medicine_id);
    setDeleteName(m.name);
    setDeleteOpen(true);
  };

  // 🔥 CONFIRM DELETE
  const confirmDelete = async () => {
    try {
      await API.delete(`/medicines/${deleteId}`);
      toast.success("Deleted ✅");
      setDeleteOpen(false);
      fetchMedicines();
    } catch (err) {
      console.log(err);
      toast.error("Delete failed ❌");
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">

      {/* Header */}
     <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

  <div>
    <h2 className="text-2xl font-bold text-gray-800">
  Medicines
</h2>

<p className="text-sm text-gray-500">
  Manage medicine inventory and stock
</p>
  </div>

  <div className="flex flex-wrap gap-3">

    <input
      type="text"
      placeholder="Search medicine name..."
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
      + Add medicine
    </button>

  </div>

</div>

      {/* TABLE */}
      <div className="overflow-x-auto">
      <table className="w-full text-center border-collapse">
        <thead>
          <tr className="bg-green-50 text-gray-700">
            <th>S.no</th>
            <th>Name</th>

            <th
              onClick={togglePriceSort}
              className="cursor-pointer hover:text-blue-600"
            >
              Price {priceSort === "asc" ? "↑" : priceSort === "desc" ? "↓" : ""}
            </th>

           <th className="p-3">Quantity</th>
<th className="p-3">Min Stock</th>
<th className="p-3">Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredMedicines.length > 0 ? (
            filteredMedicines.map((m, i) => (
              <tr
                key={m.medicine_id}
               className={`
  border-b
  hover:bg-green-50
  transition
  ${m.quantity < m.min_stock ? "bg-red-50" : ""}
`}
              >
                <td className="p-3">{i + 1}</td>
<td className="p-3 font-medium">{m.name}</td>
<td className="p-3">₹ {m.price}</td>

                <td className="p-3">
                  {m.quantity}
                  {m.quantity < m.min_stock && (
                    <span className="ml-2 text-red-600 text-xs font-bold">
                      Low
                    </span>
                  )}
                </td>

                <td className="p-3">{m.min_stock}</td>

               <td className="flex justify-center gap-2 p-2">
 <button
      onClick={() => openEdit(m)}
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
      onClick={() => openDelete(m)}
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
</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="p-6 text-gray-500">
                No medicines found
              </td>
            </tr>
          )}
        </tbody>
      </table>
      </div>

      {/* 🔥 ADD / EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-[500px]">
            <h2 className="text-2xl font-semibold text-center mb-6">
              {editId ? "Update Medicine" : "Add Medicine"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">

  <div>
    <label className="block text-sm font-medium mb-1">
      Medicine Name
    </label>

    <input
      name="name"
      value={form.name}
      onChange={handleChange}
      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
    />
  </div>

  <div className="grid grid-cols-2 gap-3">

    <div>
      <label className="block text-sm font-medium mb-1">
        Price (₹)
      </label>

      <input
        name="price"
        type="number"
        value={form.price}
        onChange={handleChange}
        className="w-full p-3 border rounded-lg"
      />
    </div>

    <div>
      <label className="block text-sm font-medium mb-1">
        Minimum Stock
      </label>

      <input
        name="min_stock"
        type="number"
        value={form.min_stock}
        onChange={handleChange}
        className="w-full p-3 border rounded-lg"
      />
    </div>

  </div>

  {!editId ? (
    <div>
      <label className="block text-sm font-medium mb-1">
        Initial Stock
      </label>

      <input
        name="quantity"
        type="number"
        value={form.quantity}
        onChange={handleChange}
        className="w-full p-3 border rounded-lg"
      />
    </div>
  ) : (
    <>
      <div className="grid grid-cols-2 gap-4">

        <div className="bg-gray-100 rounded-xl p-4">
          <p className="text-xs text-gray-500 uppercase">
            Current Stock
          </p>

          <p className="text-3xl font-bold">
            {form.current_stock}
          </p>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <p className="text-xs text-green-600 uppercase">
            New Stock
          </p>

          <p className="text-3xl font-bold text-green-700">
            {Number(form.current_stock) +
              Number(form.add_stock || 0)}
          </p>
        </div>

      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Add Stock
        </label>

        <input
          name="add_stock"
          type="number"
          min="0"
          value={form.add_stock}
          onChange={handleChange}
          placeholder="Enter newly received stock"
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>
    </>
  )}

  <div className="flex gap-3 pt-2">

    <button
      type="submit"
      className="flex-1 bg-primary text-white py-3 rounded-lg font-medium"
    >
      {editId ? "Update Medicine" : "Add Medicine"}
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

      {/* 🔥 DELETE MODAL */}
      <DeleteModal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Medicine"
        message={`Are you sure you want to delete ${deleteName}?`}
      />

    </div>
  );
}