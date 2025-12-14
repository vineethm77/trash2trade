import { useState } from "react";
import axios from "../api";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    companyName: "",
    email: "",
    password: "",
    role: "buyer", // ✅ DEFAULT
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await axios.post("/auth/register", form);
      alert("Registration successful! Please login.");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <form
        onSubmit={handleRegister}
        className="bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6">Create Account</h2>

        {/* NAME */}
        <input
          type="text"
          name="name"
          placeholder="Name"
          className="w-full mb-4 p-2 rounded bg-gray-700"
          value={form.name}
          onChange={handleChange}
          required
        />

        {/* COMPANY (OPTIONAL) */}
        <input
          type="text"
          name="companyName"
          placeholder="Company Name (optional)"
          className="w-full mb-4 p-2 rounded bg-gray-700"
          value={form.companyName}
          onChange={handleChange}
        />

        {/* EMAIL */}
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full mb-4 p-2 rounded bg-gray-700"
          value={form.email}
          onChange={handleChange}
          required
        />

        {/* PASSWORD */}
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full mb-4 p-2 rounded bg-gray-700"
          value={form.password}
          onChange={handleChange}
          required
        />

        {/* ROLE SELECT */}
        <label className="block mb-2 text-sm text-gray-300">
          Register as
        </label>
        <select
          name="role"
          className="w-full mb-6 p-2 rounded bg-gray-700"
          value={form.role}
          onChange={handleChange}
        >
          <option value="buyer">Buyer</option>
          <option value="seller">Seller</option>
        </select>

        <button className="w-full bg-emerald-500 py-2 rounded-lg hover:bg-emerald-600">
          Register
        </button>
      </form>
    </div>
  );
}
