import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";

export default function AdminResourcePage({ title, endpoint, collectionKey, columns }) {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const response = await api.get(endpoint);
        if (!response.data?.success) throw new Error(response.data?.message || `Unable to load ${title.toLowerCase()}.`);
        setItems(Array.isArray(response.data?.[collectionKey]) ? response.data[collectionKey] : []);
      } catch (err) {
        if (err.response?.status === 401 || err.response?.status === 403) {
          navigate("/login", { replace: true });
          return;
        }
        setError(err.response?.data?.message || err.message || "Unable to load data.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [endpoint, collectionKey, navigate, title]);

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        <Link to="/admin/dashboard" className="text-sm font-semibold text-blue-600 hover:text-blue-700">← Back to Dashboard</Link>
        <div className="mt-5 flex items-center justify-between gap-4">
          <div><p className="text-sm font-semibold text-blue-600">Admin</p><h1 className="text-3xl font-bold text-slate-950">{title}</h1></div>
          <span className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-slate-500 shadow-sm">{items.length} records</span>
        </div>
        {error && <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}
        <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
          {loading ? <div className="p-10 text-center text-slate-500">Loading {title.toLowerCase()}...</div> : items.length === 0 ? <div className="p-10 text-center text-slate-500">No records found.</div> : (
            <table className="min-w-full text-left text-sm"><thead className="border-b border-slate-200 bg-slate-50"><tr>{columns.map((column) => <th key={column.key} className="px-5 py-3 font-semibold text-slate-600">{column.label}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">{items.map((item) => <tr key={item._id} className="hover:bg-slate-50">{columns.map((column) => <td key={column.key} className="px-5 py-4 text-slate-700">{column.render ? column.render(item) : (item[column.key] ?? "—")}</td>)}</tr>)}</tbody></table>
          )}
        </div>
      </main>
    </div>
  );
}
