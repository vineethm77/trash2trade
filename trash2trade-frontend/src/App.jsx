import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { AnimatePresence, motion } from "framer-motion";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Marketplace from "./pages/Marketplace";
import AddMaterial from "./pages/AddMaterial";
import MaterialDetails from "./pages/MaterialDetails";

import BuyerDashboard from "./pages/BuyerDashboard";
import SellerDashboard from "./pages/SellerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers"; // ✅ ADD THIS
import MyMaterials from "./pages/MyMaterials";

/* -------- PAGE WRAPPER -------- */
function PageWrapper({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen"
    >
      {children}
    </motion.div>
  );
}

/* -------- ROUTES -------- */
function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
        <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
        <Route path="/register" element={<PageWrapper><Register /></PageWrapper>} />

        {/* BUYER */}
        <Route
          path="/buyer/dashboard"
          element={<PageWrapper><BuyerDashboard /></PageWrapper>}
        />

        {/* SELLER */}
        <Route
          path="/seller/dashboard"
          element={<PageWrapper><SellerDashboard /></PageWrapper>}
        />
        <Route
          path="/my-materials"
          element={<PageWrapper><MyMaterials /></PageWrapper>}
        />

        {/* ADMIN */}
        <Route
          path="/admin/dashboard"
          element={<PageWrapper><AdminDashboard /></PageWrapper>}
        />
        <Route
          path="/admin/users"
          element={<PageWrapper><AdminUsers /></PageWrapper>}
        />

        {/* MATERIAL */}
        <Route
          path="/add-material"
          element={<PageWrapper><AddMaterial /></PageWrapper>}
        />
        <Route
          path="/edit-material/:id"
          element={<PageWrapper><AddMaterial /></PageWrapper>}
        />
        <Route
          path="/marketplace"
          element={<PageWrapper><Marketplace /></PageWrapper>}
        />
        <Route
          path="/material/:id"
          element={<PageWrapper><MaterialDetails /></PageWrapper>}
        />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <AnimatedRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
