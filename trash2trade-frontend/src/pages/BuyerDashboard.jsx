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

const steps = ["Placed", "Approved", "Shipped", "Completed"];
const COLORS = ["#22c55e", "#ef4444", "#f59e0b", "#3b82f6"];

/* -------------------------------
   TIMELINE COMPONENT
-------------------------------- */
function Timeline({ status }) {
  if (status === "Rejected") {
    return <div className="mt-3 text-red-400 font-semibold">❌ Rejected</div>;
  }

  return (
    <div className="flex gap-3 mt-3">
      {steps.map((step) => {
        const active = steps.indexOf(step) <= steps.indexOf(status);
        return (
          <div
            key={step}
            className={`px-3 py-1 rounded text-sm ${
              active ? "bg-green-600" : "bg-gray-700"
            }`}
          >
            {step}
          </div>
        );
      })}
    </div>
  );
}

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

/* -------------------------------
   BUYER DASHBOARD
-------------------------------- */
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
      await axios.put(`/orders/${id}/confirm`);
      loadData();
    } catch (e) {
      alert(e.response?.data?.message || "Confirmation failed");
    } finally {
      setLoading(false);
    }
  };

  /* -------------------------------
     CHART DATA
  -------------------------------- */
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
      <h1 className="text-3xl font-bold mb-6">Buyer Dashboard</h1>

      {/* STATS */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard title="Total Orders" value={stats.total} color="border-blue-500" />
          <StatCard title="Completed" value={stats.completed} color="border-emerald-500" />
          <StatCard title="Rejected" value={stats.rejected} color="border-red-500" />
          <StatCard title="In Progress" value={stats.inProgress} color="border-yellow-500" />
        </div>
      )}

      {/* 📊 CHARTS */}
      {stats && (
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          <div className="bg-gray-800 p-4 rounded h-72">
            <p className="font-semibold mb-2">My Orders (Bar Chart)</p>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" />
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
        <p>No purchases yet</p>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="bg-gray-800 p-4 rounded mb-4">
            <p><b>Material:</b> {order.material?.name}</p>
            <p><b>Quantity:</b> {order.quantity}</p>
            <p><b>Status:</b> {order.status}</p>

            <Timeline status={order.status} />

            {order.status === "Shipped" && (
              <button
                disabled={loading}
                onClick={() => confirmDelivery(order._id)}
                className="mt-4 bg-emerald-600 px-4 py-2 rounded hover:bg-emerald-700"
              >
                Confirm Delivery
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}
