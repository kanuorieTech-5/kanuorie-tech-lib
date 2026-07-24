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

    console.log("REGISTER CLICKED");

    setError("");

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      console.log("Sending register request");

      await registerUser(formData);

      console.log("Registration successful");

      const loginData = await loginUser({
        email: formData.email,
        password: formData.password,
      });

      login(loginData);

      navigate("/home");

    } catch (err) {
      console.error(err);

      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Registration failed"
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

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-3 rounded-xl mb-4 text-black"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-3 rounded-xl mb-4 text-black"
        />

        <div className="relative mb-4">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-3 rounded-xl pr-14 text-black"
          />

          <button
            type="button"
            onClick={() =>
              setShowPassword((v) => !v)
            }
            className="absolute right-3 top-1/2 -translate-y-1/2 text-black"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        {error && (
          <p className="text-red-300 text-sm mb-3">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="bg-white text-purple-700 w-full py-3 rounded-xl"
        >
          {loading
            ? "Creating account..."
            : "Sign Up"}
        </button>

        <p className="mt-4 text-center">
          Already have an account?{" "}
          <Link
            to="/login"
            className="underline"
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}