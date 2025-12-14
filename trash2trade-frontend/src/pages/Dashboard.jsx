import React, { useEffect, useState } from "react";
import API from "../api";

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
      <h1 className="text-4xl font-bold mb-8">Dashboard</h1>

      {/* ---------------------- MY MATERIAL LISTINGS ---------------------- */}
      <h2 className="text-2xl font-semibold mt-10 mb-4">My Material Listings</h2>

      {myMaterials.length === 0 ? (
        <p className="text-slate-400">No materials listed yet.</p>
      ) : (
        myMaterials.map((mat) => (
          <div
            key={mat._id}
            className="bg-slate-800 p-5 mb-4 rounded-xl shadow-md"
          >
            <h3 className="text-xl font-bold">{mat.name}</h3>
            <p>{mat.description}</p>
            <p className="text-emerald-400 font-bold mt-2">
              ₹{mat.basePrice} / {mat.unit}
            </p>
          </div>
        ))
      )}

      {/* ---------------------- SALES ORDERS ---------------------- */}
      <h2 className="text-2xl font-semibold mt-10 mb-4">
        Orders for My Materials (Sales)
      </h2>

      {salesOrders.length === 0 ? (
        <p className="text-slate-400">Sales orders coming...</p>
      ) : (
        salesOrders.map((order) => (
          <div
            key={order._id}
            className="bg-slate-800 p-5 mb-4 rounded-xl shadow-md"
          >
            <h3 className="text-xl font-bold">
              {order.material?.name} —{" "}
              <span className="text-yellow-300">Sold</span>
            </h3>

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
              <strong>Status:</strong> {order.status}
            </p>
          </div>
        ))
      )}

      {/* ---------------------- PURCHASE ORDERS ---------------------- */}
      <h2 className="text-2xl font-semibold mt-10 mb-4">
        My Purchase Orders
      </h2>

      {purchaseOrders.length === 0 ? (
        <p className="text-slate-400">Purchase orders coming...</p>
      ) : (
        purchaseOrders.map((order) => (
          <div
            key={order._id}
            className="bg-slate-800 p-5 mb-4 rounded-xl shadow-md"
          >
            <h3 className="text-xl font-bold">
              {order.material?.name} —{" "}
              <span className="text-emerald-400">Purchased</span>
            </h3>

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
              <strong>Status:</strong> {order.status}
            </p>
          </div>
        ))
      )}
    </div>
  );
};

export default Dashboard;
