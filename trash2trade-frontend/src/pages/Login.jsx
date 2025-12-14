import { useState } from "react";
import axios from "../api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("/auth/login", form);

      const { user, token } = res.data;

      // Save to context
      login(user, token);

      // 🔥 ROLE-BASED REDIRECT
      if (user.role === "buyer") {
        navigate("/buyer/dashboard");
      } else if (user.role === "seller") {
        navigate("/seller/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <form
        onSubmit={handleLogin}
        className="bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-4">Login</h2>

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full mb-4 p-2 rounded bg-gray-700"
          value={form.email}
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full mb-6 p-2 rounded bg-gray-700"
          value={form.password}
          onChange={handleChange}
        />

        <button className="w-full bg-emerald-500 py-2 rounded-lg">
          Login
        </button>
      </form>
    </div>
  );
}
