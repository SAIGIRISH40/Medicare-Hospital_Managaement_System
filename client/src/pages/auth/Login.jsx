import { useState } from "react";
import API from "../../api/axios";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const res = await API.post("/auth/login", form);

    // First-time login
    if (res.data.firstLogin) {
  localStorage.setItem("user_id", res.data.user_id);

  toast.info("Please set your password");

  setTimeout(() => {
    window.location.href = "/reset-password";
  }, 1000);

  return;
}

    // Normal login
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));

    toast.success("Login successful ✅");

    setTimeout(() => {
      window.location.href = `/${res.data.user.role}/dashboard`;
    }, 1000);

  } catch (err) {
    toast.error(err.response?.data?.error || "Login failed ❌");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-bgSoft">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96">
        {/* Title */}
        <h2 className="text-2xl font-bold text-center text-textPrimary mb-2">
          Hospital Management
        </h2>
        <p className="text-center text-textSecondary mb-6">
          Login to your account
        </p>

        <form onSubmit={handleLogin}>
          {/* Username */}
          <div className="mb-4">
            <label className="block text-sm text-textSecondary mb-1">
              Username
            </label>
            <input
              type="text"
              name="username"
              placeholder="Enter username"
              value={form.username}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          {/* Password */}
          <div className="mb-2 relative">
            <label className="block text-sm text-textSecondary mb-1">
              Password
            </label>

            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter password"
              value={form.password}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />

            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-10 cursor-pointer text-gray-500"
            >
              {showPassword ? (
                <MdVisibilityOff size={22} />
              ) : (
                <MdVisibility size={22} />
              )}
            </span>
          </div>

          {/* Forgot Password */}
          <div className="text-right mb-4">
            <Link
              to="/forgot-password"
              className="text-sm text-secondary hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white p-3 rounded-lg hover:bg-secondary transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
