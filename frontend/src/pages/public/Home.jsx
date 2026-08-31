import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiSearch,
  FiMapPin,
  FiBriefcase,
  FiArrowRight,
  FiUsers,
  FiFileText,
  FiTrendingUp,
} from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";

const categories = [
  "Software Development",
  "Marketing",
  "Finance",
  "Human Resources",
  "Sales",
  "Design",
  "Healthcare",
  "Engineering",
];

const popularSearches = [
  "React Developer",
  "Software Engineer",
  "Marketing Manager",
  "Data Analyst",
];

export default function Home() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");

  /* ---------------- SEARCH JOBS ---------------- */

  const handleSearch = (e) => {
    e?.preventDefault();

    const params = new URLSearchParams();

    if (keyword.trim()) {
      params.set("keyword", keyword.trim());
    }

    if (location.trim()) {
      params.set("location", location.trim());
    }

    const query = params.toString();

    navigate(query ? `/jobs?${query}` : "/jobs");
  };

  /* ---------------- POPULAR SEARCH ---------------- */

  const handlePopularSearch = (search) => {
    setKeyword(search);

    navigate(`/jobs?keyword=${encodeURIComponent(search)}`);
  };

  /* ---------------- CATEGORY ---------------- */

  const handleCategory = (category) => {
    navigate(`/jobs?category=${encodeURIComponent(category)}`);
  };

  /* ---------------- START HIRING ---------------- */

  const handleStartHiring = () => {
    if (!isAuthenticated) {
      navigate("/register?role=recruiter");
      return;
    }

    if (user?.role === "recruiter") {
      navigate("/recruiter/jobs/create");
      return;
    }

    navigate("/recruiter/jobs/create");
  };

  return (
    <div>

      {/* =========================================================
          HERO
      ========================================================= */}

      <section className="bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:py-28">

          <div className="mx-auto max-w-4xl text-center">

            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
              <FiTrendingUp />
              Find opportunities that match your potential
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Find your next
              <span className="text-blue-600">
                {" "}career opportunity
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              Discover jobs from leading companies, build your professional
              profile, and take the next step in your career.
            </p>

            {/* =====================================================
                SEARCH
            ===================================================== */}

            <form
              onSubmit={handleSearch}
              className="mx-auto mt-10 rounded-2xl bg-white p-3 shadow-xl ring-1 ring-slate-200"
            >
              <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">

                {/* Keyword */}
                <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 transition focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">

                  <FiSearch className="shrink-0 text-slate-400" />

                  <input
                    type="text"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="Job title, skills or keywords"
                    className="w-full bg-transparent text-sm outline-none"
                    aria-label="Job title, skills or keywords"
                  />

                </div>

                {/* Location */}
                <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 transition focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">

                  <FiMapPin className="shrink-0 text-slate-400" />

                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Location"
                    className="w-full bg-transparent text-sm outline-none"
                    aria-label="Location"
                  />

                </div>

                {/* Search button */}
                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 py-3 font-semibold text-white transition hover:bg-blue-700 active:scale-[0.98]"
                >
                  <FiSearch />
                  Search Jobs
                </button>

              </div>
            </form>

            {/* =====================================================
                POPULAR SEARCHES
            ===================================================== */}

            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-sm">

              <span className="text-slate-500">
                Popular:
              </span>

              {popularSearches.map((search) => (
                <button
                  key={search}
                  type="button"
                  onClick={() => handlePopularSearch(search)}
                  className="rounded-full px-2 py-1 font-medium text-slate-600 transition hover:bg-blue-50 hover:text-blue-600"
                >
                  {search}
                </button>
              ))}

            </div>

          </div>
        </div>
      </section>


      {/* =========================================================
          CATEGORIES
      ========================================================= */}

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6">

          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">

            <div>

              <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
                Explore opportunities
              </p>

              <h2 className="mt-2 text-3xl font-bold text-slate-950">
                Popular job categories
              </h2>

              <p className="mt-3 text-slate-600">
                Explore roles across industries and find opportunities that
                match your skills.
              </p>

            </div>

            <button
              type="button"
              onClick={() => navigate("/jobs")}
              className="flex items-center gap-2 font-semibold text-blue-600 transition hover:text-blue-700"
            >
              View all
              <FiArrowRight />
            </button>

          </div>


          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            {categories.map((category) => (

              <button
                key={category}
                type="button"
                onClick={() => handleCategory(category)}
                className="group rounded-xl border border-slate-200 bg-white p-6 text-left transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
              >

                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <FiBriefcase size={20} />
                </div>

                <h3 className="mt-5 font-semibold text-slate-900">
                  {category}
                </h3>

                <div className="mt-2 flex items-center gap-2 text-sm text-slate-500 transition group-hover:text-blue-600">
                  Explore jobs
                  <FiArrowRight />
                </div>

              </button>

            ))}

          </div>

        </div>
      </section>


      {/* =========================================================
          PLATFORM FEATURES
      ========================================================= */}

      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-6">

          <div className="mx-auto max-w-2xl text-center">

            <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
              One platform
            </p>

            <h2 className="mt-2 text-3xl font-bold text-slate-950">
              Everything you need to move your career forward
            </h2>

          </div>


          <div className="mt-12 grid gap-6 md:grid-cols-3">

            {/* Profile */}
            <button
              type="button"
              onClick={() => {
                if (isAuthenticated) {
                  navigate(
                    user?.role === "recruiter"
                      ? "/recruiter/profile"
                      : user?.role === "admin"
                      ? "/admin/dashboard"
                      : "/candidate/profile"
                  );
                } else {
                  navigate("/login");
                }
              }}
              className="rounded-2xl bg-white p-8 text-left shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-lg"
            >

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <FiUsers size={22} />
              </div>

              <h3 className="mt-6 text-xl font-bold">
                Professional Profile
              </h3>

              <p className="mt-3 leading-7 text-slate-600">
                Build a professional profile that showcases your skills,
                experience, education and achievements.
              </p>

              <span className="mt-5 flex items-center gap-2 text-sm font-semibold text-blue-600">
                {isAuthenticated ? "View profile" : "Create profile"}
                <FiArrowRight />
              </span>

            </button>


            {/* Find Jobs */}
            <button
              type="button"
              onClick={() => navigate("/jobs")}
              className="rounded-2xl bg-white p-8 text-left shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-lg"
            >

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <FiBriefcase size={22} />
              </div>

              <h3 className="mt-6 text-xl font-bold">
                Find Better Jobs
              </h3>

              <p className="mt-3 leading-7 text-slate-600">
                Search thousands of opportunities using powerful filters and
                personalized job recommendations.
              </p>

              <span className="mt-5 flex items-center gap-2 text-sm font-semibold text-blue-600">
                Browse jobs
                <FiArrowRight />
              </span>

            </button>


            {/* Recruitment */}
            <button
              type="button"
              onClick={handleStartHiring}
              className="rounded-2xl bg-white p-8 text-left shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-lg"
            >

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <FiFileText size={22} />
              </div>

              <h3 className="mt-6 text-xl font-bold">
                Smart Recruitment
              </h3>

              <p className="mt-3 leading-7 text-slate-600">
                Employers can discover qualified candidates and manage the
                entire hiring process from one platform.
              </p>

              <span className="mt-5 flex items-center gap-2 text-sm font-semibold text-blue-600">
                Start recruiting
                <FiArrowRight />
              </span>

            </button>

          </div>

        </div>
      </section>


      {/* =========================================================
          EMPLOYER CTA
      ========================================================= */}

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6">

          <div className="rounded-3xl bg-blue-600 px-8 py-14 text-white md:px-14">

            <div className="max-w-3xl">

              <p className="text-sm font-semibold uppercase tracking-wider text-blue-100">
                For employers
              </p>

              <h2 className="mt-3 text-3xl font-bold md:text-4xl">
                Find the right people for your team
              </h2>

              <p className="mt-5 max-w-2xl leading-7 text-blue-100">
                Post jobs, discover qualified candidates, manage applications,
                schedule interviews and build your hiring pipeline.
              </p>

              <button
                type="button"
                onClick={handleStartHiring}
                className="mt-8 flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-blue-600 transition hover:bg-blue-50 active:scale-[0.98]"
              >
                Start Hiring
                <FiArrowRight />
              </button>

            </div>

          </div>

        </div>
      </section>

    </div>
  );
}