import { Routes, Route } from "react-router-dom";

// =====================================================
// LAYOUTS
// =====================================================

import PublicLayout from "../layouts/PublicLayout";
import CandidateLayout from "../layouts/CandidateLayout";
import RecruiterLayout from "../layouts/RecruiterLayout";
import AdminLayout from "../layouts/AdminLayout";

// =====================================================
// PUBLIC PAGES
// =====================================================

import Home from "../pages/public/Home";
import Jobs from "../pages/public/Jobs";
import JobDetails from "../pages/public/JobDetails";
import Companies from "../pages/public/Companies";
import CompanyDetails from "../pages/public/CompanyDetails";
import Pricing from "../pages/public/Pricing";
import About from "../pages/public/About";
import Contact from "../pages/public/Contact";

// =====================================================
// CANDIDATE / JOBSEEKER
// =====================================================

import CandidateDashboard from "../pages/candidate/CandidateDashboard";
import CandidateApplications from "../pages/candidate/CandidateApplications";
import CandidateFavorites from "../pages/candidate/CandidateFavorites";

// =====================================================
// RECRUITER
// =====================================================

import RecruiterDashboard from "../pages/recruiter/RecruiterDashboard";
import PostJob from "../pages/recruiter/PostJob";
import ManageJobs from "../pages/recruiter/ManageJobs";
import RecruiterApplications from "../pages/recruiter/RecruiterApplications";
import RecruiterProfile from "../pages/recruiter/RecruiterProfile";

// =====================================================
// ADMIN
// =====================================================

import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminUsers from "../pages/admin/Users";
import AdminRecruiters from "../pages/admin/Recruiters";
import AdminJobs from "../pages/admin/Jobs";
import AdminApplications from "../pages/admin/Applications";
import AdminCompanies from "../pages/admin/Companies";

// =====================================================
// AUTH
// =====================================================

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";
import VerifyOTP from "../pages/auth/VerifyOTP";

export default function AppRoutes() {
  return (
    <Routes>

      {/* =====================================================
          PUBLIC ROUTES
      ===================================================== */}

      <Route element={<PublicLayout />}>

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/jobs"
          element={<Jobs />}
        />

        <Route
          path="/jobs/:id"
          element={<JobDetails />}
        />

        <Route
          path="/companies"
          element={<Companies />}
        />

        <Route
          path="/companies/:id"
          element={<CompanyDetails />}
        />

        <Route
          path="/pricing"
          element={<Pricing />}
        />

        <Route
          path="/about"
          element={<About />}
        />

        <Route
          path="/contact"
          element={<Contact />}
        />

      </Route>


      {/* =====================================================
          CANDIDATE / JOBSEEKER ROUTES
      ===================================================== */}

      <Route element={<CandidateLayout />}>

        <Route
          path="/candidate/dashboard"
          element={<CandidateDashboard />}
        />

        <Route
          path="/candidate/applications"
          element={<CandidateApplications />}
        />

        <Route
          path="/candidate/favorites"
          element={<CandidateFavorites />}
        />

      </Route>


      {/* =====================================================
          RECRUITER ROUTES
      ===================================================== */}

      <Route element={<RecruiterLayout />}>

        <Route
          path="/recruiter/dashboard"
          element={<RecruiterDashboard />}
        />

        <Route
          path="/recruiter/jobs/create"
          element={<PostJob />}
        />

        <Route
          path="/recruiter/jobs"
          element={<ManageJobs />}
        />

        <Route
          path="/recruiter/applications"
          element={<RecruiterApplications />}
        />

        <Route
          path="/recruiter/profile"
          element={<RecruiterProfile />}
        />

      </Route>


      {/* =====================================================
          ADMIN ROUTES
      ===================================================== */}

      <Route element={<AdminLayout />}>

        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/recruiters" element={<AdminRecruiters />} />
        <Route path="/admin/jobs" element={<AdminJobs />} />
        <Route path="/admin/applications" element={<AdminApplications />} />
        <Route path="/admin/companies" element={<AdminCompanies />} />

      </Route>


      {/* =====================================================
          AUTH ROUTES
      ===================================================== */}

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      <Route
        path="/forgot-password"
        element={<ForgotPassword />}
      />

      <Route
        path="/reset-password/:token"
        element={<ResetPassword />}
      />

      <Route
        path="/verify-otp"
        element={<VerifyOTP />}
      />

    </Routes>
  );
}