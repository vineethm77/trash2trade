import { useEffect, useState } from "react";
import axios from "../api";
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

/* -------------------------------
   STAT CARD
-------------------------------- */
function StatCard({ title, value, color }) {
  return (
    <div className={`bg-gray-800 border ${color} p-4 rounded`}>
      <p className="text-sm text-gray-400">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}

const COLORS = ["#22c55e", "#ef4444", "#f59e0b", "#3b82f6"];

export default function SellerDashboard() {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    const [ordersRes, statsRes] = await Promise.all([
      axios.get("/orders/my-sells"),
      axios.get("/stats/seller"),
    ]);

    setOrders(ordersRes.data);
    setStats(statsRes.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      setLoading(true);
      await axios.put(`/orders/${id}/status`, { status });
      loadData();
    } catch (e) {
      alert(e.response?.data?.message || "Failed to update");
    } finally {
      setLoading(false);
    }
  };

  // 📊 CHART DATA
  const barData = stats
    ? [
        { name: "Approved", value: stats.approved },
        { name: "Rejected", value: stats.rejected },
        { name: "Completed", value: stats.completed },
        { name: "In Progress", value: stats.inProgress },
      ]
    : [];

  const pieData = barData.filter((d) => d.value > 0);

  return (
    <div className="p-8 text-white">
      <h1 className="text-3xl font-bold mb-6">Seller Dashboard</h1>

      {/* STATS */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <StatCard title="Total Orders" value={stats.total} color="border-blue-500" />
          <StatCard title="Approved" value={stats.approved} color="border-green-500" />
          <StatCard title="Rejected" value={stats.rejected} color="border-red-500" />
          <StatCard title="Completed" value={stats.completed} color="border-emerald-500" />
          <StatCard title="In Progress" value={stats.inProgress} color="border-yellow-500" />
        </div>
      )}

      {/* 📊 CHARTS */}
      {stats && (
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          <div className="bg-gray-800 p-4 rounded h-72">
            <p className="font-semibold mb-2">Orders Status (Bar Chart)</p>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#22c55e" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-gray-800 p-4 rounded h-72">
            <p className="font-semibold mb-2">Orders Distribution (Pie Chart)</p>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={90}
                  label
                >
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* ORDERS */}
      {orders.length === 0 ? (
        <p>No orders yet</p>
      ) : (
        orders.map((order) => (
          <div
            key={order._id}
            className={`p-5 rounded mb-4 shadow
              ${
                order.status === "Completed"
                  ? "bg-emerald-900 border border-emerald-500"
                  : order.status === "Rejected"
                  ? "bg-red-900/40 border border-red-500"
                  : "bg-gray-800"
              }`}
          >
            <p><b>Material:</b> {order.material?.name}</p>
            <p><b>Quantity:</b> {order.quantity}</p>
            <p>
              <b>Status:</b>{" "}
              <span
                className={`font-semibold ${
                  order.status === "Completed"
                    ? "text-emerald-400"
                    : order.status === "Rejected"
                    ? "text-red-400"
                    : "text-yellow-400"
                }`}
              >
                {order.status}
              </span>
            </p>
            <p className="text-sm text-gray-300">
              Buyer: {order.buyer?.companyName}
            </p>

            {/* ACTION BUTTONS */}
            <div className="mt-4 flex gap-3">
              {order.status === "Placed" && (
                <>
                  <button
                    disabled={loading}
                    onClick={() => updateStatus(order._id, "Approved")}
                    className="bg-green-600 px-4 py-2 rounded hover:bg-green-700"
                  >
                    Approve
                  </button>
                  <button
                    disabled={loading}
                    onClick={() => updateStatus(order._id, "Rejected")}
                    className="bg-red-600 px-4 py-2 rounded hover:bg-red-700"
                  >
                    Reject
                  </button>
                </>
              )}

              {order.status === "Approved" && (
                <button
                  disabled={loading}
                  onClick={() => updateStatus(order._id, "Shipped")}
                  className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
                >
                  Mark Shipped
                </button>
              )}
            </div>

            {/* COMPLETED STATE */}
            {order.status === "Completed" && (
              <div className="mt-4 flex items-center gap-3 text-emerald-300">
                <span className="text-2xl">✔</span>
                <span className="font-semibold text-lg">
                  Order Completed Successfully
                </span>
              </div>
            )}

            {/* REJECTED STATE */}
            {order.status === "Rejected" && (
              <div className="mt-4 text-red-300 font-semibold">
                ❌ Order Rejected
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
