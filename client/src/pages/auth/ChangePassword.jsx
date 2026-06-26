import { useState } from "react";
import API from "../../api/axios";
import { toast } from "react-toastify";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";

export default function ChangePassword() {
  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
  });

  const [show, setShow] = useState({
    old: false,
    new: false,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.newPassword.length < 6) {
      return toast.warning("Password must be at least 6 characters");
    }

    setLoading(true);

    try {
      await API.post("/auth/change-password", form);

      toast.success("Password changed successfully ✅");

      setForm({
        oldPassword: "",
        newPassword: "",
      });
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to change password ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bgSoft">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96">

        {/* Title */}
        <h2 className="text-2xl font-bold text-center text-textPrimary mb-2">
          Change Password
        </h2>
        <p className="text-center text-textSecondary mb-6">
          Update your account password
        </p>

        <form onSubmit={handleSubmit}>

          {/* Old Password */}
          <div className="mb-4 relative">
            <label className="block text-sm text-textSecondary mb-1">
              Old Password
            </label>

            <input
              type={show.old ? "text" : "password"}
              name="oldPassword"
              placeholder="Enter old password"
              value={form.oldPassword}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />

            <span
              onClick={() => setShow({ ...show, old: !show.old })}
              className="absolute right-3 top-10 cursor-pointer text-gray-500"
            >
              {show.old ? <MdVisibilityOff size={22} /> : <MdVisibility size={22} />}
            </span>
          </div>

          {/* New Password */}
          <div className="mb-5 relative">
            <label className="block text-sm text-textSecondary mb-1">
              New Password
            </label>

            <input
              type={show.new ? "text" : "password"}
              name="newPassword"
              placeholder="Enter new password"
              value={form.newPassword}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />

            <span
              onClick={() => setShow({ ...show, new: !show.new })}
              className="absolute right-3 top-10 cursor-pointer text-gray-500"
            >
              {show.new ? <MdVisibilityOff size={22} /> : <MdVisibility size={22} />}
            </span>
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white p-3 rounded-lg hover:bg-secondary transition"
          >
            {loading ? "Updating..." : "Change Password"}
          </button>
        </form>
      </div>
    </div>
  );
}