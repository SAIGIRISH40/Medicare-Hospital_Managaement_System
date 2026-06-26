import { useEffect, useState } from "react";
import API from "../../../api/axios";
import Loader from "../../../components/common/Loader";
import { toast } from "react-toastify";

export default function Staff() {
  const [staff, setStaff] = useState([]);
  const [filteredStaff, setFilteredStaff] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    username: "",
    name: "",
    email: "",
    phone: "",
  });

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteName, setDeleteName] = useState("");

  useEffect(() => {
    fetchStaff();
  }, []);

  useEffect(() => {
    let data = staff;

    if (search) {
      data = data.filter(
        (s) =>
          s.name?.toLowerCase().includes(search.toLowerCase()) ||
          s.email?.toLowerCase().includes(search.toLowerCase()) ||
          s.username?.toLowerCase().includes(search.toLowerCase()) ||
          s.phone?.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilteredStaff(data);
  }, [search, staff]);

  const fetchStaff = async () => {
    try {
      const res = await API.get("/staff");
      setStaff(res.data);
      setFilteredStaff(res.data);
    } catch (err) {
      console.log(err);
      toast.error("Failed to load staff");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      username: "",
      name: "",
      email: "",
      phone: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/auth/create", {
        ...form,
        role: "reception",
      });

      toast.success("Staff added successfully");

      setShowModal(false);
      resetForm();
      fetchStaff();
    } catch (err) {
      console.log(err);

      toast.error(
        err.response?.data?.error ||
          "Failed to add staff"
      );
    }
  };

  const openDelete = (staffMember) => {
    setDeleteId(staffMember.user_id);
    setDeleteName(staffMember.name);
    setDeleteOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await API.put(
        `/staff/${deleteId}/deactivate`
      );

      toast.success("Staff removed");

      setDeleteOpen(false);

      fetchStaff();
    } catch (err) {
      console.log(err);
      toast.error("Delete failed");
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          Staff Management
        </h1>
        <p className="text-gray-500">
          Manage reception staff
        </p>
      </div>

      {/* CONTROLS (Both aligned to the Right and Side-by-Side) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-end gap-4">
        
        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search name, phone, username or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="
            w-full
            sm:max-w-md
            border
            rounded-lg
            p-3
            focus:outline-none
            bg-white
            shadow-sm
          "
        />

        {/* Add Staff Button */}
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="
            bg-primary
            text-white
            px-5
            py-3
            rounded-lg
            hover:opacity-90
            whitespace-nowrap
            w-full
            sm:w-auto
            text-center
          "
        >
          + Add Staff
        </button>

      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow p-6">

        <div className="overflow-x-auto">

          <table className="w-full text-center">

            <thead>
              <tr className="bg-green-50">
                <th className="p-3">S.No</th>
                <th className="p-3">Username</th>
                <th className="p-3">Name</th>
                <th className="p-3">Phone</th>
                <th className="p-3">Email</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>

            <tbody>

              {filteredStaff.length > 0 ? (
                filteredStaff.map((s, index) => (
                  <tr
                    key={s.user_id}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="p-3 font-medium text-gray-600">
                      {index + 1}
                    </td>

                    <td className="p-3">
                      {s.username}
                    </td>

                    <td className="p-3">
                      {s.name}
                    </td>

                    <td className="p-3">
                      {s.phone || "-"}
                    </td>

                    <td className="p-3">
                      {s.email}
                    </td>

                    <td className="p-3">

                      <button
                        onClick={() => openDelete(s)}
                        className="
                          bg-red-600
                          text-white
                          px-4
                          py-2
                          rounded-lg
                          hover:bg-red-700
                        "
                      >
                        Delete
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
                    No staff found
                  </td>
                </tr>
              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* ADD STAFF MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white rounded-xl w-full max-w-lg p-6 shadow-xl">

            <h2 className="text-2xl font-bold mb-5">
              Add Staff
            </h2>

            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >

              <input
                type="text"
                placeholder="Username"
                required
                value={form.username}
                onChange={(e) =>
                  setForm({
                    ...form,
                    username: e.target.value,
                  })
                }
                className="w-full border rounded-lg p-3"
              />

              <input
                type="text"
                placeholder="Full Name"
                required
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value,
                  })
                }
                className="w-full border rounded-lg p-3"
              />

              <input
                type="email"
                placeholder="Email"
                required
                value={form.email}
                onChange={(e) =>
                  setForm({
                    ...form,
                    email: e.target.value,
                  })
                }
                className="w-full border rounded-lg p-3"
              />

              <input
                type="text"
                placeholder="Phone Number"
                required
                value={form.phone}
                onChange={(e) =>
                  setForm({
                    ...form,
                    phone: e.target.value,
                  })
                }
                className="w-full border rounded-lg p-3"
              />

              <div className="flex gap-3 pt-3">

                <button
                  type="submit"
                  className="
                    flex-1
                    bg-primary
                    text-white
                    py-3
                    rounded-lg
                  "
                >
                  Save
                </button>

                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="
                    flex-1
                    bg-gray-300
                    py-3
                    rounded-lg
                  "
                >
                  Cancel
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

      {/* DELETE MODAL */}
      {deleteOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white rounded-xl p-6 shadow-xl max-w-md w-full">

            <h2 className="text-xl font-bold mb-3">
              Delete Staff
            </h2>

            <p className="text-gray-600 mb-6">
              Are you sure you want to remove{" "}
              <strong>{deleteName}</strong> ?
            </p>

            <div className="flex gap-3">

              <button
                onClick={confirmDelete}
                className="
                  flex-1
                  bg-red-600
                  text-white
                  py-3
                  rounded-lg
                "
              >
                Delete
              </button>

              <button
                onClick={() => setDeleteOpen(false)}
                className="
                  flex-1
                  bg-gray-300
                  py-3
                  rounded-lg
                "
              >
                Cancel
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}