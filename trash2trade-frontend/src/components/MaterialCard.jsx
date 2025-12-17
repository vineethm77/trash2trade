import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function MaterialCard({ material }) {
  return (
    <Link to={`/material/${material._id}`} className="block w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -6, scale: 1.02 }}
        transition={{ type: "spring", stiffness: 120 }}
        className="
          bg-gray-800/60
          backdrop-blur-xl
          border border-white/10
          rounded-2xl
          p-6
          shadow-xl
          hover:shadow-emerald-500/30
          w-80
        "
      >
        {/* Material Name */}
        <h2 className="text-xl font-bold text-white tracking-wide">
          {material.name}
        </h2>

        {/* Quantity + Location */}
        <p className="text-gray-400 mt-1 text-sm">
          {material.quantity} {material.unit} • {material.location || "Unknown"}
        </p>

        {/* Price Badge */}
        <div
          className="
            mt-5
            inline-flex
            items-center
            px-4
            py-1.5
            bg-emerald-500/20
            text-emerald-300
            font-semibold
            rounded-lg
            shadow-md
            shadow-emerald-500/10
            text-lg
          "
        >
          ₹ {material.price}
        </div>

        {/* Divider */}
        <div className="my-4 h-px bg-white/10" />

        {/* CTA */}
        <div className="flex justify-end">
          <span className="text-emerald-400 hover:text-emerald-300 text-sm transition">
            View Details →
          </span>
        </div>
      </motion.div>
    </Link>
  );
}
