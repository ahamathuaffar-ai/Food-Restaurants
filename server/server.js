import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "../config/db.js";
import authRoutes from "../routes/authRoutes.js";
import foodRoutes from "../routes/foodRoutes.js";
import categoryRoutes from "../routes/categroyRoutes.js";
import cartRoutes from "../routes/cartRoutes.js";
import orderRoutes from "../routes/orderRoutes.js";
import paymentSettingsRoutes from "../routes/paymentSettingsRoutes.js";


dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: "4mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("dev"));
app.use(async (req, res, next) => {
  
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error("MongoDB connection failed:", error.name, error.code || "");
    res.status(503).json({
      success: false,
      message: "Database unavailable. Check the MongoDB connection and network access settings.",
    });
  }
});

// Test route
app.get("/", (req, res) => {
  res.json({
    message: "Online Food Ordering API is running"
  });
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Backend is connected and running"
  });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/foods", foodRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payment-settings", paymentSettingsRoutes);

// Start server
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB_URI)
.then(()=>{
  console.log("MongoDB connected successfully");
  app.listen(PORT, () => {
    console.log('server is running on port ${PORT}');

  });
})
.catch((error)=>{
  console.log("MongoDB connection failed:",error.message);
});
export default app;