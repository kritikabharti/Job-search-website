import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiLock } from "react-icons/fi";

export default function AccessDenied() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">

        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-600">
          <FiLock size={28} />
        </div>

        <h1 className="mt-6 text-2xl font-bold text-slate-900">
          Access Denied
        </h1>

        <p className="mt-3 text-sm leading-6 text-slate-500">
          You cannot access this page.
          <br />
          You don't have permission to view this area.
        </p>

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          <FiArrowLeft size={17} />
          Go Back
        </button>

      </div>
    </div>
  );
}