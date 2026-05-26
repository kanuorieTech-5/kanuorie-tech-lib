import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { registerUser, loginUser } from "../api/auth";

export default function Register() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // 🔥 VALIDATION (PRODUCTION SAFE)
  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.password) {
      return "All fields are required";
    }
    if (formData.password.length < 6) {
      return "Password must be at least 6 characters";
    }
    return null;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);

      // 1️⃣ Register user
      await registerUser(formData);

      // 2️⃣ Auto login
      const loginData = await loginUser({
        email: formData.email,
        password: formData.password,
      });

      // 3️⃣ Save session
      login(loginData);

      // 4️⃣ Redirect
      navigate("/Home");

    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-indigo-700">
      <form
        onSubmit={handleRegister}
        className="backdrop-blur-lg bg-white/10 border border-white/20 p-8 rounded-2xl shadow-xl w-96 text-white"
      >
        <h1 className="text-2xl font-bold mb-6 text-center">
          Create Account
        </h1>

        {/* Name */}
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-3 rounded-xl bg-white/20 border border-white/30 mb-4"
        />

        {/* Email */}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-3 rounded-xl bg-white/20 border border-white/30 mb-4"
        />

        {/* Password */}
        <div className="relative mb-4">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-3 rounded-xl bg-white/20 border border-white/30 pr-12"
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        {/* Error */}
        {error && (
          <p className="text-red-300 text-sm mb-4 text-center">
            {error}
          </p>
        )}

        {/* Submit */}
        <button
          type="submit"
          className="bg-white text-purple-700 w-full py-3 rounded-xl font-semibold hover:bg-gray-200 transition"
        >
          {loading ? "Creating account..." : "Sign Up"}
        </button>

        {/* Login */}
        <p className="text-sm text-center mt-4">
          Already have an account?{" "}
          <Link to="/login" className="underline font-medium">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
