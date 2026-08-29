import mongoose from "mongoose";
import Company from "../models/Company.js";
import Job from "../models/Job.js";

export const getPublicCompanies = async (req, res) => {
  try {
    const companies = await Company.find({ isActive: true })
      .select("_id name logo industry description website location employeeCount isVerified isActive")
      .sort({ name: 1 })
      .lean();

    return res.status(200).json({
      success: true,
      companies,
    });
  } catch (error) {
    console.error("Get public companies error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to load companies.",
    });
  }
};

export const getPublicCompanyById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid company ID.",
      });
    }

    const company = await Company.findOne({
      _id: id,
      isActive: true,
    })
      .select("_id name logo industry description website location employeeCount isVerified isActive")
      .lean();

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found.",
      });
    }

    const jobs = await Job.find({
      company: id,
      status: "active",
    })
      .select("_id title location workMode jobType experience salaryMin salaryMax salaryCurrency skills applicationDeadline createdAt company")
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      company: {
        ...company,
        jobs,
      },
      jobs,
    });
  } catch (error) {
    console.error("Get public company error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to load company.",
    });
  }
};
