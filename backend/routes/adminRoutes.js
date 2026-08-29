import express from "express";

import {
  getAdminDashboard,
  getAdminUsers,
  getAdminRecruiters,
  getAdminJobs,
  getAdminApplications,
  getAdminCompanies,
} from "../controllers/adminController.js";

import {
  protect,
  adminOnly,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// =====================================================
// ADMIN DASHBOARD
// =====================================================

router.get(
  "/dashboard",
  protect,
  adminOnly,
  getAdminDashboard
);

router.get("/users", protect, adminOnly, getAdminUsers);
router.get("/recruiters", protect, adminOnly, getAdminRecruiters);
router.get("/jobs", protect, adminOnly, getAdminJobs);
router.get("/applications", protect, adminOnly, getAdminApplications);
router.get("/companies", protect, adminOnly, getAdminCompanies);

export default router;