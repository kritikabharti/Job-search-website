import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiBriefcase,
  FiEdit2,
  FiEye,
  FiFilter,
  FiMapPin,
  FiPlus,
  FiRefreshCw,
  FiSearch,
  FiTrash2,
  FiXCircle,
  FiCheckCircle,
} from "react-icons/fi";

import api from "../../services/api";

export default function ManageJobs() {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [error, setError] = useState("");

  // =====================================================
  // FETCH JOBS
  // =====================================================

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/recruiter/jobs");

      console.log("Recruiter jobs:", response.data);

      if (response.data?.success) {
        setJobs(response.data.jobs || []);
      } else {
        setError(
          response.data?.message || "Unable to load jobs."
        );
      }
    } catch (err) {
      console.error("Fetch recruiter jobs error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load your jobs."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // =====================================================
  // FILTER JOBS
  // =====================================================

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const searchText = search.toLowerCase().trim();

      const matchesSearch =
        !searchText ||
        job.title?.toLowerCase().includes(searchText) ||
        job.location?.toLowerCase().includes(searchText) ||
        job.company?.name?.toLowerCase().includes(searchText);

      const matchesStatus =
        statusFilter === "all" ||
        job.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [jobs, search, statusFilter]);

  // =====================================================
  // CLOSE JOB
  // =====================================================

  const handleCloseJob = async (jobId) => {
    const confirmed = window.confirm(
      "Are you sure you want to close this job?"
    );

    if (!confirmed) return;

    try {
      setActionLoading(true);

      const response = await api.patch(
        `/recruiter/jobs/${jobId}/close`
      );

      if (!response.data?.success) {
        throw new Error(
          response.data?.message ||
            "Unable to close job."
        );
      }

      await fetchJobs();
    } catch (err) {
      console.error("Close job error:", err);

      alert(
        err.response?.data?.message ||
          "Unable to close job."
      );
    } finally {
      setActionLoading(false);
    }
  };

  // =====================================================
  // PUBLISH JOB
  // =====================================================

  const handlePublishJob = async (jobId) => {
    try {
      setActionLoading(true);

      const response = await api.patch(
        `/recruiter/jobs/${jobId}/publish`
      );

      if (!response.data?.success) {
        throw new Error(
          response.data?.message ||
            "Unable to publish job."
        );
      }

      await fetchJobs();
    } catch (err) {
      console.error("Publish job error:", err);

      alert(
        err.response?.data?.message ||
          "Unable to publish job."
      );
    } finally {
      setActionLoading(false);
    }
  };

  // =====================================================
  // DELETE JOB
  // =====================================================

  const handleDeleteJob = async (jobId) => {
    const confirmed = window.confirm(
      "Are you sure you want to permanently delete this job?"
    );

    if (!confirmed) return;

    try {
      setActionLoading(true);

      const response = await api.delete(
        `/recruiter/jobs/${jobId}`
      );

      if (!response.data?.success) {
        throw new Error(
          response.data?.message ||
            "Unable to delete job."
        );
      }

      setJobs((currentJobs) =>
        currentJobs.filter(
          (job) => job._id !== jobId
        )
      );
    } catch (err) {
      console.error("Delete job error:", err);

      alert(
        err.response?.data?.message ||
          "Unable to delete job."
      );
    } finally {
      setActionLoading(false);
    }
  };

  // =====================================================
  // STATUS
  // =====================================================

  const getStatusStyle = (status) => {
    switch (status) {
      case "active":
        return "bg-green-50 text-green-700 border-green-200";

      case "closed":
        return "bg-red-50 text-red-700 border-red-200";

      case "draft":
        return "bg-slate-50 text-slate-700 border-slate-200";

      default:
        return "bg-blue-50 text-blue-700 border-blue-200";
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">

        <div className="flex min-h-[70vh] items-center justify-center">

          <div className="text-center">

            <FiRefreshCw
              className="mx-auto animate-spin text-blue-600"
              size={30}
            />

            <p className="mt-4 text-sm text-slate-500">
              Loading your jobs...
            </p>

          </div>

        </div>

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="border-b border-slate-200 bg-white">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8">

          <div>

            <Link
              to="/recruiter/dashboard"
              className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-600"
            >
              <FiArrowLeft />
              Back to Dashboard
            </Link>

            <h1 className="text-2xl font-bold text-slate-950">
              Manage Jobs
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              View and manage all your job postings.
            </p>

          </div>

          <Link
            to="/recruiter/jobs/create"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            <FiPlus />
            Post a Job
          </Link>

        </div>

      </div>

      {/* =================================================
          CONTENT
      ================================================= */}

      <main className="mx-auto max-w-7xl px-6 py-8 lg:px-8">

        {/* ERROR */}

        {error && (
          <div className="mb-6 flex items-center justify-between rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600">

            <span>{error}</span>

            <button
              onClick={fetchJobs}
              className="font-semibold hover:underline"
            >
              Try again
            </button>

          </div>
        )}

        {/* =================================================
            FILTER BAR
        ================================================= */}

        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

          <div className="flex flex-col gap-4 md:flex-row">

            {/* SEARCH */}

            <div className="relative flex-1">

              <FiSearch
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search jobs, location or company..."
                className="w-full rounded-xl border border-slate-300 py-3 pl-11 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

            </div>

            {/* STATUS */}

            <div className="relative md:w-52">

              <FiFilter
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={17}
              />

              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value)
                }
                className="w-full appearance-none rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="all">
                  All Status
                </option>

                <option value="active">
                  Active
                </option>

                <option value="closed">
                  Closed
                </option>

                <option value="draft">
                  Draft
                </option>

              </select>

            </div>

            {/* REFRESH */}

            <button
              onClick={fetchJobs}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <FiRefreshCw />
              Refresh
            </button>

          </div>

        </div>

        {/* =================================================
            JOB COUNT
        ================================================= */}

        <div className="mb-4 flex items-center justify-between">

          <p className="text-sm text-slate-500">
            Showing{" "}
            <span className="font-semibold text-slate-900">
              {filteredJobs.length}
            </span>{" "}
            job{filteredJobs.length !== 1 ? "s" : ""}
          </p>

        </div>

        {/* =================================================
            JOBS
        ================================================= */}

        {filteredJobs.length === 0 ? (

          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-20 text-center shadow-sm">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50">

              <FiBriefcase
                size={28}
                className="text-blue-600"
              />

            </div>

            <h2 className="mt-5 text-xl font-bold text-slate-950">
              No jobs found
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              You haven't posted any jobs yet, or no jobs
              match your current filters.
            </p>

            <Link
              to="/recruiter/jobs/create"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
            >
              <FiPlus />
              Post Your First Job
            </Link>

          </div>

        ) : (

          <div className="space-y-4">

            {filteredJobs.map((job) => (

              <div
                key={job._id}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
              >

                <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">

                  {/* JOB INFO */}

                  <div className="min-w-0 flex-1">

                    <div className="flex flex-wrap items-start gap-3">

                      <h2 className="text-xl font-bold text-slate-950">
                        {job.title}
                      </h2>

                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-semibold capitalize ${getStatusStyle(
                          job.status
                        )}`}
                      >
                        {job.status || "active"}
                      </span>

                    </div>

                    <p className="mt-2 text-sm font-medium text-slate-600">
                      {job.company?.name ||
                        "Company"}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-500">

                      <span className="inline-flex items-center gap-2">
                        <FiMapPin />
                        {job.location || "Not specified"}
                      </span>

                      <span className="inline-flex items-center gap-2">
                        <FiBriefcase />
                        {job.jobType || "Full-time"}
                      </span>

                      {job.workMode && (
                        <span className="capitalize">
                          {job.workMode}
                        </span>
                      )}

                    </div>

                    <div className="mt-5 flex flex-wrap gap-6 text-sm">

                      <div>
                        <span className="text-slate-400">
                          Applications
                        </span>

                        <p className="mt-1 font-bold text-slate-900">
                          {job.applicationsCount || 0}
                        </p>
                      </div>

                      <div>
                        <span className="text-slate-400">
                          Views
                        </span>

                        <p className="mt-1 font-bold text-slate-900">
                          {job.views || 0}
                        </p>
                      </div>

                      {job.applicationDeadline && (
                        <div>
                          <span className="text-slate-400">
                            Deadline
                          </span>

                          <p className="mt-1 font-bold text-slate-900">
                            {new Date(
                              job.applicationDeadline
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      )}

                    </div>

                  </div>

                  {/* ACTIONS */}

                  <div className="flex flex-wrap gap-2 lg:max-w-xs lg:justify-end">

                    <button
                      onClick={() =>
                        navigate(
                          `/recruiter/jobs/${job._id}`
                        )
                      }
                      className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      <FiEye />
                      View
                    </button>

                    <button
                      onClick={() =>
                        navigate(
                          `/recruiter/jobs/${job._id}/edit`
                        )
                      }
                      className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      <FiEdit2 />
                      Edit
                    </button>

                    {job.status === "active" ? (

                      <button
                        disabled={actionLoading}
                        onClick={() =>
                          handleCloseJob(job._id)
                        }
                        className="inline-flex items-center gap-2 rounded-lg border border-orange-200 bg-orange-50 px-3 py-2 text-sm font-semibold text-orange-700 hover:bg-orange-100 disabled:opacity-50"
                      >
                        <FiXCircle />
                        Close
                      </button>

                    ) : (

                      <button
                        disabled={actionLoading}
                        onClick={() =>
                          handlePublishJob(job._id)
                        }
                        className="inline-flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm font-semibold text-green-700 hover:bg-green-100 disabled:opacity-50"
                      >
                        <FiCheckCircle />
                        Publish
                      </button>

                    )}

                    <button
                      disabled={actionLoading}
                      onClick={() =>
                        handleDeleteJob(job._id)
                      }
                      className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-100 disabled:opacity-50"
                    >
                      <FiTrash2 />
                      Delete
                    </button>

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </main>

    </div>
  );
}