import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="text-white">
      {/* ---------------- HERO SECTION ---------------- */}
      <section className="min-h-screen flex items-center bg-gradient-to-br from-slate-900 to-emerald-900 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          {/* LEFT */}
          <div>
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">
              Turn <span className="text-emerald-400">Industrial Waste</span>
              <br />
              into <span className="text-emerald-400">Business Value</span>
            </h1>

            <p className="mt-6 text-lg text-slate-300">
              Trash2Trade is a B2B digital marketplace that enables industries
              to buy and sell reusable by-products and promote a circular
              economy.
            </p>

            {/* CTA BUTTONS */}
            <div className="mt-8 flex gap-4 flex-wrap">
              {/* NOT LOGGED IN */}
              {!user && (
                <>
                  <Link
                    to="/login"
                    className="bg-emerald-400 text-slate-900 px-6 py-3 rounded-lg font-semibold hover:bg-emerald-300"
                  >
                    Login
                  </Link>

                  <Link
                    to="/register"
                    className="border border-emerald-400 px-6 py-3 rounded-lg font-semibold hover:bg-emerald-400 hover:text-slate-900"
                  >
                    Get Started
                  </Link>
                </>
              )}

              {/* BUYER */}
              {user?.role === "buyer" && (
                <>
                  <Link
                    to="/marketplace"
                    className="bg-emerald-400 text-slate-900 px-6 py-3 rounded-lg font-semibold"
                  >
                    Explore Marketplace
                  </Link>

                  <Link
                    to="/buyer/dashboard"
                    className="border border-emerald-400 px-6 py-3 rounded-lg font-semibold"
                  >
                    My Orders
                  </Link>
                </>
              )}

              {/* SELLER */}
              {user?.role === "seller" && (
                <>
                  <Link
                    to="/seller/dashboard"
                    className="bg-emerald-400 text-slate-900 px-6 py-3 rounded-lg font-semibold"
                  >
                    Seller Dashboard
                  </Link>

                  <Link
                    to="/add-material"
                    className="border border-emerald-400 px-6 py-3 rounded-lg font-semibold"
                  >
                    Add Material
                  </Link>
                </>
              )}

              {/* ADMIN */}
              {user?.role === "admin" && (
                <p className="text-slate-300 mt-2">
                  Logged in as <b>Admin</b>
                </p>
              )}
            </div>
          </div>

          {/* RIGHT */}
          <div className="hidden md:block">
            <div className="bg-slate-800/60 backdrop-blur-lg border border-white/10 rounded-2xl p-8 shadow-xl">
              <h3 className="text-xl font-semibold mb-4 text-emerald-300">
                Platform Highlights
              </h3>
              <ul className="space-y-3 text-slate-300">
                <li>✔ Verified industrial sellers</li>
                <li>✔ Real-time availability</li>
                <li>✔ Secure payments</li>
                <li>✔ Sustainability tracking</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
