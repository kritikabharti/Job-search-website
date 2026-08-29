import { Link } from "react-router-dom";
import { FiArrowLeft, FiHeart, FiSearch } from "react-icons/fi";

export default function CandidateFavorites() {
  return (
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto max-w-5xl px-6 py-8 lg:px-8">
        <Link to="/candidate/dashboard" className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-600"><FiArrowLeft /> Back to Dashboard</Link>
        <section className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-600"><FiHeart size={24} /></div>
          <h1 className="mt-5 text-2xl font-bold text-slate-950">Saved Jobs</h1>
          <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">Browse jobs and use the heart button to save opportunities you want to revisit.</p>
          <Link to="/jobs" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"><FiSearch /> Find Jobs</Link>
        </section>
      </main>
    </div>
  );
}
