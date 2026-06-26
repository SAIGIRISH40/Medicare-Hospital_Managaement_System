import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import { toast } from "react-toastify";
import {
  MdVisibility,
  MdVisibilityOff,
} from "react-icons/md";

export default function ResetPassword() {
  const navigate = useNavigate();

  const identifier =
    localStorage.getItem("resetIdentifier");

  const user_id =
    localStorage.getItem("user_id");

  const [form, setForm] = useState({
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [show, setShow] = useState({
    new: false,
    confirm: false,
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

    if (!user_id && !identifier) {
      return toast.error("Invalid request ❌");
    }

    if (
      !user_id &&
      form.otp.trim().length !== 6
    ) {
      return toast.warning(
        "Please enter a valid OTP"
      );
    }

    if (form.newPassword.length < 6) {
      return toast.warning(
        "Password must be at least 6 characters"
      );
    }

    if (
      form.newPassword !==
      form.confirmPassword
    ) {
      return toast.error(
        "Passwords do not match ❌"
      );
    }

    setLoading(true);

    try {
      // Forgot Password Flow
      if (!user_id) {
        await API.post("/auth/reset-password", {
          identifier,
          otp: form.otp,
          newPassword: form.newPassword,
        });

        localStorage.removeItem(
          "resetIdentifier"
        );

        toast.success(
          "Password reset successfully ✅"
        );
      }

      // First Login Flow
      else {
        await API.post("/auth/set-password", {
          user_id,
          newPassword: form.newPassword,
        });

        localStorage.removeItem("user_id");

        toast.success(
          "Password set successfully ✅"
        );
      }

      setTimeout(() => {
        navigate("/");
      }, 1500);

    } catch (err) {
      toast.error(
        err.response?.data?.error ||
          "Operation failed ❌"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bgSoft">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96">

        <h2 className="text-2xl font-bold text-center text-textPrimary mb-2">
          {user_id
            ? "Set Password"
            : "Reset Password"}
        </h2>

        <p className="text-center text-textSecondary mb-6">
          {user_id
            ? "Create a secure password for your account"
            : "Enter OTP and create a new password"}
        </p>

        <form onSubmit={handleSubmit}>

          {/* OTP FIELD ONLY FOR FORGOT PASSWORD */}
          {!user_id && (
            <div className="mb-4">
              <label className="block text-sm text-textSecondary mb-1">
                OTP
              </label>

              <input
                type="text"
                name="otp"
                value={form.otp}
                onChange={handleChange}
                placeholder="Enter 6-digit OTP"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
          )}

          {/* NEW PASSWORD */}
          <div className="mb-4 relative">
            <label className="block text-sm text-textSecondary mb-1">
              New Password
            </label>

            <input
              type={show.new ? "text" : "password"}
              name="newPassword"
              value={form.newPassword}
              onChange={handleChange}
              placeholder="Enter new password"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />

            <span
              onClick={() =>
                setShow({
                  ...show,
                  new: !show.new,
                })
              }
              className="absolute right-3 top-10 cursor-pointer text-gray-500"
            >
              {show.new ? (
                <MdVisibilityOff size={22} />
              ) : (
                <MdVisibility size={22} />
              )}
            </span>
          </div>

          {/* CONFIRM PASSWORD */}
          <div className="mb-5 relative">
            <label className="block text-sm text-textSecondary mb-1">
              Confirm Password
            </label>

            <input
              type={
                show.confirm
                  ? "text"
                  : "password"
              }
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm password"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />

            <span
              onClick={() =>
                setShow({
                  ...show,
                  confirm: !show.confirm,
                })
              }
              className="absolute right-3 top-10 cursor-pointer text-gray-500"
            >
              {show.confirm ? (
                <MdVisibilityOff size={22} />
              ) : (
                <MdVisibility size={22} />
              )}
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white p-3 rounded-lg hover:bg-secondary transition"
          >
            {loading
              ? "Processing..."
              : user_id
              ? "Set Password"
              : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}