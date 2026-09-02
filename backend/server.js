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

console.log("CLIENT_URL:", process.env.CLIENT_URL);

const app = express();

// ===============================
// CORS
// ===============================

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://job-search-website-ow8q.onrender.com",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow Postman, server-to-server and other requests
      // that don't contain an Origin header.
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log("Blocked CORS origin:", origin);

      // Don't throw an error here.
      // Simply reject the origin.
      return callback(null, false);
    },

    credentials: true,

    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
  })
);

// ===============================
// BODY PARSING
// ===============================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===============================
// DATABASE
// ===============================

connectDB()
  .then(async () => {
    console.log("MongoDB connected successfully");

    try {
      await bootstrapDefaults();
      console.log("Bootstrap defaults completed");
    } catch (error) {
      console.error(
        "Bootstrap defaults error:",
        error
      );
    }
  })
  .catch((error) => {
    console.error(
      "MongoDB connection error:",
      error
    );
  });

// ===============================
// HEALTH CHECK
// ===============================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Jobify API is running",
  });
});

// ===============================
// AUTH ROUTES
// ===============================

app.use("/api/auth", authRoutes);

// ===============================
// JOB ROUTES
// ===============================

app.use("/api", jobRoutes);

// ===============================
// ADMIN ROUTES
// ===============================

app.use("/api/admin", adminRoutes);
app.use("/api/admin", adminAdvancedRoutes);

// ===============================
// APPLICATION ROUTES
// ===============================

app.use("/api/applications", applicationRoutes);

// ===============================
// FILE ROUTES
// ===============================

app.use("/api/files", fileRoutes);

// ===============================
// PROFILE ROUTES
// ===============================

app.use("/api/profile", profileRoutes);

// ===============================
// COMPANY ROUTES
// ===============================

app.use("/api/companies", companyRoutes);

// ===============================
// RECRUITER ROUTES
// ===============================

app.use("/api/recruiter", recruiterRoutes);
app.use("/api/recruiter", recruiterCvRoutes);

// ===============================
// PAYMENT ROUTES
// ===============================

app.use("/api/payments", paymentRoutes);

// ===============================
// REPORT ROUTES
// ===============================

app.use("/api/reports", reportRoutes);

// ===============================
// ERROR HANDLER
// ===============================

app.use((err, req, res, next) => {
  console.error("Unhandled API error:", err);

  if (err?.name === "MulterError") {
    return res.status(400).json({
      success: false,
      message:
        err.message || "File upload failed.",
    });
  }

  return res.status(500).json({
    success: false,
    message:
      err.message || "Internal server error.",
  });
});

// ===============================
// 404
// ===============================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.originalUrl,
  });
});

// ===============================
// SERVER
// ===============================

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(
    `Jobify API running on port ${PORT}`
  );
});