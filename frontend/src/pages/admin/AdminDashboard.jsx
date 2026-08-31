import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiBriefcase,
  FiUsers,
  FiUserCheck,
  FiFileText,
  FiCheckCircle,
  FiArrowRight,
  FiLogOut,
  FiShield,
  FiCreditCard,
  FiBarChart2,
  FiSettings,
  FiPackage,
  FiFlag,
  FiDollarSign,
  FiSliders,
} from "react-icons/fi";

import api from "../../services/api";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [dashboard, setDashboard] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!token || !storedUser) {
      navigate("/login");
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);

      if (parsedUser.role !== "admin") {
        navigate("/jobs");
        return;
      }

      setUser(parsedUser);
    } catch (error) {
      console.error("User parsing error:", error);

      localStorage.removeItem("user");
      localStorage.removeItem("token");

      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/admin/dashboard");

        console.log("Admin dashboard response:", response.data);

        if (response.data?.success) {
          setDashboard(response.data.dashboard);
        } else {
          setError(
            response.data?.message ||
              "Unable to load admin dashboard."
          );
        }
      } catch (error) {
        console.error(
          "Admin dashboard error:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Unable to load admin dashboard."
        );
      } finally {
        setLoading(false);
      }
    };

    const token = localStorage.getItem("token");

    if (token) {
      fetchDashboard();
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("rememberMe");

    navigate("/login");
  };

  const stats = {
    users: dashboard?.totalUsers ?? 0,
    recruiters: dashboard?.totalRecruiters ?? 0,
    jobseekers: dashboard?.totalJobseekers ?? 0,
    jobs: dashboard?.totalJobs ?? 0,
    activeJobs: dashboard?.activeJobs ?? 0,
    applications: dashboard?.totalApplications ?? 0,
    revenue: dashboard?.revenue ?? 0,
    openReports: dashboard?.openReports ?? 0,
  };

  return (
    <div className="min-h-screen bg-slate-50">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="border-b border-slate-200 bg-white">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          {/* Logo */}

          <Link
            to="/admin/dashboard"
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600">
              <FiBriefcase
                className="text-white"
                size={21}
              />
            </div>

            <span className="text-xl font-bold text-slate-950">
              Jobify
            </span>

            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
              Admin
            </span>
          </Link>

          {/* Right */}

          <div className="flex items-center gap-5">

            <div className="hidden text-right sm:block">

              <p className="text-sm font-semibold text-slate-900">
                {user?.name || "Administrator"}
              </p>

              <p className="text-xs text-slate-500">
                Administrator
              </p>

            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50">
              <FiShield
                className="text-blue-600"
                size={20}
              />
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-red-300 hover:bg-red-50 hover:text-red-600"
            >
              <FiLogOut size={17} />

              Logout
            </button>

          </div>

        </div>

      </header>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="mx-auto max-w-7xl px-6 py-10">

        {/* Heading */}

        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">

          <div>

            <p className="text-sm font-semibold text-blue-600">
              Admin Dashboard
            </p>

            <h1 className="mt-2 text-3xl font-bold text-slate-950">
              Welcome back,{" "}
              {user?.name || "Administrator"}
            </h1>

            <p className="mt-2 text-base text-slate-500">
              Manage users, recruiters, jobs and
              applications across Jobify.
            </p>

          </div>

          <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">

            <FiShield
              className="text-blue-600"
              size={20}
            />

            <div>

              <p className="text-xs font-medium text-slate-500">
                Account Type
              </p>

              <p className="text-sm font-semibold text-slate-900">
                Platform Administrator
              </p>

            </div>

          </div>

        </div>

        {/* =====================================================
            ERROR
        ===================================================== */}

        {error && (
          <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-700">
            {error}
          </div>
        )}

        {/* =====================================================
            STATS
        ===================================================== */}

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

          {/* Users */}

          <StatCard
            title="Total Users"
            value={loading ? "..." : stats.users}
            description="Registered users"
            icon={<FiUsers size={22} />}
          />

          {/* Recruiters */}

          <StatCard
            title="Recruiters"
            value={loading ? "..." : stats.recruiters}
            description="Registered recruiters"
            icon={<FiUserCheck size={22} />}
          />

          {/* Jobseekers */}

          <StatCard
            title="Jobseekers"
            value={loading ? "..." : stats.jobseekers}
            description="Active jobseekers"
            icon={<FiUsers size={22} />}
          />

          {/* Jobs */}

          <StatCard
            title="Total Jobs"
            value={loading ? "..." : stats.jobs}
            description="Jobs posted"
            icon={<FiBriefcase size={22} />}
          />

          {/* Active Jobs */}

          <StatCard
            title="Active Jobs"
            value={loading ? "..." : stats.activeJobs}
            description="Currently active"
            icon={<FiCheckCircle size={22} />}
          />

          {/* Applications */}

          <StatCard
            title="Applications"
            value={loading ? "..." : stats.applications}
            description="Applications received"
            icon={<FiFileText size={22} />}
          />

          <StatCard
            title="Revenue"
            value={loading ? "..." : `₹${Number(stats.revenue).toLocaleString("en-IN")}`}
            description="Paid CV package revenue"
            icon={<FiDollarSign size={22} />}
          />

          <StatCard
            title="Open Reports"
            value={loading ? "..." : stats.openReports}
            description="Reports requiring moderation"
            icon={<FiFlag size={22} />}
          />

        </div>

        {/* =====================================================
            QUICK ACTIONS
        ===================================================== */}

        <section className="mt-12">

          <h2 className="text-xl font-bold text-slate-950">
            Quick Actions
          </h2>

          <div className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-3">

            <AdminAction
              to="/admin/users"
              icon={<FiUsers size={22} />}
              title="Manage Users"
              description="View and manage all registered users."
            />

            <AdminAction
              to="/admin/recruiters"
              icon={<FiUserCheck size={22} />}
              title="Manage Recruiters"
              description="Review recruiter accounts and companies."
            />

            <AdminAction
              to="/admin/jobs"
              icon={<FiBriefcase size={22} />}
              title="Manage Jobs"
              description="Review, publish, close and delete jobs."
            />

            <AdminAction
              to="/admin/applications"
              icon={<FiFileText size={22} />}
              title="View Applications"
              description="Review applications submitted by candidates."
            />

            <AdminAction
              to="/admin/companies"
              icon={<FiBriefcase size={22} />}
              title="Manage Companies"
              description="View and manage registered companies."
            />

            <AdminAction
              to="/admin/packages"
              icon={<FiPackage size={22} />}
              title="CV Packages"
              description="Configure recruiter CV credit packages and prices."
            />

            <AdminAction
              to="/admin/payments"
              icon={<FiCreditCard size={22} />}
              title="Manage Payments"
              description="Monitor Razorpay payments and credit purchases."
            />

            <AdminAction
              to="/admin/reports"
              icon={<FiFlag size={22} />}
              title="Moderate Content"
              description="Review reports and resolve platform content issues."
            />

            <AdminAction
              to="/admin/analytics"
              icon={<FiBarChart2 size={22} />}
              title="Analytics & Revenue"
              description="Track growth, applications and platform revenue."
            />

            <AdminAction
              to="/admin/pricing"
              icon={<FiDollarSign size={22} />}
              title="Pricing"
              description="Configure free monthly CV allowance and credit rules."
            />

            <AdminAction
              to="/admin/commission"
              icon={<FiDollarSign size={22} />}
              title="Commission"
              description="Configure and review platform commission."
            />

            <AdminAction
              to="/admin/features"
              icon={<FiSliders size={22} />}
              title="Feature Configuration"
              description="Enable or disable platform capabilities."
            />

            <AdminAction
              to="/admin/settings"
              icon={<FiSettings size={22} />}
              title="System Settings"
              description="Configure platform-wide operational settings."
            />

          </div>

        </section>

        {/* =====================================================
            PLATFORM OVERVIEW
        ===================================================== */}

        <section className="mt-12">

          <div className="rounded-2xl border border-slate-200 bg-white">

            <div className="border-b border-slate-200 px-6 py-5">

              <h2 className="text-lg font-bold text-slate-950">
                Platform Overview
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Current Jobify platform statistics.
              </p>

            </div>

            <div className="grid divide-y divide-slate-200 md:grid-cols-3 md:divide-x md:divide-y-0">

              <OverviewItem
                icon={<FiUsers size={20} />}
                label="Users"
                value={stats.users}
              />

              <OverviewItem
                icon={<FiBriefcase size={20} />}
                label="Jobs"
                value={stats.jobs}
              />

              <OverviewItem
                icon={<FiFileText size={20} />}
                label="Applications"
                value={stats.applications}
              />

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}


/* ============================================================
   STAT CARD
============================================================ */

function StatCard({
  title,
  value,
  description,
  icon,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      <div className="flex items-start justify-between">

        <div>

          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <p className="mt-3 text-3xl font-bold text-slate-950">
            {value}
          </p>

          <p className="mt-2 text-sm text-slate-400">
            {description}
          </p>

        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          {icon}
        </div>

      </div>

    </div>
  );
}


/* ============================================================
   ADMIN ACTION
============================================================ */

function AdminAction({
  to,
  icon,
  title,
  description,
}) {
  return (
    <Link
      to={to}
      className="group rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
    >

      <div className="flex items-start justify-between">

        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          {icon}
        </div>

        <FiArrowRight
          size={21}
          className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-blue-600"
        />

      </div>

      <h3 className="mt-6 text-lg font-bold text-slate-950">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        {description}
      </p>

    </Link>
  );
}


/* ============================================================
   OVERVIEW ITEM
============================================================ */

function OverviewItem({
  icon,
  label,
  value,
}) {
  return (
    <div className="flex items-center gap-4 px-6 py-6">

      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
        {icon}
      </div>

      <div>

        <p className="text-sm text-slate-500">
          {label}
        </p>

        <p className="mt-1 text-xl font-bold text-slate-950">
          {value}
        </p>

      </div>

    </div>
  );
}