import { Link } from "react-router-dom";

export default function MaterialCard({ material }) {
  return (
    <Link to={`/material/${material._id}`} className="block w-full">
      <div className="
        bg-gray-800/60 
        backdrop-blur-xl 
        border border-white/10 
        rounded-xl 
        p-6 
        shadow-xl 
        hover:shadow-emerald-500/20 
        hover:-translate-y-1 
        transition-all 
        duration-300 
        animate-fadeIn
        w-80
      ">
        
        {/* Material Name */}
        <h2 className="text-xl font-bold text-white">
          {material.name}
        </h2>

        {/* Quantity + Location */}
        <p className="text-gray-400 mt-1">
          {material.quantity} {material.unit} • {material.location || "Unknown"}
        </p>

        {/* Price Badge */}
        <div className="
          mt-4 
          inline-block 
          px-4 
          py-1 
          bg-emerald-500/20 
          text-emerald-300 
          font-semibold 
          rounded-lg 
          shadow-md 
          shadow-emerald-500/10
          text-lg
        ">
          ₹ {material.price}
        </div>

        {/* View Details Link */}
        <div className="mt-5 text-right">
          <span className="text-emerald-400 hover:text-emerald-300 text-sm transition">
            View Details →
          </span>
        </div>

      </div>
    </Link>
  );
}
