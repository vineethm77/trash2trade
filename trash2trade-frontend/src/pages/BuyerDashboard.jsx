import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "../api";
import PayButton from "../components/PayButton";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const steps = ["PLACED", "APPROVED", "PICKED_UP", "COMPLETED"];
const COLORS = ["#22c55e", "#ef4444", "#f59e0b", "#3b82f6"];

const cardAnim = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

/* ---------------- TIMELINE ---------------- */
function Timeline({ status, cancelledBy }) {
  if (status === "CANCELLED") {
    return (
      <div className="mt-3 text-red-400 font-semibold">
        ❌ Cancelled by {cancelledBy || "ADMIN"}
      </div>
    );
  }

  return (
    <div className="flex gap-2 mt-3 flex-wrap">
      {steps.map((step) => {
        const active = steps.indexOf(step) <= steps.indexOf(status);
        return (
          <div
            key={step}
            className={`px-3 py-1 rounded text-xs ${
              active ? "bg-emerald-600" : "bg-gray-700"
            }`}
          >
            {step}
          </div>
        );
      })}
    </div>
  );
}

/* ---------------- STAT CARD ---------------- */
function StatCard({ title, value, color }) {
  return (
    <motion.div
      variants={cardAnim}
      initial="hidden"
      animate="show"
      whileHover={{ scale: 1.05 }}
      className={`bg-gray-800 border ${color} p-4 rounded-xl shadow`}
    >
      <p className="text-sm text-gray-400">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </motion.div>
  );
}

/* ---------------- BUYER DASHBOARD ---------------- */
export default function BuyerDashboard() {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    const [ordersRes, statsRes] = await Promise.all([
      axios.get("/orders/my-buys"),
      axios.get("/stats/buyer"),
    ]);
    setOrders(ordersRes.data);
    setStats(statsRes.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const confirmDelivery = async (id) => {
    try {
      setLoading(true);
      await axios.put(`/orders/${id}/complete`);
      loadData();
    } catch (e) {
      alert(e.response?.data?.message || "Confirmation failed");
    } finally {
      setLoading(false);
    }
  };

  const barData = stats
    ? [
        { name: "Completed", value: stats.completed },
        { name: "Rejected", value: stats.rejected },
        { name: "In Progress", value: stats.inProgress },
      ]
    : [];

  const pieData = barData.filter((d) => d.value > 0);

  return (
    <div className="p-8 text-white">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold mb-8"
      >
        Buyer Dashboard
      </motion.h1>

      {/* STATS */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <StatCard title="Total Orders" value={stats.total} color="border-blue-500" />
          <StatCard title="Completed" value={stats.completed} color="border-emerald-500" />
          <StatCard title="Rejected" value={stats.rejected} color="border-red-500" />
          <StatCard title="In Progress" value={stats.inProgress} color="border-yellow-500" />
        </div>
      )}

      {/* ORDERS */}
      {orders.map((order, i) => {
        const statusStyle =
          order.orderStatus === "COMPLETED"
            ? "bg-emerald-900/30 border border-emerald-500"
            : order.orderStatus === "CANCELLED"
            ? "bg-red-900/30 border border-red-500"
            : "bg-gray-800";

        return (
          <motion.div
            key={order._id}
            variants={cardAnim}
            initial="hidden"
            animate="show"
            transition={{ delay: i * 0.05 }}
            whileHover={{ scale: 1.02 }}
            className={`p-5 rounded-xl mb-5 shadow ${statusStyle}`}
          >
            <p><b>Material:</b> {order.material?.name}</p>
            <p><b>Quantity:</b> {order.quantity}</p>

            <p>
              <b>Status:</b>{" "}
              <span className="font-semibold text-yellow-300">
                {order.orderStatus}
              </span>
            </p>

            <p>
              <b>Payment:</b>{" "}
              <span
                className={
                  order.paymentStatus === "PAID"
                    ? "text-emerald-400 font-semibold"
                    : "text-yellow-400 font-semibold"
                }
              >
                {order.paymentStatus}
              </span>
            </p>

            {/* 🔥 FIXED TIMELINE */}
            <Timeline
              status={order.orderStatus}
              cancelledBy={order.cancelledBy}
            />

            {order.orderStatus === "APPROVED" &&
              order.paymentStatus === "PENDING" && (
                <div className="mt-4">
                  <PayButton orderId={order._id} />
                </div>
              )}

            {order.orderStatus === "PICKED_UP" && (
              <button
                disabled={loading}
                onClick={() => confirmDelivery(order._id)}
                className="mt-4 bg-emerald-600 px-4 py-2 rounded hover:bg-emerald-700 transition"
              >
                Confirm Delivery
              </button>
            )}

            {order.orderStatus === "COMPLETED" && (
              <div className="mt-4 text-emerald-300 font-bold">
                ✔ Order Completed Successfully
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
