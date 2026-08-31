import { Routes, Route } from "react-router-dom";
import PublicLayout from "../layouts/PublicLayout";
import ProtectedRoute from "./ProtectedRoute";

// Public pages
import Home from "../pages/public/Home";
import Jobs from "../pages/public/Jobs";
import JobDetails from "../pages/public/JobDetails";
import Companies from "../pages/public/Companies";
import CompanyDetails from "../pages/public/CompanyDetails";
import Pricing from "../pages/public/Pricing";
import About from "../pages/public/About";
import Contact from "../pages/public/Contact";

// Candidate / Jobseeker
import CandidateDashboard from "../pages/candidate/CandidateDashboard";
import CandidateProfile from "../pages/candidate/CandidateProfile";
import CandidateApplications from "../pages/candidate/CandidateApplications";
import CandidateFavorites from "../pages/candidate/CandidateFavorites";

// Recruiter
import RecruiterDashboard from "../pages/recruiter/RecruiterDashboard";
import PostJob from "../pages/recruiter/PostJob";
import ManageJobs from "../pages/recruiter/ManageJobs";
import RecruiterApplications from "../pages/recruiter/RecruiterApplications";
import RecruiterProfile from "../pages/recruiter/RecruiterProfile";
import ViewApplications from "../pages/recruiter/ViewApplications";

// Admin
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminUsers from "../pages/admin/Users";
import AdminRecruiters from "../pages/admin/Recruiters";
import AdminJobs from "../pages/admin/Jobs";
import AdminApplications from "../pages/admin/Applications";
import AdminCompanies from "../pages/admin/Companies";

// Auth
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";
import VerifyOTP from "../pages/auth/VerifyOTP";

const Protected = ({ role, children }) => (
  <ProtectedRoute allowedRoles={[role]}>
    {children}
  </ProtectedRoute>
);

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/jobs/:id" element={<JobDetails />} />
        <Route path="/companies" element={<Companies />} />
        <Route path="/companies/:id" element={<CompanyDetails />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Route>

      {/* Candidate / Jobseeker */}
      <Route path="/dashboard" element={<Protected role="jobseeker"><CandidateDashboard /></Protected>} />
      <Route path="/candidate/dashboard" element={<Protected role="jobseeker"><CandidateDashboard /></Protected>} />
      <Route path="/candidate/profile" element={<Protected role="jobseeker"><CandidateProfile /></Protected>} />
      <Route path="/candidate/applications" element={<Protected role="jobseeker"><CandidateApplications /></Protected>} />
      <Route path="/candidate/favorites" element={<Protected role="jobseeker"><CandidateFavorites /></Protected>} />

      {/* Recruiter */}
      <Route path="/recruiter/dashboard" element={<Protected role="recruiter"><RecruiterDashboard /></Protected>} />
      <Route path="/recruiter/jobs/create" element={<Protected role="recruiter"><PostJob /></Protected>} />
      <Route path="/recruiter/jobs" element={<Protected role="recruiter"><ManageJobs /></Protected>} />
      <Route path="/recruiter/applications" element={<Protected role="recruiter"><RecruiterApplications /></Protected>} />
      <Route path="/recruiter/applications/view" element={<Protected role="recruiter"><ViewApplications /></Protected>} />
      <Route path="/recruiter/profile" element={<Protected role="recruiter"><RecruiterProfile /></Protected>} />

      {/* Admin */}
      <Route path="/admin/dashboard" element={<Protected role="admin"><AdminDashboard /></Protected>} />
      <Route path="/admin/users" element={<Protected role="admin"><AdminUsers /></Protected>} />
      <Route path="/admin/recruiters" element={<Protected role="admin"><AdminRecruiters /></Protected>} />
      <Route path="/admin/jobs" element={<Protected role="admin"><AdminJobs /></Protected>} />
      <Route path="/admin/applications" element={<Protected role="admin"><AdminApplications /></Protected>} />
      <Route path="/admin/companies" element={<Protected role="admin"><AdminCompanies /></Protected>} />

      {/* Auth */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/verify-otp" element={<VerifyOTP />} />

      <Route path="*" element={<NavigateFallback />} />
    </Routes>
  );
}

function NavigateFallback() {
  return <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6"><div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm"><h1 className="text-xl font-bold text-slate-900">Page not found</h1><p className="mt-2 text-sm text-slate-500">The page you requested does not exist.</p><a href="/" className="mt-5 inline-block rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white">Go Home</a></div></div>;
}
