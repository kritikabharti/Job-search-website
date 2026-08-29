import mongoose from "mongoose";
import Job from "../models/Job.js";
import Company from "../models/Company.js";
import User from "../models/User.js";

// =====================================================
// CREATE JOB
// =====================================================

const normalizeWorkMode = (value) => {
  const normalized = String(value || "onsite").toLowerCase().trim();
  const map = {
    remote: "remote",
    hybrid: "hybrid",
    onsite: "onsite",
    "on-site": "onsite",
    "on site": "onsite",
  };
  return map[normalized] || "onsite";
};

const normalizeJobType = (value) => {
  const normalized = String(value || "full-time").toLowerCase().trim();
  const map = {
    "full-time": "full-time",
    "full time": "full-time",
    "part-time": "part-time",
    "part time": "part-time",
    contract: "contract",
    internship: "internship",
    freelance: "freelance",
    temporary: "contract",
  };
  return map[normalized] || "full-time";
};

export const createJob = async (req, res) => {
  try {
    const recruiterId = req.user?._id || req.user?.id;

    if (!recruiterId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const recruiter = await User.findById(recruiterId);

    if (!recruiter) {
      return res.status(404).json({
        success: false,
        message: "Recruiter not found.",
      });
    }

    if (recruiter.role !== "recruiter") {
      return res.status(403).json({
        success: false,
        message: "Only recruiters can create jobs.",
      });
    }

    const {
      company,
      title,
      description,
      location,
      workMode,
      jobType,
      experience,
      salaryMin,
      salaryMax,
      salaryCurrency,
      skills,
      requirements,
      responsibilities,
      applicationDeadline,
    } = req.body;

    if (!company) {
      return res.status(400).json({
        success: false,
        message: "Company is required.",
      });
    }

    let companyDoc = null;

    // Accept either a Company ObjectId or the company name used by the
    // existing PostJob form.
    if (mongoose.Types.ObjectId.isValid(company)) {
      companyDoc = await Company.findById(company);
    }

    if (!companyDoc) {
      const escapedName = String(company).trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      companyDoc = await Company.findOne({
        recruiter: recruiterId,
        name: { $regex: `^${escapedName}$`, $options: "i" },
      });
    }

    // If the recruiter has typed a new company name, create it automatically.
    if (!companyDoc) {
      companyDoc = await Company.create({
        recruiter: recruiterId,
        name: String(company).trim(),
        location: location?.trim() || "",
        isActive: true,
      });
    }

    if (!title?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Job title is required.",
      });
    }

    if (!description?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Job description is required.",
      });
    }

    if (!location?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Location is required.",
      });
    }

    if (
      salaryMin !== null &&
      salaryMin !== undefined &&
      salaryMin !== "" &&
      salaryMax !== null &&
      salaryMax !== undefined &&
      salaryMax !== "" &&
      Number(salaryMin) > Number(salaryMax)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Minimum salary cannot be greater than maximum salary.",
      });
    }

    let deadline = null;

    if (applicationDeadline) {
      const parsedDeadline = new Date(applicationDeadline);

      if (Number.isNaN(parsedDeadline.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Invalid application deadline.",
        });
      }

      deadline = parsedDeadline;
    }

    const job = await Job.create({
      recruiter: recruiterId,
      company: companyDoc._id,

      title: title.trim(),
      description: description.trim(),
      location: location.trim(),

      workMode: normalizeWorkMode(workMode),
      jobType: normalizeJobType(jobType),

      experience: experience?.trim() || "",

      salaryMin:
        salaryMin === "" ||
        salaryMin === null ||
        salaryMin === undefined
          ? null
          : Number(salaryMin),

      salaryMax:
        salaryMax === "" ||
        salaryMax === null ||
        salaryMax === undefined
          ? null
          : Number(salaryMax),

      salaryCurrency: salaryCurrency || "INR",

      skills: Array.isArray(skills)
        ? skills.map((skill) => String(skill).trim()).filter(Boolean)
        : typeof skills === "string"
        ? skills.split(",").map((skill) => skill.trim()).filter(Boolean)
        : [],

      requirements: Array.isArray(requirements)
        ? requirements.map((item) => String(item).trim()).filter(Boolean)
        : typeof requirements === "string"
        ? requirements.split("\n").map((item) => item.trim()).filter(Boolean)
        : [],

      responsibilities: Array.isArray(responsibilities)
        ? responsibilities.map((item) => String(item).trim()).filter(Boolean)
        : typeof responsibilities === "string"
        ? responsibilities.split("\n").map((item) => item.trim()).filter(Boolean)
        : [],

      status: "active",

      applicationDeadline: deadline,

      views: 0,
      applicationsCount: 0,
    });

    const populatedJob = await Job.findById(job._id)
      .populate("recruiter", "name email")
      .populate("company");

    return res.status(201).json({
      success: true,
      message: "Job posted successfully.",
      job: populatedJob,
    });
  } catch (error) {
    console.error("Create job error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to create job.",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};

// =====================================================
// GET RECRUITER JOBS
// =====================================================

export const getRecruiterJobs = async (req, res) => {
  try {
    const recruiterId = req.user?._id || req.user?.id;

    if (!recruiterId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const jobs = await Job.find({
      recruiter: recruiterId,
    })
      .populate("company")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      jobs,
    });
  } catch (error) {
    console.error("Get recruiter jobs error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load recruiter jobs.",
    });
  }
};

// =====================================================
// GET SINGLE RECRUITER JOB
// =====================================================

export const getJobById = async (req, res) => {
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
        message: "Invalid job ID.",
      });
    }

    const job = await Job.findOne({
      _id: id,
      recruiter: recruiterId,
    })
      .populate("company")
      .populate("recruiter", "name email");

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found.",
      });
    }

    return res.status(200).json({
      success: true,
      job,
    });
  } catch (error) {
    console.error("Get job error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load job.",
    });
  }
};

// =====================================================
// UPDATE JOB
// =====================================================

export const updateJob = async (req, res) => {
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
        message: "Invalid job ID.",
      });
    }

    const job = await Job.findOne({
      _id: id,
      recruiter: recruiterId,
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found.",
      });
    }

    const allowedFields = [
      "title",
      "description",
      "location",
      "workMode",
      "jobType",
      "experience",
      "salaryMin",
      "salaryMax",
      "salaryCurrency",
      "skills",
      "requirements",
      "responsibilities",
      "applicationDeadline",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        job[field] = req.body[field];
      }
    });

    if (job.title) {
      job.title = job.title.trim();
    }

    if (job.description) {
      job.description = job.description.trim();
    }

    if (job.location) {
      job.location = job.location.trim();
    }

    if (
      job.salaryMin !== null &&
      job.salaryMin !== undefined &&
      job.salaryMax !== null &&
      job.salaryMax !== undefined &&
      Number(job.salaryMin) > Number(job.salaryMax)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Minimum salary cannot be greater than maximum salary.",
      });
    }

    await job.save();

    const updatedJob = await Job.findById(job._id)
      .populate("company")
      .populate("recruiter", "name email");

    return res.status(200).json({
      success: true,
      message: "Job updated successfully.",
      job: updatedJob,
    });
  } catch (error) {
    console.error("Update job error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update job.",
    });
  }
};

// =====================================================
// CLOSE JOB
// =====================================================

export const closeJob = async (req, res) => {
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
        message: "Invalid job ID.",
      });
    }

    const job = await Job.findOne({
      _id: id,
      recruiter: recruiterId,
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found.",
      });
    }

    job.status = "closed";

    await job.save();

    return res.status(200).json({
      success: true,
      message: "Job closed successfully.",
      job,
    });
  } catch (error) {
    console.error("Close job error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to close job.",
    });
  }
};

// =====================================================
// PUBLISH JOB
// =====================================================

export const publishJob = async (req, res) => {
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
        message: "Invalid job ID.",
      });
    }

    const job = await Job.findOne({
      _id: id,
      recruiter: recruiterId,
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found.",
      });
    }

    job.status = "active";

    await job.save();

    return res.status(200).json({
      success: true,
      message: "Job published successfully.",
      job,
    });
  } catch (error) {
    console.error("Publish job error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to publish job.",
    });
  }
};

// =====================================================
// DELETE JOB
// =====================================================

export const deleteJob = async (req, res) => {
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
        message: "Invalid job ID.",
      });
    }

    const job = await Job.findOneAndDelete({
      _id: id,
      recruiter: recruiterId,
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Job deleted successfully.",
    });
  } catch (error) {
    console.error("Delete job error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to delete job.",
    });
  }
};
// =====================================================
// PUBLIC ACTIVE JOBS
// =====================================================

export const getPublicJobs = async (req, res) => {
  try {
    const jobs = await Job.find({
      status: "active",
      $or: [
        { applicationDeadline: null },
        { applicationDeadline: { $gte: new Date() } },
      ],
    })
      .populate("company")
      .populate("recruiter", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    console.error("Get public jobs error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to load jobs.",
    });
  }
};

// =====================================================
// PUBLIC SINGLE ACTIVE JOB
// =====================================================

export const getPublicJobById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid job ID.",
      });
    }

    const job = await Job.findOne({
      _id: id,
      status: "active",
    })
      .populate("company")
      .populate("recruiter", "name email");

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found or no longer available.",
      });
    }

    if (
      job.applicationDeadline &&
      new Date() > new Date(job.applicationDeadline)
    ) {
      return res.status(404).json({
        success: false,
        message: "Applications for this job are closed.",
      });
    }

    // Increment views without making the page wait for it.
    await Job.findByIdAndUpdate(id, {
      $inc: { views: 1 },
    });

    return res.status(200).json({
      success: true,
      job,
    });
  } catch (error) {
    console.error("Get public job error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to load job.",
    });
  }
};
