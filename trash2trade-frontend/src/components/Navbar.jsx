import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isHome = location.pathname === "/";

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-[#0f172a] text-white px-8 py-4 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold text-teal-400">
        Trash2Trade
      </Link>

      <div className="flex gap-4 items-center">

        {/* ---------------- HOME PAGE (NOT LOGGED IN) ---------------- */}
        {isHome && !user && (
          <>
            <Link to="/login" className="px-4 py-2 rounded bg-slate-700">
              Login
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 rounded bg-emerald-500 text-slate-900 font-semibold"
            >
              Get Started
            </Link>
          </>
        )}

        {/* ---------------- BUYER NAV ---------------- */}
        {user?.role === "buyer" && !isHome && (
          <>
            <Link to="/marketplace">Marketplace</Link>
            <Link to="/buyer/dashboard">My Orders</Link>
          </>
        )}

        {/* ---------------- SELLER NAV ---------------- */}
        {user?.role === "seller" && !isHome && (
          <>
            <Link to="/seller/dashboard">Sales</Link>
            <Link to="/my-materials">My Materials</Link>
            <Link to="/add-material">Add Material</Link>
          </>
        )}

        {/* ---------------- LOGGED IN USER ---------------- */}
        {user && !isHome && (
          <>
            <span className="text-gray-300">{user.name}</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 px-4 py-2 rounded"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
