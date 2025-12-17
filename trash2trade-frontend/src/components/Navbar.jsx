import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isHome = location.pathname === "/";

  const isActive = (path) =>
    location.pathname.startsWith(path)
      ? "text-emerald-400"
      : "text-gray-300 hover:text-white";

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-[#0f172a] text-white px-8 py-4 flex justify-between items-center border-b border-slate-800"
    >
      {/* LOGO */}
      <Link
        to="/"
        className="text-2xl font-bold text-teal-400 hover:text-teal-300 transition"
      >
        Trash2Trade
      </Link>

      {/* RIGHT NAV */}
      <div className="flex gap-6 items-center text-sm font-medium">

        {/* ================= HOME PAGE ================= */}

        {/* NOT LOGGED IN */}
        {isHome && !user && (
          <>
            <Link
              to="/login"
              className="px-4 py-2 rounded bg-slate-700 hover:bg-slate-600"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 rounded bg-emerald-500 text-slate-900 font-semibold hover:bg-emerald-400"
            >
              Get Started
            </Link>
          </>
        )}

        {/* BUYER ON HOME */}
        {isHome && user?.role === "buyer" && (
          <>
            <Link
              to="/buyer/dashboard"
              className="px-4 py-2 rounded bg-emerald-500 text-slate-900 font-semibold hover:bg-emerald-400"
            >
              Buyer Dashboard
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </>
        )}

        {/* SELLER ON HOME */}
        {isHome && user?.role === "seller" && (
          <>
            <Link
              to="/seller/dashboard"
              className="px-4 py-2 rounded bg-emerald-500 text-slate-900 font-semibold hover:bg-emerald-400"
            >
              Seller Dashboard
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </>
        )}

        {/* ADMIN ON HOME ✅ FIXED */}
        {isHome && user?.role === "admin" && (
          <>
            <Link
              to="/admin/dashboard"
              className="px-4 py-2 rounded bg-emerald-500 text-slate-900 font-semibold hover:bg-emerald-400"
            >
              Admin Dashboard
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </>
        )}

        {/* ================= OTHER PAGES ================= */}

        {/* BUYER NAV */}
        {!isHome && user?.role === "buyer" && (
          <>
            <Link to="/marketplace" className={isActive("/marketplace")}>
              Marketplace
            </Link>
            <Link to="/buyer/dashboard" className={isActive("/buyer")}>
              My Orders
            </Link>
          </>
        )}

        {/* SELLER NAV */}
        {!isHome && user?.role === "seller" && (
          <>
            <Link to="/seller/dashboard" className={isActive("/seller")}>
              Sales
            </Link>
            <Link to="/my-materials" className={isActive("/my-materials")}>
              My Materials
            </Link>
            <Link to="/add-material" className={isActive("/add-material")}>
              Add Material
            </Link>
          </>
        )}

        {/* ADMIN NAV */}
        {!isHome && user?.role === "admin" && (
          <>
            <Link
              to="/admin/dashboard"
              className={isActive("/admin/dashboard")}
            >
              Dashboard
            </Link>
            <Link
              to="/admin/users"
              className={isActive("/admin/users")}
            >
              Users
            </Link>
          </>
        )}

        {/* USER NAME + LOGOUT (NOT HOME) */}
        {user && !isHome && (
          <div className="flex items-center gap-4 ml-4">
            <span className="text-gray-400">{user.name}</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </motion.nav>
  );
}
