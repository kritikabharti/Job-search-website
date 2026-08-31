import mongoose from "mongoose";
import fs from "fs";
import path from "path";
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
        message: "Only jobseekers can apply for jobs.",
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

    const applicationResume = String(resume || candidate.resume || "").trim();

    const application = await Application.create({
      candidate: candidateId,
      job: job._id,
      recruiter: job.recruiter,
      coverLetter: String(coverLetter).trim(),
      resume: applicationResume,
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
          "name email phone resume profileImage"
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
        "name email role resumeFreeDownloadsUsed resumeCredits"
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
          "name email phone resume profileImage headline location skills education experience linkedin portfolio"
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
        resumeFreeDownloadsUsed: recruiter.resumeFreeDownloadsUsed || 0,
        resumeFreeDownloadsRemaining: Math.max(0, 10 - (recruiter.resumeFreeDownloadsUsed || 0)),
        resumeCredits: recruiter.resumeCredits || 0,
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

      resumeAccess: {
        freeDownloadsTotal: 10,
        freeDownloadsUsed: recruiter.resumeFreeDownloadsUsed || 0,
        freeDownloadsRemaining: Math.max(0, 10 - (recruiter.resumeFreeDownloadsUsed || 0)),
        credits: recruiter.resumeCredits || 0,
      },
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
          "name email phone resume profileImage headline location skills education experience linkedin portfolio"
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
          "name email phone resume profileImage headline location skills education experience linkedin portfolio"
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
    const { status, interviewDate, notes } = req.body;

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

    if (interviewDate !== undefined) {
      application.interviewDate = interviewDate ? new Date(interviewDate) : null;
    }

    if (notes !== undefined) {
      application.recruiterNotes = String(notes).trim();
      application.interviewNotes = String(notes).trim();
    }

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
// DOWNLOAD CANDIDATE RESUME
// =====================================================
//
// Recruiters get 10 free candidate-resume downloads. After the
// free allowance is exhausted, one resume credit is consumed for
// each NEW application resume unlocked. Re-downloading a resume
// already unlocked for the recruiter does not consume another unit.
//
export const downloadCandidateResume = async (req, res) => {
  try {
    const recruiterId = req.user?._id || req.user?.id;
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

    const application = await Application.findOne({
      _id: id,
      recruiter: recruiterId,
    }).populate("candidate", "name email resume");

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found.",
      });
    }

    const storedResume = String(
      application.resume || application.candidate?.resume || ""
    ).trim();

    if (!storedResume) {
      return res.status(404).json({
        success: false,
        message: "This candidate has not uploaded a resume.",
      });
    }

    // Candidate resumes created by Jobify are stored in /uploads.
    // Reject arbitrary external paths instead of allowing a recruiter
    // to make the server fetch an unrelated URL.
    let filename = storedResume;
    if (/^https?:\/\//i.test(filename)) {
      try {
        const parsed = new URL(filename);
        if (parsed.origin !== `${req.protocol}://${req.get("host")}`) {
          return res.status(400).json({
            success: false,
            message: "This resume is stored at an external location and cannot be downloaded through Jobify.",
          });
        }
        filename = parsed.pathname;
      } catch {
        return res.status(400).json({
          success: false,
          message: "Invalid resume file URL.",
        });
      }
    }

    filename = path.basename(
      String(filename)
        .replace(/^\/+/, "")
        .replace(/^uploads[\\/]/i, "")
    );

    const filePath = path.join(process.cwd(), "uploads", filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: "Resume file is no longer available on the server.",
      });
    }

    let accessSource = "already-unlocked";

    // Claim this application exactly once before charging access.
    // This prevents double-clicks/concurrent requests from consuming
    // more than one free download or credit for the same application.
    if (!application.resumeDownloaded) {
      const claimed = await Application.findOneAndUpdate(
        {
          _id: application._id,
          recruiter: recruiterId,
          resumeDownloaded: false,
        },
        {
          $set: {
            resumeDownloaded: true,
            resumeDownloadedAt: new Date(),
          },
        },
        { new: true }
      );

      if (!claimed) {
        // Another request unlocked it while this request was running.
        application.resumeDownloaded = true;
      } else {
        // Use the free allowance first.
        const freeUpdated = await User.findOneAndUpdate(
          {
            _id: recruiterId,
            role: "recruiter",
            $or: [
              { resumeFreeDownloadsUsed: { $lt: 10 } },
              { resumeFreeDownloadsUsed: { $exists: false } },
            ],
          },
          { $inc: { resumeFreeDownloadsUsed: 1 } },
          { new: true }
        ).select("resumeFreeDownloadsUsed resumeCredits");

        if (freeUpdated) {
          accessSource = "free";
        } else {
          // Free allowance exhausted: consume one paid credit.
          const creditUpdated = await User.findOneAndUpdate(
            {
              _id: recruiterId,
              role: "recruiter",
              resumeCredits: { $gt: 0 },
            },
            { $inc: { resumeCredits: -1 } },
            { new: true }
          ).select("resumeFreeDownloadsUsed resumeCredits");

          if (!creditUpdated) {
            // No access was available. Roll back the application claim.
            await Application.findOneAndUpdate(
              {
                _id: application._id,
                recruiter: recruiterId,
                resumeDownloaded: true,
              },
              {
                $set: {
                  resumeDownloaded: false,
                  resumeDownloadedAt: null,
                },
              }
            );

            return res.status(402).json({
              success: false,
              code: "RESUME_CREDITS_REQUIRED",
              message: "Your 10 free resume downloads are used. Please add resume credits to download more candidate resumes.",
              freeDownloadsTotal: 10,
              freeDownloadsRemaining: 0,
              credits: 0,
            });
          }

          accessSource = "credit";
        }
      }
    }

    const recruiter = await User.findById(recruiterId).select(
      "resumeFreeDownloadsUsed resumeCredits"
    );

    const freeUsed = recruiter?.resumeFreeDownloadsUsed || 0;
    const credits = recruiter?.resumeCredits || 0;

    res.setHeader("Cache-Control", "no-store");
    res.setHeader("X-Resume-Access", accessSource);
    res.setHeader("X-Free-Downloads-Remaining", String(Math.max(0, 10 - freeUsed)));
    res.setHeader("X-Resume-Credits", String(credits));

    const extension = path.extname(filename) || ".pdf";
    const candidateName = String(application.candidate?.name || "candidate")
      .replace(/[^a-zA-Z0-9_-]+/g, "-")
      .replace(/^-+|-+$/g, "") || "candidate";

    return res.download(
      filePath,
      `${candidateName}-resume${extension}`,
      (error) => {
        if (error && !res.headersSent) {
          console.error("Resume download error:", error);
          res.status(500).json({
            success: false,
            message: "Unable to download resume.",
          });
        }
      }
    );
  } catch (error) {
    console.error("Download candidate resume error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to download candidate resume.",
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