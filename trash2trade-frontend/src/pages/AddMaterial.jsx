import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api";

export default function AddMaterial() {
  const navigate = useNavigate();
  const { id } = useParams(); // 👈 if present → EDIT MODE
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    name: "",
    type: "Metal",
    description: "",
    quantity: "",
    unit: "Tons",
    basePrice: "",
    location: "",
    estimatedCo2Savings: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔁 Load material for edit
  useEffect(() => {
    if (isEdit) {
      API.get(`/materials/${id}`).then((res) => {
        const m = res.data;
        setForm({
          name: m.name,
          type: m.type,
          description: m.description,
          quantity: m.quantity,
          unit: m.unit,
          basePrice: m.basePrice,
          location: m.location,
          estimatedCo2Savings: m.estimatedCo2Savings || "",
        });
      });
    }
  }, [id, isEdit]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const payload = {
      ...form,
      quantity: Number(form.quantity),
      basePrice: Number(form.basePrice),
      estimatedCo2Savings: Number(form.estimatedCo2Savings || 0),
    };

    try {
      if (isEdit) {
        await API.put(`/materials/${id}`, payload);
      } else {
        await API.post("/materials", payload);
      }
      navigate("/my-materials");
    } catch (err) {
      setError(err.response?.data?.message || "Save failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-slate-800 p-6 rounded-xl text-white">
      <h1 className="text-2xl font-bold mb-4">
        {isEdit ? "Edit Material" : "Add New Material"}
      </h1>

      {error && <p className="text-red-400 mb-2">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-3 text-sm">
        {[
          ["name", "Material Name"],
          ["description", "Description"],
          ["location", "Location"],
        ].map(([key, label]) => (
          <div key={key}>
            <label>{label}</label>
            <input
              name={key}
              value={form[key]}
              onChange={handleChange}
              className="w-full p-2 bg-slate-900 rounded"
              required
            />
          </div>
        ))}

        <div className="grid grid-cols-2 gap-2">
          <input
            name="quantity"
            type="number"
            value={form.quantity}
            onChange={handleChange}
            className="p-2 bg-slate-900 rounded"
            placeholder="Quantity"
            required
          />
          <input
            name="basePrice"
            type="number"
            value={form.basePrice}
            onChange={handleChange}
            className="p-2 bg-slate-900 rounded"
            placeholder="Price"
            required
          />
        </div>

        <button
          disabled={loading}
          className="w-full bg-emerald-400 text-slate-900 py-2 rounded font-semibold"
        >
          {loading ? "Saving..." : isEdit ? "Update Material" : "Create Listing"}
        </button>
      </form>
    </div>
  );
}
