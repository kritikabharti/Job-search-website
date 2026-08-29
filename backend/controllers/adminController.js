import User from "../models/User.js";
import Job from "../models/Job.js";
import Company from "../models/Company.js";
import Application from "../models/Application.js";

// =====================================================
// ADMIN DASHBOARD
// =====================================================

export const getAdminDashboard = async (req, res) => {
  try {
    // -----------------------------------------------
    // USERS
    // -----------------------------------------------

    const totalUsers = await User.countDocuments();

    const totalRecruiters = await User.countDocuments({
      role: "recruiter",
    });

    const totalJobseekers = await User.countDocuments({
      role: "jobseeker",
    });

    // -----------------------------------------------
    // JOBS
    // -----------------------------------------------

    const totalJobs = await Job.countDocuments();

    const activeJobs = await Job.countDocuments({
      status: "active",
    });

    // -----------------------------------------------
    // APPLICATIONS
    // -----------------------------------------------

    let totalApplications = 0;

    try {
      const Application = (await import(
        "../models/Application.js"
      )).default;

      totalApplications =
        await Application.countDocuments();
    } catch (error) {
      console.log(
        "Application model not available:",
        error.message
      );
    }

    // -----------------------------------------------
    // COMPANIES
    // -----------------------------------------------

    const totalCompanies =
      await Company.countDocuments();

    // -----------------------------------------------
    // RESPONSE
    // -----------------------------------------------

    return res.status(200).json({
      success: true,

      dashboard: {
        totalUsers,
        totalRecruiters,
        totalJobseekers,

        totalJobs,
        activeJobs,

        totalApplications,

        totalCompanies,
      },
    });
  } catch (error) {
    console.error(
      "Admin dashboard error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to load admin dashboard.",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};

const adminList = async (Model, query, select, populate = []) => {
  let request = Model.find(query).select(select).sort({ createdAt: -1 }).limit(200);
  for (const item of populate) {
    request = request.populate(item.path, item.select);
  }
  return request.lean();
};

export const getAdminUsers = async (req, res) => {
  try {
    const users = await adminList(
      User,
      {},
      "_id name email role isVerified isActive createdAt"
    );
    res.json({ success: true, users });
  } catch (error) {
    console.error("Admin users error:", error);
    res.status(500).json({ success: false, message: "Unable to load users." });
  }
};

export const getAdminRecruiters = async (req, res) => {
  try {
    const recruiters = await adminList(
      User,
      { role: "recruiter" },
      "_id name email role isVerified isActive company createdAt"
    );
    res.json({ success: true, recruiters });
  } catch (error) {
    console.error("Admin recruiters error:", error);
    res.status(500).json({ success: false, message: "Unable to load recruiters." });
  }
};

export const getAdminJobs = async (req, res) => {
  try {
    const jobs = await adminList(
      Job,
      {},
      "_id title status location jobType workMode recruiter company applicationsCount views createdAt",
      [
        { path: "recruiter", select: "name email" },
        { path: "company", select: "name logo" },
      ]
    );
    res.json({ success: true, jobs });
  } catch (error) {
    console.error("Admin jobs error:", error);
    res.status(500).json({ success: false, message: "Unable to load jobs." });
  }
};

export const getAdminApplications = async (req, res) => {
  try {
    const applications = await adminList(
      Application,
      {},
      "_id candidate job recruiter status createdAt interviewDate",
      [
        { path: "candidate", select: "name email" },
        { path: "job", select: "title location" },
        { path: "recruiter", select: "name email" },
      ]
    );
    res.json({ success: true, applications });
  } catch (error) {
    console.error("Admin applications error:", error);
    res.status(500).json({ success: false, message: "Unable to load applications." });
  }
};

export const getAdminCompanies = async (req, res) => {
  try {
    const companies = await adminList(
      Company,
      {},
      "_id name logo industry location website isVerified isActive recruiter createdAt",
      [{ path: "recruiter", select: "name email" }]
    );
    res.json({ success: true, companies });
  } catch (error) {
    console.error("Admin companies error:", error);
    res.status(500).json({ success: false, message: "Unable to load companies." });
  }
};
