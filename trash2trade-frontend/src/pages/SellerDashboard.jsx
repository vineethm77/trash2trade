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

const COLORS = ["#22c55e", "#ef4444", "#3b82f6", "#f59e0b"];

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

  /* -------------------------------
     ACTIONS
  -------------------------------- */
  const approveReject = async (id, action) => {
    try {
      setLoading(true);
      await axios.put(`/orders/${id}/approve`, { action });
      loadData();
    } catch {
      alert("Action failed");
    } finally {
      setLoading(false);
    }
  };

  const markShipped = async (id) => {
    try {
      setLoading(true);
      await axios.put(`/orders/${id}/pickup`);
      loadData();
    } catch {
      alert("Shipment failed");
    } finally {
      setLoading(false);
    }
  };

  /* -------------------------------
     CHART DATA
  -------------------------------- */
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
        const statusClass =
          order.orderStatus === "COMPLETED"
            ? "bg-emerald-900/40 border border-emerald-500 animate-pulse"
            : order.orderStatus === "CANCELLED"
            ? "bg-red-900/40 border border-red-500 animate-pulse"
            : "bg-gray-800";

        return (
          <div key={order._id} className={`p-5 rounded mb-4 shadow ${statusClass}`}>
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
              <span className={order.paymentStatus === "PAID" ? "text-green-400" : "text-yellow-400"}>
                {order.paymentStatus}
              </span>
            </p>

            {/* ACTIONS */}
            <div className="mt-4 flex gap-3">
              {order.orderStatus === "PLACED" && (
                <>
                  <button onClick={() => approveReject(order._id, "APPROVE")} className="bg-green-600 px-4 py-2 rounded">
                    Approve
                  </button>
                  <button onClick={() => approveReject(order._id, "REJECT")} className="bg-red-600 px-4 py-2 rounded">
                    Reject
                  </button>
                </>
              )}

              {order.orderStatus === "APPROVED" && order.paymentStatus === "PAID" && (
                <button onClick={() => markShipped(order._id)} className="bg-blue-600 px-4 py-2 rounded">
                  Mark Shipped
                </button>
              )}
            </div>

            {order.orderStatus === "COMPLETED" && (
              <div className="mt-4 text-emerald-300 font-bold text-lg">
                ✔ Order Completed Successfully
              </div>
            )}

            {order.orderStatus === "CANCELLED" && (
              <div className="mt-4 text-red-300 font-bold text-lg">
                ❌ Order Rejected
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
