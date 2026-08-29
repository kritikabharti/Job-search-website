import mongoose from "mongoose";
import Application from "../models/Application.js";
import Job from "../models/Job.js";
import User from "../models/User.js";

// =====================================================
// CANDIDATE APPLY FOR JOB
// =====================================================

export const applyForJob = async (req, res) => {
  try {
    const candidateId = req.user?._id || req.user?.id;
    const { jobId } = req.params;

    if (!candidateId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid job ID.",
      });
    }

    const candidate = await User.findById(candidateId);

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: "Candidate not found.",
      });
    }

    if (candidate.role !== "jobseeker") {
      return res.status(403).json({
        success: false,
        message: "Only candidates can apply for jobs.",
      });
    }

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found.",
      });
    }

    if (job.status !== "active") {
      return res.status(400).json({
        success: false,
        message: "This job is no longer accepting applications.",
      });
    }

    // Check deadline
    if (
      job.applicationDeadline &&
      new Date() > new Date(job.applicationDeadline)
    ) {
      return res.status(400).json({
        success: false,
        message: "The application deadline has passed.",
      });
    }

    // Prevent duplicate application
    const existingApplication =
      await Application.findOne({
        candidate: candidateId,
        job: jobId,
      });

    if (existingApplication) {
      return res.status(409).json({
        success: false,
        message: "You have already applied for this job.",
      });
    }

    const {
      coverLetter = "",
      resume = "",
    } = req.body;

    const application = await Application.create({
      candidate: candidateId,
      job: job._id,
      recruiter: job.recruiter,
      coverLetter: String(coverLetter).trim(),
      resume: String(resume).trim(),
      status: "pending",
    });

    // Update job application counter
    await Job.findByIdAndUpdate(job._id, {
      $inc: {
        applicationsCount: 1,
      },
    });

    const populatedApplication =
      await Application.findById(application._id)
        .populate(
          "candidate",
          "name email phone"
        )
        .populate(
          "job",
          "title location"
        )
        .populate(
          "recruiter",
          "name email"
        );

    return res.status(201).json({
      success: true,
      message: "Application submitted successfully.",
      application: populatedApplication,
    });
  } catch (error) {
    console.error(
      "Apply for job error:",
      error
    );

    // Duplicate key protection
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "You have already applied for this job.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Unable to submit application.",
    });
  }
};

export const getRecruiterDashboard = async (req, res) => {
  try {
    const recruiterId =
      req.user?._id || req.user?.id;

    if (!recruiterId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const recruiter =
      await User.findById(recruiterId).select(
        "name email role"
      );

    if (!recruiter) {
      return res.status(404).json({
        success: false,
        message: "Recruiter not found.",
      });
    }

    if (recruiter.role !== "recruiter") {
      return res.status(403).json({
        success: false,
        message:
          "Only recruiters can access this dashboard.",
      });
    }

    // =====================================================
    // JOB STATISTICS
    // =====================================================

    const totalJobs = await Job.countDocuments({
      recruiter: recruiterId,
    });

    const activeJobs = await Job.countDocuments({
      recruiter: recruiterId,
      status: "active",
    });

    const closedJobs = await Job.countDocuments({
      recruiter: recruiterId,
      status: "closed",
    });

    // =====================================================
    // APPLICATION STATISTICS
    // =====================================================

    const totalApplications =
      await Application.countDocuments({
        recruiter: recruiterId,
      });

    const interviews =
      await Application.countDocuments({
        recruiter: recruiterId,
        status: "interview",
      });

    const hired =
      await Application.countDocuments({
        recruiter: recruiterId,
        status: "accepted",
      });

    // =====================================================
    // TOTAL VIEWS
    // =====================================================

    const viewsResult = await Job.aggregate([
      {
        $match: {
          recruiter:
            new mongoose.Types.ObjectId(
              recruiterId
            ),
        },
      },
      {
        $group: {
          _id: null,
          totalViews: {
            $sum: {
              $ifNull: ["$views", 0],
            },
          },
        },
      },
    ]);

    const totalViews =
      viewsResult.length > 0
        ? viewsResult[0].totalViews
        : 0;

    // =====================================================
    // RECENT JOBS
    // =====================================================

    const recentJobs =
      await Job.find({
        recruiter: recruiterId,
      })
        .populate("company")
        .sort({
          createdAt: -1,
        })
        .limit(5);

    // =====================================================
    // RECENT APPLICATIONS
    // =====================================================

    const recentApplications =
      await Application.find({
        recruiter: recruiterId,
      })
        .populate(
          "candidate",
          "name email phone"
        )
        .populate(
          "job",
          "title location"
        )
        .sort({
          createdAt: -1,
        })
        .limit(5);

    // =====================================================
    // RESPONSE
    // =====================================================

    return res.status(200).json({
      success: true,

      recruiter: {
        id: recruiter._id,
        name: recruiter.name,
        email: recruiter.email,
        role: recruiter.role,
      },

      statistics: {
        totalJobs,
        activeJobs,
        closedJobs,
        totalApplications,
        applications: totalApplications,
        interviews,
        hired,
        totalViews,
      },

      // Keep stats too for compatibility
      stats: {
        totalJobs,
        activeJobs,
        closedJobs,
        totalApplications,
        applications: totalApplications,
        interviews,
        hired,
        totalViews,
      },

      recentJobs,

      recentApplications,
    });
  } catch (error) {
    console.error(
      "Get recruiter dashboard error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to load recruiter dashboard.",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};

// =====================================================
// GET RECRUITER APPLICATIONS
// =====================================================

export const getRecruiterApplications = async (
  req,
  res
) => {
  try {
    const recruiterId =
      req.user?._id || req.user?.id;

    if (!recruiterId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const recruiter =
      await User.findById(recruiterId).select(
        "name email role"
      );

    if (!recruiter) {
      return res.status(404).json({
        success: false,
        message: "Recruiter not found.",
      });
    }

    if (recruiter.role !== "recruiter") {
      return res.status(403).json({
        success: false,
        message:
          "Only recruiters can view applications.",
      });
    }

    const applications =
      await Application.find({
        recruiter: recruiterId,
      })
        .populate(
          "candidate",
          "name email phone"
        )
        .populate(
          "job",
          "title location workMode jobType"
        )
        .sort({
          createdAt: -1,
        });

    return res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    console.error(
      "Get recruiter applications error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to load recruiter applications.",
    });
  }
};

// =====================================================
// GET SINGLE APPLICATION
// =====================================================

export const getApplicationById = async (
  req,
  res
) => {
  try {
    const recruiterId =
      req.user?._id || req.user?.id;

    const { id } = req.params;

    if (!recruiterId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid application ID.",
      });
    }

    const application =
      await Application.findOne({
        _id: id,
        recruiter: recruiterId,
      })
        .populate(
          "candidate",
          "name email phone"
        )
        .populate(
          "job",
          "title description location workMode jobType experience salaryMin salaryMax salaryCurrency"
        )
        .populate(
          "recruiter",
          "name email"
        );

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found.",
      });
    }

    return res.status(200).json({
      success: true,
      application,
    });
  } catch (error) {
    console.error(
      "Get application error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to load application.",
    });
  }
};

// =====================================================
// UPDATE APPLICATION STATUS
// =====================================================

export const updateApplicationStatus = async (
  req,
  res
) => {
  try {
    const recruiterId =
      req.user?._id || req.user?.id;

    const { id } = req.params;
    const { status } = req.body;

    if (!recruiterId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid application ID.",
      });
    }

    const allowedStatuses = [
      "pending",
      "reviewing",
      "interview",
      "accepted",
      "rejected",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid application status.",
      });
    }

    const application =
      await Application.findOne({
        _id: id,
        recruiter: recruiterId,
      });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found.",
      });
    }

    application.status = status;

    await application.save();

    const updatedApplication =
      await Application.findById(application._id)
        .populate(
          "candidate",
          "name email phone"
        )
        .populate(
          "job",
          "title location"
        );

    return res.status(200).json({
      success: true,
      message:
        "Application status updated successfully.",
      application: updatedApplication,
    });
  } catch (error) {
    console.error(
      "Update application status error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to update application status.",
    });
  }
};

// =====================================================
// GET CANDIDATE APPLICATIONS
// =====================================================

export const getCandidateApplications = async (
  req,
  res
) => {
  try {
    const candidateId =
      req.user?._id || req.user?.id;

    if (!candidateId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const applications =
      await Application.find({
        candidate: candidateId,
      })
        .populate(
          "job",
          "title location workMode jobType company"
        )
        .populate(
          "recruiter",
          "name email"
        )
        .sort({
          createdAt: -1,
        });

    return res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    console.error(
      "Get candidate applications error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to load your applications.",
    });
  }
};