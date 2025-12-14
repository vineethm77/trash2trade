import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Marketplace from "./pages/Marketplace";
import AddMaterial from "./pages/AddMaterial";
import MaterialDetails from "./pages/MaterialDetails";

import BuyerDashboard from "./pages/BuyerDashboard";
import SellerDashboard from "./pages/SellerDashboard";
import MyMaterials from "./pages/MyMaterials";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* BUYER */}
          <Route path="/buyer/dashboard" element={<BuyerDashboard />} />

          {/* SELLER */}
          <Route path="/seller/dashboard" element={<SellerDashboard />} />
          <Route path="/my-materials" element={<MyMaterials />} />

          {/* ADD + EDIT MATERIAL (IMPORTANT) */}
          <Route path="/add-material" element={<AddMaterial />} />
          <Route path="/edit-material/:id" element={<AddMaterial />} /> ✅

          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/material/:id" element={<MaterialDetails />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
