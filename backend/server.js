import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db.js";
import bootstrapDefaults from "./config/bootstrap.js";
import authRoutes from "./routes/authRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import companyRoutes from "./routes/companyRoutes.js";
import recruiterRoutes from "./routes/recruiterRoutes.js";
import recruiterCvRoutes from "./routes/recruiterCvRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import adminAdvancedRoutes from "./routes/adminAdvancedRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import fileRoutes from "./routes/fileRoutes.js";


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

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));

app.use(express.json());


// ===============================
// Database
// ===============================

connectDB().then(() => bootstrapDefaults().catch((error) => console.error("Bootstrap defaults error:", error)));


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
app.use("/api/admin", adminAdvancedRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/recruiter", recruiterRoutes);
app.use("/api/recruiter", recruiterCvRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/reports", reportRoutes);

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