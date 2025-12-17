import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";
import sendEmail from "./utils/sendEmail.js";

// Routes
import authRoutes from "./routes/authRoutes.js";
import materialRoutes from "./routes/materialRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js"; // ✅ RAZORPAY
import statsRoutes from "./routes/statsRoutes.js";
import userRoutes from "./routes/userRoutes.js"; // ✅ ADMIN USERS

dotenv.config();

const app = express();

// --------------------
// MIDDLEWARE
// --------------------
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
    credentials: true,
  })
);

app.use(express.json());

// --------------------
// ROUTES
// --------------------
app.use("/api/auth", authRoutes);
app.use("/api/materials", materialRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes); // ✅ PAYMENT ROUTES
app.use("/api/stats", statsRoutes);
app.use("/api/users", userRoutes); // ✅ ADMIN USER ROUTES

// --------------------
// SMTP TEST ROUTE
// --------------------
app.get("/test-email", async (req, res) => {
  try {
    await sendEmail(
      process.env.EMAIL_USER,
      "SMTP Test - Trash2Trade",
      "<h2>SMTP is working ✅</h2>"
    );
    res.send("Email sent successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
});

// --------------------
// START SERVER
// --------------------
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  connectDB();
  console.log(`Server running on http://localhost:${PORT}`);
});
