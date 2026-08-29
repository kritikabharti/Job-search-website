import { Link, useNavigate } from "react-router-dom";
import {
  FiBriefcase,
  FiMenu,
  FiX,
  FiLogOut,
  FiUser,
} from "react-icons/fi";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const { user, isAuthenticated, logout } = useAuth();

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate("/", { replace: true });
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  /*
   * Normalize role so navigation works even if
   * backend returns "Candidate", "CANDIDATE", etc.
   */
  const role = String(user?.role || "")
    .trim()
    .toLowerCase();

  /*
   * Get the correct dashboard URL for the
   * currently logged-in user.
   */
  const getDashboardPath = () => {
    if (role === "admin") {
      return "/admin/dashboard";
    }

    if (role === "recruiter") {
      return "/recruiter/dashboard";
    }

    if (role === "candidate") {
      return "/candidate/dashboard";
    }

    /*
     * Fallback for an authenticated user with
     * an unexpected/missing role.
     */
    return "/candidate/dashboard";
  };

  const dashboardPath = getDashboardPath();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-6">

        {/* =====================================================
            LOGO
        ====================================================== */}
        <Link
          to="/"
          onClick={closeMenu}
          className="flex items-center gap-2"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white">
            <FiBriefcase size={20} />
          </div>

          <span className="text-xl font-bold tracking-tight text-slate-900">
            Jobify
          </span>
        </Link>

        {/* =====================================================
            DESKTOP NAVIGATION
        ====================================================== */}
        <nav className="hidden items-center gap-8 md:flex">

          <Link
            to="/jobs"
            className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
          >
            Find Jobs
          </Link>

          <Link
            to="/companies"
            className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
          >
            Companies
          </Link>

          <Link
            to="/pricing"
            className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
          >
            Pricing
          </Link>

          <Link
            to="/about"
            className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
          >
            About
          </Link>

        </nav>

        {/* =====================================================
            DESKTOP ACTIONS
        ====================================================== */}
        <div className="hidden items-center gap-3 md:flex">

          {isAuthenticated ? (
            <>
              {/* =================================================
                  LOGGED-IN USER / DASHBOARD LINK
              ================================================== */}
              <Link
                to={dashboardPath}
                className="flex items-center gap-3 rounded-lg px-3 py-2 transition hover:bg-slate-50"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  <FiUser size={18} />
                </div>

                <div>
                  <p className="max-w-[140px] truncate text-sm font-semibold text-slate-900">
                    {user?.name || "User"}
                  </p>

                  <p className="text-xs capitalize text-slate-500">
                    {role || "candidate"}
                  </p>
                </div>
              </Link>

              {/* =================================================
                  LOGOUT
              ================================================== */}
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-red-300 hover:bg-red-50 hover:text-red-600"
              >
                <FiLogOut size={17} />

                Logout
              </button>
            </>
          ) : (
            <>
              {/* =================================================
                  LOGIN
              ================================================== */}
              <Link
                to="/login"
                className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                Login
              </Link>

              {/* =================================================
                  REGISTER
              ================================================== */}
              <Link
                to="/register"
                className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Get Started
              </Link>
            </>
          )}

        </div>

        {/* =====================================================
            MOBILE MENU BUTTON
        ====================================================== */}
        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className="rounded-lg p-2 text-slate-700 md:hidden"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? (
            <FiX size={24} />
          ) : (
            <FiMenu size={24} />
          )}
        </button>
      </div>

      {/* =======================================================
          MOBILE MENU
      ======================================================== */}
      {menuOpen && (
        <div className="border-t border-slate-200 bg-white px-6 py-5 md:hidden">

          <div className="flex flex-col gap-4">

            {/* =================================================
                FIND JOBS
            ================================================== */}
            <Link
              to="/jobs"
              onClick={closeMenu}
              className="text-sm font-medium text-slate-700"
            >
              Find Jobs
            </Link>

            {/* =================================================
                COMPANIES
            ================================================== */}
            <Link
              to="/companies"
              onClick={closeMenu}
              className="text-sm font-medium text-slate-700"
            >
              Companies
            </Link>

            {/* =================================================
                PRICING
            ================================================== */}
            <Link
              to="/pricing"
              onClick={closeMenu}
              className="text-sm font-medium text-slate-700"
            >
              Pricing
            </Link>

            {/* =================================================
                ABOUT
            ================================================== */}
            <Link
              to="/about"
              onClick={closeMenu}
              className="text-sm font-medium text-slate-700"
            >
              About
            </Link>

            <div className="mt-2 border-t border-slate-200 pt-4">

              {isAuthenticated ? (
                <div className="space-y-4">

                  {/* =================================================
                      MOBILE USER / DASHBOARD
                  ================================================== */}
                  <Link
                    to={dashboardPath}
                    onClick={closeMenu}
                    className="flex items-center gap-3 rounded-xl bg-slate-50 p-4"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                      <FiUser size={19} />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {user?.name || "User"}
                      </p>

                      <p className="text-xs capitalize text-slate-500">
                        {role || "candidate"}
                      </p>
                    </div>
                  </Link>

                  {/* =================================================
                      MOBILE LOGOUT
                  ================================================== */}
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                  >
                    <FiLogOut size={17} />

                    Logout
                  </button>

                </div>
              ) : (
                <div className="flex gap-3">

                  {/* =================================================
                      MOBILE LOGIN
                  ================================================== */}
                  <Link
                    to="/login"
                    onClick={closeMenu}
                    className="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-center text-sm font-semibold"
                  >
                    Login
                  </Link>

                  {/* =================================================
                      MOBILE REGISTER
                  ================================================== */}
                  <Link
                    to="/register"
                    onClick={closeMenu}
                    className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-center text-sm font-semibold text-white"
                  >
                    Register
                  </Link>

                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </header>
  );
}