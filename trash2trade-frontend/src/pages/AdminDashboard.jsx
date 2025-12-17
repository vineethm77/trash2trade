import { useEffect, useState } from "react";
import axios from "../api";
import { motion } from "framer-motion";
import CountUp from "react-countup";
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

const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444"];

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [statsRes, ordersRes] = await Promise.all([
        axios.get("/stats/admin"),
        axios.get("/orders/admin/all"),
      ]);
      setStats(statsRes.data);
      setOrders(ordersRes.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const cancelOrder = async (id) => {
    if (!window.confirm("Cancel this order as Admin?")) return;
    await axios.put(`/orders/admin/${id}/cancel`);
    loadData();
  };

  const statusBadge = (status) => {
    const map = {
      PLACED: "bg-slate-600",
      APPROVED: "bg-blue-600",
      PICKED_UP: "bg-yellow-600",
      COMPLETED: "bg-emerald-600",
      CANCELLED: "bg-red-600",
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${map[status]}`}>
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading admin dashboard...
      </div>
    );
  }

  const orderBarData = [
    { name: "Placed", value: stats.orders.placed },
    { name: "Approved", value: stats.orders.approved },
    { name: "Picked Up", value: stats.orders.pickedUp },
    { name: "Completed", value: stats.orders.completed },
    { name: "Cancelled", value: stats.orders.cancelled },
  ];

  const userPieData = [
    { name: "Buyers", value: stats.users.buyers },
    { name: "Sellers", value: stats.users.sellers },
    { name: "Admins", value: stats.users.admins },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="p-8 text-white"
    >
      <motion.h1
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-bold mb-10"
      >
        Admin Dashboard
      </motion.h1>

      {/* 🔥 STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <Stat label="Total Users" value={stats.users.total} delay={0} />
        <Stat label="Total Orders" value={stats.orders.total} delay={0.1} />
        <Stat label="Materials" value={stats.materials.total} delay={0.2} />
        <Stat label="Revenue" value={stats.revenue} prefix="₹ " delay={0.3} />
      </div>

      {/* 🔥 CHARTS */}
      <div className="grid md:grid-cols-2 gap-8 mb-14">
        <Chart title="Order Lifecycle">
          <BarChart data={orderBarData}>
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar
              dataKey="value"
              fill="#10b981"
              animationDuration={1200}
              animationEasing="ease-out"
            />
          </BarChart>
        </Chart>

        <Chart title="Users">
          <PieChart>
            <Pie
              data={userPieData}
              dataKey="value"
              nameKey="name"
              outerRadius={90}
              label
              isAnimationActive
              animationDuration={1400}
            >
              {userPieData.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Legend />
            <Tooltip />
          </PieChart>
        </Chart>
      </div>

      {/* 🔥 ORDERS TABLE */}
      <h2 className="text-2xl font-bold mb-4">All Orders</h2>

      <div className="overflow-x-auto bg-slate-800 rounded-xl">
        <table className="table-fixed w-full text-sm">
          <thead className="bg-slate-900 text-slate-300">
            <tr>
              <th className="w-2/12 p-3 text-left">Material</th>
              <th className="w-2/12 p-3 text-center">Buyer</th>
              <th className="w-2/12 p-3 text-center">Seller</th>
              <th className="w-1/12 p-3 text-center">Qty</th>
              <th className="w-2/12 p-3 text-center">Status</th>
              <th className="w-1/12 p-3 text-center">Payment</th>
              <th className="w-2/12 p-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((o, i) => {
              const canAdminCancel =
                o.orderStatus !== "COMPLETED" &&
                o.orderStatus !== "CANCELLED";

              return (
                <motion.tr
                  key={o._id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="border-t border-slate-700 hover:bg-slate-700/40"
                >
                  <td className="p-3">{o.material?.name}</td>
                  <td className="p-3 text-center">
                    {o.buyer?.companyName || o.buyer?.email}
                  </td>
                  <td className="p-3 text-center">
                    {o.seller?.companyName || o.seller?.email}
                  </td>
                  <td className="p-3 text-center">{o.quantity}</td>
                  <td className="p-3 text-center">
                    {statusBadge(o.orderStatus)}
                  </td>
                  <td
                    className={`p-3 text-center font-semibold ${
                      o.paymentStatus === "PAID"
                        ? "text-emerald-400"
                        : "text-yellow-400"
                    }`}
                  >
                    {o.paymentStatus}
                  </td>
                  <td className="p-3 text-center">
                    {canAdminCancel ? (
                      <button
                        onClick={() => cancelOrder(o._id)}
                        className="bg-red-600 hover:bg-red-700 px-4 py-1 rounded text-xs transition"
                      >
                        Cancel
                      </button>
                    ) : o.orderStatus === "CANCELLED" ? (
                      <span className="text-red-400 text-xs font-semibold">
                        Cancelled
                      </span>
                    ) : (
                      <span className="text-emerald-400 text-xs font-semibold">
                        Completed
                      </span>
                    )}
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

/* ---------- HELPERS ---------- */

function Stat({ label, value, prefix = "", delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, delay }}
      className="bg-gray-800 p-5 rounded-xl border border-slate-700"
    >
      <p className="text-sm text-gray-400">{label}</p>
      <p className="text-4xl font-bold mt-2">
        {prefix}
        <CountUp key={value} start={0} end={value} duration={2.2} />
      </p>
    </motion.div>
  );
}

function Chart({ title, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="bg-gray-800 p-6 rounded-2xl h-80"
    >
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </motion.div>
  );
}
