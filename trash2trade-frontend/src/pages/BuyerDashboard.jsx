import { useEffect, useState } from "react";
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

/* -------------------------------
   TIMELINE
-------------------------------- */
function Timeline({ status }) {
  if (status === "CANCELLED") {
    return <div className="mt-3 text-red-400 font-semibold">❌ Cancelled</div>;
  }

  return (
    <div className="flex gap-2 mt-3 flex-wrap">
      {steps.map((step) => {
        const active = steps.indexOf(step) <= steps.indexOf(status);
        return (
          <div
            key={step}
            className={`px-3 py-1 rounded text-xs ${
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
      await axios.put(`/orders/${id}/complete`);
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

      {/* CHARTS */}
      {stats && (
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          <div className="bg-gray-800 p-4 rounded h-72">
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
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={90} label>
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
      {orders.map((order) => {
        const statusStyle =
          order.orderStatus === "COMPLETED"
            ? "bg-emerald-900/40 border border-emerald-500 animate-pulse"
            : order.orderStatus === "CANCELLED"
            ? "bg-red-900/40 border border-red-500 animate-pulse"
            : "bg-gray-800";

        return (
          <div key={order._id} className={`p-4 rounded mb-4 ${statusStyle}`}>
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
                    ? "text-green-400 font-semibold"
                    : "text-yellow-400 font-semibold"
                }
              >
                {order.paymentStatus}
              </span>
            </p>

            <Timeline status={order.orderStatus} />

            {/* PAY */}
            {order.orderStatus === "APPROVED" &&
              order.paymentStatus === "PENDING" && (
                <div className="mt-4">
                  <PayButton orderId={order._id} />
                </div>
              )}

            {/* CONFIRM DELIVERY */}
            {order.orderStatus === "PICKED_UP" && (
              <button
                disabled={loading}
                onClick={() => confirmDelivery(order._id)}
                className="mt-4 bg-emerald-600 px-4 py-2 rounded hover:bg-emerald-700"
              >
                Confirm Delivery
              </button>
            )}

            {order.orderStatus === "COMPLETED" && (
              <div className="mt-4 text-emerald-300 font-bold text-lg">
                ✔ Order Completed Successfully
              </div>
            )}

            {order.orderStatus === "CANCELLED" && (
              <div className="mt-4 text-red-300 font-bold text-lg">
                ❌ Order Cancelled
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
