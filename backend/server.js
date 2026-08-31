import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import companyRoutes from "./routes/companyRoutes.js";
import recruiterProfileRoutes from "./routes/recruiterProfileRoutes.js";


dotenv.config();

console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log(
  "EMAIL_PASS:",
  process.env.EMAIL_PASS ? "LOADED" : "MISSING"
);

const app = express();


// ===============================
// Middleware
// ===============================

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://127.0.0.1:5173",
    ],
    credentials: true,
  })
);

app.use(express.json());


// ===============================
// Database
// ===============================

connectDB();


// ===============================
// Health Check
// ===============================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Jobify API is running",
  });
});


// ===============================
// Auth Routes
// ===============================

app.use("/api/auth", authRoutes);
app.use("/api", jobRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api/profile", profileRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/recruiter", recruiterProfileRoutes);

// ===============================
// 404
// ===============================

app.use((err, req, res, next) => {
  if (err?.name === "MulterError") {
    return res.status(400).json({ success: false, message: err.message || "File upload failed." });
  }
  if (err) {
    console.error("Unhandled API error:", err);
    return res.status(400).json({ success: false, message: err.message || "Request failed." });
  }
  next();
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});


// ===============================
// Server
// ===============================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Jobify API running on port ${PORT}`);
});