import { useState } from "react";
import API from "../../api/axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [identifier, setIdentifier] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!identifier.trim()) {
      return toast.warning("Please enter username or email");
    }

    setLoading(true);

    try {
      const res = await API.post("/auth/forgot-password", {
        identifier,
      });

      toast.success(
        res.data.message || "OTP sent successfully 📩"
      );

      localStorage.setItem(
        "resetIdentifier",
        identifier
      );

      setTimeout(() => {
        navigate("/reset-password");
      }, 1000);

    } catch (err) {
      toast.error(
        err.response?.data?.error ||
          "Failed to send OTP ❌"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bgSoft">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96">

        <h2 className="text-2xl font-bold text-center text-textPrimary mb-2">
          Forgot Password
        </h2>

        <p className="text-center text-textSecondary mb-6">
          Enter your username or email to receive OTP
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label className="block text-sm text-textSecondary mb-1">
              Username / Email
            </label>

            <input
              type="text"
              value={identifier}
              onChange={(e) =>
                setIdentifier(e.target.value)
              }
              placeholder="Enter username or email"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white p-3 rounded-lg hover:bg-secondary transition"
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        </form>

        <p className="text-center text-sm text-textSecondary mt-4">
          Remember your password?{" "}
          <a
            href="/"
            className="text-secondary hover:underline"
          >
            Login
          </a>
        </p>
      </div>
    </div>
  );
}