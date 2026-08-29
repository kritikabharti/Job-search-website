import express from "express";

import {
  applyForJob,
  getRecruiterApplications,
  getApplicationById,
  updateApplicationStatus,
  getCandidateApplications,
} from "../controllers/applicationController.js";

import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Candidate
router.post(
  "/jobs/:jobId/apply",
  protect,
  authorize("jobseeker"),
  applyForJob
);

router.get(
  "/candidate/applications",
  protect,
  authorize("jobseeker"),
  getCandidateApplications
);

// Recruiter
router.get(
  "/recruiter/applications",
  protect,
  authorize("recruiter"),
  getRecruiterApplications
);

router.get(
  "/recruiter/applications/:id",
  protect,
  authorize("recruiter"),
  getApplicationById
);

router.patch(
  "/recruiter/applications/:id/status",
  protect,
  authorize("recruiter"),
  updateApplicationStatus
);

export default router;
