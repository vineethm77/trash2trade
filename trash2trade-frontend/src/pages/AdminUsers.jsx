import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "../api";

const rowAnim = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadUsers = async () => {
    try {
      const res = await axios.get("/users/admin/all");
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const toggleUser = async (id) => {
    if (!window.confirm("Change user status?")) return;

    try {
      await axios.put(`/users/admin/${id}/toggle`);

      // 🔁 Update UI instantly (no reload lag)
      setUsers((prev) =>
        prev.map((u) =>
          u._id === id ? { ...u, isBlocked: !u.isBlocked } : u
        )
      );
    } catch {
      alert("Action failed");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading users...
      </div>
    );
  }

  return (
    <div className="p-8 text-white">
      <motion.h1
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold mb-8"
      >
        Admin · User Management
      </motion.h1>

      <div className="overflow-x-auto bg-gray-800 rounded-2xl shadow">
        <table className="table-fixed w-full text-sm">
          <thead className="bg-gray-900 text-gray-300">
            <tr>
              <th className="w-2/12 p-4 text-left">Name</th>
              <th className="w-3/12 p-4 text-left">Email</th>
              <th className="w-2/12 p-4 text-center">Role</th>
              <th className="w-2/12 p-4 text-center">Status</th>
              <th className="w-3/12 p-4 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u, i) => (
              <motion.tr
                key={u._id}
                variants={rowAnim}
                initial="hidden"
                animate="show"
                transition={{ delay: i * 0.05 }}
                className="border-t border-gray-700 hover:bg-gray-700/40"
              >
                <td className="p-4 font-medium truncate">{u.name}</td>

                <td className="p-4 truncate">{u.email}</td>

                <td className="p-4 text-center capitalize">{u.role}</td>

                {/* STATUS */}
                <td
                  className={`p-4 text-center font-semibold ${
                    u.isBlocked ? "text-red-400" : "text-green-400"
                  }`}
                >
                  {u.isBlocked ? "Blocked" : "Active"}
                </td>

                {/* ACTION */}
                <td className="p-4 text-center">
                  {u.role !== "admin" ? (
                    <button
                      onClick={() => toggleUser(u._id)}
                      className={`px-4 py-1 rounded text-xs font-semibold transition ${
                        u.isBlocked
                          ? "bg-emerald-600 hover:bg-emerald-700"
                          : "bg-red-600 hover:bg-red-700"
                      }`}
                    >
                      {u.isBlocked ? "Unblock" : "Block"}
                    </button>
                  ) : (
                    <span className="text-gray-400 text-xs">
                      Protected
                    </span>
                  )}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
