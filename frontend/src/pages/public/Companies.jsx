import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiBriefcase,
  FiMapPin,
  FiSearch,
  FiUsers,
} from "react-icons/fi";

import api from "../../services/api";

export default function Companies() {
  const [companies, setCompanies] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/companies");
      const data = response.data;

      setCompanies(data.companies || data.data || []);
    } catch (err) {
      console.error("Fetch companies error:", err);
      setError("Unable to load companies.");
    } finally {
      setLoading(false);
    }
  };

  const filteredCompanies = companies.filter((company) => {
    const value = search.toLowerCase();

    return (
      !value ||
      company.name?.toLowerCase().includes(value) ||
      company.industry?.toLowerCase().includes(value) ||
      company.location?.toLowerCase().includes(value)
    );
  });

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Header */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-12">

          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            Companies
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-950 md:text-4xl">
            Explore companies
          </h1>

          <p className="mt-3 max-w-2xl text-slate-600">
            Discover companies and explore the opportunities they offer.
          </p>

          {/* Search */}
          <div className="mt-8 max-w-2xl">
            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <FiSearch className="text-slate-400" />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search companies, industries or locations"
                className="w-full bg-transparent text-sm outline-none"
              />
            </div>
          </div>

        </div>
      </section>

      {/* Companies */}
      <section className="py-10">
        <div className="mx-auto max-w-7xl px-6">

          {/* Loading */}
          {loading && (
            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
              <p className="text-sm text-slate-500">
                Loading companies...
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
                onClick={fetchCompanies}
                className="mt-4 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white"
              >
                Try Again
              </button>

            </div>
          )}

          {/* Empty */}
          {!loading &&
            !error &&
            filteredCompanies.length === 0 && (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">

                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                  <FiBriefcase className="text-slate-400" />
                </div>

                <h2 className="mt-5 text-lg font-bold text-slate-950">
                  No companies available
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  Companies will appear here when recruiters create their
                  company profiles.
                </p>

              </div>
            )}

          {/* Real Companies */}
          {!loading &&
            !error &&
            filteredCompanies.length > 0 && (
              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">

                {filteredCompanies.map((company) => {
                  const companyId =
                    company._id || company.id;

                  return (
                    <Link
                      key={companyId}
                      to={`/companies/${companyId}`}
                      className="group rounded-2xl border border-slate-200 bg-white p-6 transition hover:border-blue-200 hover:shadow-md"
                    >

                      {/* Logo */}
                      <div className="flex items-start justify-between">

                        <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-xl bg-slate-100">

                          {company.logo ? (
                            <img
                              src={company.logo}
                              alt={company.name || "Company"}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <FiBriefcase className="text-slate-400" />
                          )}

                        </div>

                        {company.isVerified && (
                          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
                            Verified
                          </span>
                        )}

                      </div>

                      {/* Company */}
                      <h2 className="mt-5 text-lg font-bold text-slate-950 group-hover:text-blue-600">
                        {company.name}
                      </h2>

                      {company.industry && (
                        <p className="mt-1 text-sm text-slate-500">
                          {company.industry}
                        </p>
                      )}

                      <div className="mt-5 space-y-3 text-sm text-slate-500">

                        {company.location && (
                          <div className="flex items-center gap-2">
                            <FiMapPin />
                            {company.location}
                          </div>
                        )}

                        {company.employeeCount && (
                          <div className="flex items-center gap-2">
                            <FiUsers />
                            {company.employeeCount} employees
                          </div>
                        )}

                        {company.jobCount !== undefined && (
                          <div className="flex items-center gap-2">
                            <FiBriefcase />
                            {company.jobCount} open jobs
                          </div>
                        )}

                      </div>

                      <div className="mt-6 border-t border-slate-100 pt-4">
                        <span className="text-sm font-semibold text-blue-600">
                          View company
                        </span>
                      </div>

                    </Link>
                  );
                })}

              </div>
            )}

        </div>
      </section>
    </div>
  );
}