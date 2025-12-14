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
              to buy and sell reusable by-products, reduce waste, and promote
              a circular economy.
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
                    className="bg-emerald-400 text-slate-900 px-6 py-3 rounded-lg font-semibold hover:bg-emerald-300"
                  >
                    Explore Marketplace
                  </Link>

                  <Link
                    to="/buyer/dashboard"
                    className="border border-emerald-400 px-6 py-3 rounded-lg font-semibold hover:bg-emerald-400 hover:text-slate-900"
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
                    className="bg-emerald-400 text-slate-900 px-6 py-3 rounded-lg font-semibold hover:bg-emerald-300"
                  >
                    Seller Dashboard
                  </Link>

                  <Link
                    to="/add-material"
                    className="border border-emerald-400 px-6 py-3 rounded-lg font-semibold hover:bg-emerald-400 hover:text-slate-900"
                  >
                    Add Material
                  </Link>
                </>
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
                <li>✔ Real-time material availability</li>
                <li>✔ Integrated logistics & order tracking</li>
                <li>✔ Sustainability & CO₂ impact tracking</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- HOW IT WORKS ---------------- */}
      <section className="py-20 bg-slate-900 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-12">How It Works</h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "List Materials",
                desc: "Industries list reusable by-products with quantity, price, and location.",
              },
              {
                title: "Place Orders",
                desc: "Buyers discover materials, place orders, and choose logistics modes.",
              },
              {
                title: "Track & Complete",
                desc: "Orders are approved, shipped, delivered, and completed digitally.",
              },
            ].map((step, i) => (
              <div
                key={i}
                className="bg-slate-800 p-6 rounded-xl border border-white/10 hover:border-emerald-400 transition"
              >
                <h3 className="text-xl font-semibold mb-3 text-emerald-400">
                  {step.title}
                </h3>
                <p className="text-slate-300">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- CTA ---------------- */}
      {!user && (
        <section className="py-20 bg-slate-900 text-center px-6">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Trade Smarter?
          </h2>
          <p className="text-slate-300 mb-8">
            Join Trash2Trade and become part of the circular economy revolution.
          </p>
          <Link
            to="/register"
            className="bg-emerald-400 text-slate-900 px-8 py-3 rounded-lg font-semibold hover:bg-emerald-300"
          >
            Create Account
          </Link>
        </section>
      )}
    </div>
  );
}
