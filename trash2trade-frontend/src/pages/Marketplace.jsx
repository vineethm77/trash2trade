import MaterialCard from "../components/MaterialCard";
import { useEffect, useState, useCallback } from "react";
import api from "../api";

export default function Marketplace() {
  const [materials, setMaterials] = useState([]);

  // 🔁 Fetch materials
  const fetchMaterials = useCallback(async () => {
    try {
      const res = await api.get("/materials");
      setMaterials(res.data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchMaterials();
  }, [fetchMaterials]);

  // 🔔 Listen for order placement event
  useEffect(() => {
    const refresh = () => fetchMaterials();
    window.addEventListener("order-placed", refresh);

    return () => window.removeEventListener("order-placed", refresh);
  }, [fetchMaterials]);

  return (
    <section className="max-w-7xl mx-auto pt-20 px-6">
      <h1 className="text-5xl font-bold text-white mb-10">
        Marketplace
      </h1>

      {materials.length === 0 ? (
        <p className="text-gray-400 text-lg">No materials listed yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 place-items-center">
          {materials.map((mat) => (
            <MaterialCard key={mat._id} material={mat} />
          ))}
        </div>
      )}
    </section>
  );
}
