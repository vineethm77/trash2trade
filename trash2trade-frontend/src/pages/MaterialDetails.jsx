import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api";

export default function MaterialDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [material, setMaterial] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load material by ID
  useEffect(() => {
    API.get(`/materials/${id}`)
      .then((res) => {
        setMaterial(res.data);
      })
      .catch(() => {
        alert("Material not found");
        navigate("/marketplace");
      });
  }, [id, navigate]);

  if (!material) return <p className="text-white">Loading...</p>;

  // BUY NOW
  const handleBuy = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login to place an order.");
        navigate("/login");
        return;
      }

      // ❌ Prevent buying sold-out item
      if (material.quantity <= 0 || material.isActive === false) {
        alert("This material is no longer available.");
        navigate("/marketplace");
        return;
      }

      setLoading(true);

      await API.post(
        "/orders",
        {
          materialId: material._id,
          quantity: 1,
          logisticsMode: "direct",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // 🔔 Notify marketplace to refresh
      window.dispatchEvent(new Event("order-placed"));

      alert("Order placed successfully!");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto text-white space-y-5">
      <h1 className="text-3xl font-bold">{material.name}</h1>

      <p className="text-slate-300">{material.description}</p>

      <div className="space-y-2">
        <p>
          <strong>Quantity:</strong> {material.quantity} {material.unit}
        </p>
        <p>
          <strong>Location:</strong> {material.location}
        </p>
        <p>
          <strong>Seller:</strong> {material.seller?.companyName}
        </p>
        <p className="text-emerald-400 font-bold text-xl">
          ₹{material.basePrice}
        </p>
      </div>

      <button
        onClick={handleBuy}
        disabled={loading || material.quantity <= 0}
        className={`px-4 py-2 rounded-lg font-semibold ${
          material.quantity <= 0
            ? "bg-gray-500 cursor-not-allowed"
            : "bg-emerald-400 text-slate-900 hover:bg-emerald-300"
        }`}
      >
        {material.quantity <= 0 ? "Sold Out" : loading ? "Placing..." : "Buy Now"}
      </button>
    </div>
  );
}
