import MaterialCard from "../components/MaterialCard";
import { useEffect, useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api";

export default function Marketplace() {
  const [materials, setMaterials] = useState([]);
  const [query, setQuery] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  // 🔁 Fetch materials
  const fetchMaterials = useCallback(async () => {
    try {
      const res = await api.get("/materials");
      setMaterials(res.data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    fetchMaterials();
  }, [fetchMaterials]);

  // 🔔 Refresh on order placement
  useEffect(() => {
    const refresh = () => fetchMaterials();
    window.addEventListener("order-placed", refresh);
    return () => window.removeEventListener("order-placed", refresh);
  }, [fetchMaterials]);

  // 🔍 Filters
  const filtered = useMemo(() => {
    return materials.filter((m) => {
      const q = m.name?.toLowerCase().includes(query.toLowerCase());
      const minOk = minPrice ? m.price >= Number(minPrice) : true;
      const maxOk = maxPrice ? m.price <= Number(maxPrice) : true;
      return q && minOk && maxOk;
    });
  }, [materials, query, minPrice, maxPrice]);

  return (
    <section className="max-w-7xl mx-auto pt-20 px-6 text-white">
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-5xl font-bold mb-8"
      >
        Marketplace
      </motion.h1>

      {/* FILTER BAR */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mb-10 grid grid-cols-1 md:grid-cols-4 gap-4 bg-gray-900/60 border border-white/10 rounded-2xl p-4"
      >
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search material…"
          className="bg-gray-800 rounded px-4 py-2 outline-none"
        />
        <input
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          placeholder="Min price"
          type="number"
          className="bg-gray-800 rounded px-4 py-2 outline-none"
        />
        <input
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          placeholder="Max price"
          type="number"
          className="bg-gray-800 rounded px-4 py-2 outline-none"
        />
        <button
          onClick={() => {
            setQuery("");
            setMinPrice("");
            setMaxPrice("");
          }}
          className="bg-emerald-600 rounded px-4 py-2 font-semibold hover:bg-emerald-700 transition"
        >
          Clear
        </button>
      </motion.div>

      {/* GRID */}
      {filtered.length === 0 ? (
        <p className="text-gray-400 text-lg">No materials found.</p>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 place-items-center"
        >
          <AnimatePresence>
            {filtered.map((mat) => (
              <motion.div
                key={mat._id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <MaterialCard material={mat} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </section>
  );
}
