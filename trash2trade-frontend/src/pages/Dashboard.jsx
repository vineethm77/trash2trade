import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import API from "../api";

const cardVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const Dashboard = () => {
  const [myMaterials, setMyMaterials] = useState([]);
  const [salesOrders, setSalesOrders] = useState([]);
  const [purchaseOrders, setPurchaseOrders] = useState([]);

  useEffect(() => {
    API.get("/materials/my")
      .then((res) => setMyMaterials(res.data))
      .catch(() => console.log("Failed to load materials"));

    API.get("/orders/my-sells")
      .then((res) => setSalesOrders(res.data))
      .catch(() => console.log("Failed to load sales"));

    API.get("/orders/my-buys")
      .then((res) => setPurchaseOrders(res.data))
      .catch(() => console.log("Failed to load purchases"));
  }, []);

  return (
    <div className="min-h-screen bg-[#0f172a] text-white px-10 py-10">
      {/* HEADER */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold mb-10"
      >
        Dashboard
      </motion.h1>

      {/* ================= MY MATERIALS ================= */}
      <h2 className="text-2xl font-semibold mb-4">My Material Listings</h2>

      {myMaterials.length === 0 ? (
        <p className="text-slate-400">No materials listed yet.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myMaterials.map((mat, i) => (
            <motion.div
              key={mat._id}
              variants={cardVariant}
              initial="hidden"
              animate="visible"
              transition={{ delay: i * 0.05 }}
              whileHover={{ scale: 1.03 }}
              className="bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-700"
            >
              <h3 className="text-xl font-bold">{mat.name}</h3>
              <p className="text-slate-300 mt-2">{mat.description}</p>
              <p className="text-emerald-400 font-bold mt-4">
                ₹{mat.basePrice} / {mat.unit}
              </p>
            </motion.div>
          ))}
        </div>
      )}

      {/* ================= SALES ORDERS ================= */}
      <h2 className="text-2xl font-semibold mt-14 mb-4">
        Orders for My Materials (Sales)
      </h2>

      {salesOrders.length === 0 ? (
        <p className="text-slate-400">Sales orders coming...</p>
      ) : (
        <div className="space-y-4">
          {salesOrders.map((order, i) => (
            <motion.div
              key={order._id}
              variants={cardVariant}
              initial="hidden"
              animate="visible"
              transition={{ delay: i * 0.05 }}
              whileHover={{ scale: 1.02 }}
              className="bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-700"
            >
              <h3 className="text-xl font-bold">
                {order.material?.name} —{" "}
                <span className="text-yellow-300">Sold</span>
              </h3>

              <div className="mt-3 text-slate-300 space-y-1">
                <p>
                  <strong>Buyer:</strong>{" "}
                  {order.buyer?.name ||
                    order.buyer?.companyName ||
                    "Unknown User"}
                </p>
                <p>
                  <strong>Qty:</strong> {order.quantity}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span className="text-emerald-400 font-semibold">
                    {order.status}
                  </span>
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* ================= PURCHASE ORDERS ================= */}
      <h2 className="text-2xl font-semibold mt-14 mb-4">
        My Purchase Orders
      </h2>

      {purchaseOrders.length === 0 ? (
        <p className="text-slate-400">Purchase orders coming...</p>
      ) : (
        <div className="space-y-4">
          {purchaseOrders.map((order, i) => (
            <motion.div
              key={order._id}
              variants={cardVariant}
              initial="hidden"
              animate="visible"
              transition={{ delay: i * 0.05 }}
              whileHover={{ scale: 1.02 }}
              className="bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-700"
            >
              <h3 className="text-xl font-bold">
                {order.material?.name} —{" "}
                <span className="text-emerald-400">Purchased</span>
              </h3>

              <div className="mt-3 text-slate-300 space-y-1">
                <p>
                  <strong>Seller:</strong>{" "}
                  {order.seller?.name ||
                    order.seller?.companyName ||
                    "Unknown User"}
                </p>
                <p>
                  <strong>Qty:</strong> {order.quantity}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span className="text-emerald-400 font-semibold">
                    {order.status}
                  </span>
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
