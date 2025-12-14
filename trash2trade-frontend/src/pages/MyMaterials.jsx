import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";

export default function MyMaterials() {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchMyMaterials = async () => {
    try {
      const res = await api.get("/materials/my");
      setMaterials(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load your materials");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyMaterials();
  }, []);

  const handleDelete = async (id) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this material?"
    );
    if (!confirm) return;

    try {
      await api.delete(`/materials/${id}`);
      setMaterials((prev) => prev.filter((m) => m._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  if (loading) {
    return <p className="text-white p-8">Loading your materials...</p>;
  }

  return (
    <div className="p-8 text-white max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">My Materials</h1>

      {materials.length === 0 ? (
        <p className="text-gray-400">You haven’t listed any materials yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {materials.map((mat) => (
            <div
              key={mat._id}
              className="bg-gray-800 p-5 rounded shadow hover:shadow-emerald-500/20 transition"
            >
              {/* VIEW DETAILS */}
              <Link to={`/material/${mat._id}`}>
                <h2 className="text-xl font-semibold">{mat.name}</h2>
                <p className="text-gray-400 mt-1">
                  {mat.quantity} {mat.unit} • {mat.location || "Unknown"}
                </p>
                <p className="mt-2 font-bold text-emerald-400">
                  ₹{mat.basePrice}
                </p>

                <div className="mt-2">
                  {mat.isActive === false ? (
                    <span className="text-red-400 font-semibold">
                      Sold / Inactive
                    </span>
                  ) : (
                    <span className="text-green-400 font-semibold">Active</span>
                  )}
                </div>
              </Link>

              {/* ACTIONS */}
              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => navigate(`/edit-material/${mat._id}`)}
                  className="flex-1 bg-blue-600 py-2 rounded hover:bg-blue-700"
                >
                  ✏️ Edit
                </button>

                <button
                  onClick={() => handleDelete(mat._id)}
                  className="flex-1 bg-red-600 py-2 rounded hover:bg-red-700"
                >
                  🗑 Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
