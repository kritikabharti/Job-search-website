import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiBriefcase,
  FiChevronDown,
  FiClock,
  FiHeart,
  FiMapPin,
  FiSearch,
  FiSliders,
} from "react-icons/fi";

import api from "../../services/api";

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("");
  const [workMode, setWorkMode] = useState("");
  const [experience, setExperience] = useState("");

  const [savedJobs, setSavedJobs] = useState([]);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/jobs");
      const data = response.data;

      setJobs(data.jobs || data.data || []);
    } catch (err) {
      console.error("Fetch jobs error:", err);
      setError("Unable to load jobs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleSave = (jobId) => {
    setSavedJobs((current) =>
      current.includes(jobId)
        ? current.filter((id) => id !== jobId)
        : [...current, jobId]
    );
  };

  const filteredJobs = jobs.filter((job) => {
    const searchValue = search.toLowerCase();

    const matchesSearch =
      !search ||
      job.title?.toLowerCase().includes(searchValue) ||
      job.company?.name?.toLowerCase().includes(searchValue) ||
      job.companyName?.toLowerCase().includes(searchValue) ||
      job.skills?.some((skill) =>
        skill.toLowerCase().includes(searchValue)
      );

    const matchesLocation =
      !location ||
      job.location?.toLowerCase().includes(location.toLowerCase());

    const matchesType =
      !jobType ||
      job.jobType === jobType ||
      job.type === jobType;

    const matchesMode =
      !workMode ||
      job.workMode === workMode ||
      job.mode === workMode;

    const matchesExperience =
      !experience ||
      job.experience === experience ||
      job.experienceLevel === experience;

    return (
      matchesSearch &&
      matchesLocation &&
      matchesType &&
      matchesMode &&
      matchesExperience
    );
  });

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Header */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-12">

          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            Job opportunities
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">
            Find your next job
          </h1>

          <p className="mt-3 max-w-2xl text-slate-600">
            Search jobs posted by verified recruiters and companies.
          </p>

          {/* Search */}
          <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-3">
            <div className="grid gap-3 lg:grid-cols-[1.5fr_1fr_auto]">

              <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
                <FiSearch className="shrink-0 text-slate-400" />

                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Job title, skills or company"
                  className="w-full bg-transparent text-sm outline-none"
                />
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
                <FiMapPin className="shrink-0 text-slate-400" />

                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Location"
                  className="w-full bg-transparent text-sm outline-none"
                />
              </div>

              <button className="rounded-xl bg-blue-600 px-8 py-3 font-semibold text-white transition hover:bg-blue-700">
                Search
              </button>

            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-10">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 lg:grid-cols-[260px_1fr]">

          {/* Filters */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 rounded-2xl border border-slate-200 bg-white p-6">

              <div className="flex items-center justify-between">
                <h2 className="font-bold text-slate-950">
                  Filters
                </h2>

                <FiSliders className="text-slate-400" />
              </div>

              <div className="mt-7">
                <label className="text-sm font-semibold text-slate-700">
                  Job Type
                </label>

                <select
                  value={jobType}
                  onChange={(e) => setJobType(e.target.value)}
                  className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none"
                >
                  <option value="">All types</option>
                  <option value="Full Time">Full Time</option>
                  <option value="Part Time">Part Time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>

              <div className="mt-6">
                <label className="text-sm font-semibold text-slate-700">
                  Work Mode
                </label>

                <select
                  value={workMode}
                  onChange={(e) => setWorkMode(e.target.value)}
                  className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none"
                >
                  <option value="">All modes</option>
                  <option value="Remote">Remote</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="On-site">On-site</option>
                </select>
              </div>

              <div className="mt-6">
                <label className="text-sm font-semibold text-slate-700">
                  Experience
                </label>

                <select
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none"
                >
                  <option value="">Any experience</option>
                  <option value="Fresher">Fresher</option>
                  <option value="0-1 Years">0-1 Years</option>
                  <option value="1-3 Years">1-3 Years</option>
                  <option value="3-5 Years">3-5 Years</option>
                  <option value="5+ Years">5+ Years</option>
                </select>
              </div>

              <button
                onClick={() => {
                  setSearch("");
                  setLocation("");
                  setJobType("");
                  setWorkMode("");
                  setExperience("");
                }}
                className="mt-7 w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700"
              >
                Clear Filters
              </button>

            </div>
          </aside>

          {/* Results */}
          <div>

            <div className="mb-5 flex items-center justify-between">

              <div>
                <p className="font-semibold text-slate-950">
                  {filteredJobs.length} jobs found
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Jobs posted by recruiters
                </p>
              </div>

              <button className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium">
                Most Relevant
                <FiChevronDown />
              </button>

            </div>

            {/* Loading */}
            {loading && (
              <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
                <p className="text-sm text-slate-500">
                  Loading available jobs...
                </p>
              </div>
            )}

            {/* Error */}
            {!loading && error && (
              <div className="rounded-2xl border border-red-200 bg-white p-12 text-center">
                <p className="font-medium text-red-600">
                  {error}
                </p>

                <button
                  onClick={fetchJobs}
                  className="mt-4 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* No jobs */}
            {!loading && !error && filteredJobs.length === 0 && (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">

                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                  <FiBriefcase className="text-slate-400" />
                </div>

                <h3 className="mt-5 text-lg font-bold text-slate-950">
                  No jobs available
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  There are currently no jobs matching your search.
                </p>

              </div>
            )}

            {/* Jobs from database */}
            {!loading && !error && filteredJobs.length > 0 && (
              <div className="space-y-4">

                {filteredJobs.map((job) => (
                  <article
                    key={job._id || job.id}
                    className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:border-blue-200 hover:shadow-md"
                  >

                    <div className="flex gap-5">

                      {/* Company Logo */}
                      <div className="hidden h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-100 sm:flex">

                        {job.company?.logo ? (
                          <img
                            src={job.company.logo}
                            alt={job.company?.name || "Company"}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <FiBriefcase className="text-slate-400" />
                        )}

                      </div>

                      <div className="min-w-0 flex-1">

                        <div className="flex items-start justify-between gap-4">

                          <div>

                            <Link
                              to={`/jobs/${job._id || job.id}`}
                              className="text-lg font-bold text-slate-950 hover:text-blue-600"
                            >
                              {job.title}
                            </Link>

                            <p className="mt-1 font-medium text-blue-600">
                              {job.company?.name ||
                                job.companyName ||
                                "Company"}
                            </p>

                          </div>

                          <button
                            onClick={() =>
                              toggleSave(job._id || job.id)
                            }
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:text-blue-600"
                          >
                            <FiHeart
                              className={
                                savedJobs.includes(
                                  job._id || job.id
                                )
                                  ? "fill-current text-blue-600"
                                  : ""
                              }
                            />
                          </button>

                        </div>

                        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-500">

                          {job.location && (
                            <span className="flex items-center gap-1.5">
                              <FiMapPin />
                              {job.location}
                            </span>
                          )}

                          {(job.jobType || job.type) && (
                            <span className="flex items-center gap-1.5">
                              <FiBriefcase />
                              {job.jobType || job.type}
                            </span>
                          )}

                          {(job.experience ||
                            job.experienceLevel) && (
                            <span className="flex items-center gap-1.5">
                              <FiClock />
                              {job.experience ||
                                job.experienceLevel}
                            </span>
                          )}

                        </div>

                        {job.skills?.length > 0 && (
                          <div className="mt-4 flex flex-wrap gap-2">
                            {job.skills.map((skill) => (
                              <span
                                key={skill}
                                className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">

                          <div>

                            {(job.salary ||
                              job.salaryRange) && (
                              <span className="font-semibold text-slate-900">
                                {job.salary ||
                                  job.salaryRange}
                              </span>
                            )}

                            {job.createdAt && (
                              <span className="ml-3 text-sm text-slate-400">
                                {new Date(
                                  job.createdAt
                                ).toLocaleDateString()}
                              </span>
                            )}

                          </div>

                          <Link
                            to={`/jobs/${job._id || job.id}`}
                            className="rounded-lg bg-blue-600 px-5 py-2.5 text-center text-sm font-semibold text-white hover:bg-blue-700"
                          >
                            View Job
                          </Link>

                        </div>

                      </div>
                    </div>
                  </article>
                ))}

              </div>
            )}

          </div>
        </div>
      </section>
    </div>
  );
}