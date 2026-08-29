import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FiArrowLeft,
  FiBriefcase,
  FiCheckCircle,
  FiEdit2,
  FiGlobe,
  FiLinkedin,
  FiMail,
  FiMapPin,
  FiPhone,
  FiSave,
  FiUser,
  FiX,
} from "react-icons/fi";
import api from "../../services/api";

const emptyForm = {
  name: "",
  phone: "",
  location: "",
  headline: "",
  bio: "",
  company: "",
  designation: "",
  linkedin: "",
  website: "",
  portfolio: "",
};

const normalizeUrl = (value) => {
  if (!value) return "";
  return /^https?:\/\//i.test(value) ? value : `https://${value}`;
};

export default function RecruiterProfile() {
  const navigate = useNavigate();
  const imageRef = useRef(null);

  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [profileImage, setProfileImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [error, setError] = useState("");

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/recruiter/profile");
      const data = response.data?.profile;

      if (!data) {
        throw new Error("Profile data was not returned by the server.");
      }

      setProfile(data);
      setPreview(data.profileImage || "");
      setForm({
        name: data.name || "",
        phone: data.phone || "",
        location: data.location || "",
        headline: data.headline || "",
        bio: data.bio || "",
        company: data.company || "",
        designation: data.designation || "",
        linkedin: data.linkedin || "",
        website: data.website || "",
        portfolio: data.portfolio || "",
      });
    } catch (err) {
      console.error("Recruiter profile error:", err);

      if ([401, 403].includes(err.response?.status)) {
        localStorage.removeItem("token");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        navigate("/login", { replace: true });
        return;
      }

      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to load recruiter profile."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const initials = useMemo(() => {
    const name = profile?.name || "Recruiter";
    return name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("");
  }, [profile?.name]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const openEdit = () => {
    setForm({
      name: profile?.name || "",
      phone: profile?.phone || "",
      location: profile?.location || "",
      headline: profile?.headline || "",
      bio: profile?.bio || "",
      company: profile?.company || "",
      designation: profile?.designation || "",
      linkedin: profile?.linkedin || "",
      website: profile?.website || "",
      portfolio: profile?.portfolio || "",
    });
    setProfileImage(null);
    setPreview(profile?.profileImage || "");
    if (imageRef.current) imageRef.current.value = "";
    setEditOpen(true);
  };

  const closeEdit = () => {
    if (saving) return;
    setEditOpen(false);
    setProfileImage(null);
    setPreview(profile?.profileImage || "");
    if (imageRef.current) imageRef.current.value = "";
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) {
      toast.error("Profile picture must be JPG, JPEG, PNG or WEBP.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Profile picture must be smaller than 5 MB.");
      event.target.value = "";
      return;
    }

    setProfileImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const saveProfile = async (event) => {
    event.preventDefault();

    if (!form.name.trim()) {
      toast.error("Name is required.");
      return;
    }

    try {
      setSaving(true);

      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value.trim());
      });

      if (profileImage) {
        formData.append("profileImage", profileImage);
      }

      const response = await api.put("/recruiter/profile", formData);
      const updated = response.data?.profile;

      if (!updated) {
        throw new Error("Updated profile was not returned by the server.");
      }

      setProfile(updated);
      setPreview(updated.profileImage || "");
      setEditOpen(false);
      setProfileImage(null);
      toast.success(response.data?.message || "Profile updated successfully.");
    } catch (err) {
      console.error("Save recruiter profile error:", err);
      toast.error(
        err.response?.data?.message ||
          err.message ||
          "Unable to update recruiter profile."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
          <p className="mt-4 text-sm font-medium text-slate-500">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto max-w-5xl px-6 py-8 lg:px-8">
        <Link
          to="/recruiter/dashboard"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-blue-600"
        >
          <FiArrowLeft size={16} />
          Back to Dashboard
        </Link>

        {error ? (
          <section className="rounded-2xl border border-red-200 bg-white p-8 shadow-sm">
            <div className="rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</div>
            <button
              type="button"
              onClick={loadProfile}
              className="mt-5 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Try Again
            </button>
          </section>
        ) : (
          <>
            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="h-28 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-500" />

              <div className="px-6 pb-7 sm:px-8">
                <div className="-mt-12 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                  <div className="flex items-end gap-5">
                    <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-4 border-white bg-blue-50 text-2xl font-bold text-blue-600 shadow-lg">
                      {profile?.profileImage ? (
                        <img
                          src={profile.profileImage}
                          alt={profile.name || "Recruiter"}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        initials
                      )}
                    </div>

                    <div className="pb-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h1 className="text-2xl font-bold text-slate-950">
                          {profile?.name || "Recruiter"}
                        </h1>
                        {profile?.isVerified && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
                            <FiCheckCircle /> Verified
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-sm text-slate-500">
                        {profile?.designation || profile?.headline || "Recruiter Profile"}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={openEdit}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
                  >
                    <FiEdit2 size={16} />
                    Edit Profile
                  </button>
                </div>

                <div className="mt-8 grid gap-4 border-t border-slate-100 pt-7 sm:grid-cols-2 lg:grid-cols-4">
                  <ProfileItem icon={<FiMail />} label="Email" value={profile?.email || "—"} />
                  <ProfileItem icon={<FiPhone />} label="Phone" value={profile?.phone || "—"} />
                  <ProfileItem icon={<FiMapPin />} label="Location" value={profile?.location || "—"} />
                  <ProfileItem icon={<FiBriefcase />} label="Company" value={profile?.company || "—"} />
                </div>
              </div>
            </section>

            <div className="mt-6 grid gap-6 lg:grid-cols-3">
              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <h2 className="font-bold text-slate-950">About</h2>
                    <p className="mt-1 text-sm text-slate-500">Professional information</p>
                  </div>
                  <button
                    type="button"
                    onClick={openEdit}
                    className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                  >
                    Edit
                  </button>
                </div>

                <div className="mt-5 space-y-5">
                  <Detail label="Professional Headline" value={profile?.headline} />
                  <Detail label="About Me" value={profile?.bio} multiline />
                  <Detail label="Designation" value={profile?.designation} />
                </div>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <FiGlobe />
                  </div>
                  <div>
                    <h2 className="font-bold text-slate-950">Professional Links</h2>
                    <p className="text-sm text-slate-500">Online presence</p>
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  <LinkItem icon={<FiLinkedin />} label="LinkedIn" value={profile?.linkedin} />
                  <LinkItem icon={<FiGlobe />} label="Website" value={profile?.website} />
                  <LinkItem icon={<FiGlobe />} label="Portfolio" value={profile?.portfolio} />
                </div>
              </section>
            </div>
          </>
        )}
      </main>

      {editOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
          <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-6 py-5">
              <div>
                <p className="text-sm font-semibold text-blue-600">Recruiter Profile</p>
                <h2 className="mt-1 text-xl font-bold text-slate-950">Edit Profile</h2>
              </div>
              <button
                type="button"
                onClick={closeEdit}
                disabled={saving}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
              >
                <FiX size={20} />
              </button>
            </div>

            <form onSubmit={saveProfile}>
              <div className="space-y-5 p-6">
                <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-blue-100 font-bold text-blue-600">
                    {preview ? (
                      <img src={preview} alt="Preview" className="h-full w-full object-cover" />
                    ) : (
                      initials
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">Profile Picture</p>
                    <p className="mt-1 text-xs text-slate-500">JPG, PNG or WEBP · maximum 5 MB</p>
                    <input
                      ref={imageRef}
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      onChange={handleImageChange}
                      className="mt-2 block text-sm text-slate-600"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Full Name" name="name" value={form.name} onChange={handleChange} required />
                  <Field label="Designation" name="designation" value={form.designation} onChange={handleChange} placeholder="HR Manager / Talent Acquisition" />
                  <Field label="Company" name="company" value={form.company} onChange={handleChange} placeholder="Company name" />
                  <Field label="Phone" name="phone" value={form.phone} onChange={handleChange} />
                  <Field label="Location" name="location" value={form.location} onChange={handleChange} />
                  <Field label="Headline" name="headline" value={form.headline} onChange={handleChange} placeholder="Connecting great people with great opportunities" />
                  <Field label="LinkedIn" name="linkedin" value={form.linkedin} onChange={handleChange} placeholder="https://linkedin.com/in/..." />
                  <Field label="Website" name="website" value={form.website} onChange={handleChange} placeholder="https://company.com" />
                  <Field label="Portfolio" name="portfolio" value={form.portfolio} onChange={handleChange} placeholder="https://..." />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-800">About</label>
                  <textarea
                    name="bio"
                    value={form.bio}
                    onChange={handleChange}
                    rows={5}
                    maxLength={2000}
                    placeholder="Tell candidates about your role, hiring focus and company..."
                    className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeEdit}
                  disabled={saving}
                  className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <FiSave />
                  {saving ? "Saving..." : "Save Profile"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function ProfileItem({ icon, label, value }) {
  return (
    <div className="min-w-0 rounded-xl bg-slate-50 p-4">
      <div className="flex items-center gap-2 text-blue-600">{icon}<span className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</span></div>
      <p className="mt-2 truncate text-sm font-semibold text-slate-800">{value}</p>
    </div>
  );
}

function Detail({ label, value, multiline = false }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
      <p className={`mt-2 text-sm leading-6 text-slate-600 ${multiline ? "whitespace-pre-line" : ""}`}>
        {value || "Not added yet."}
      </p>
    </div>
  );
}

function LinkItem({ icon, label, value }) {
  if (!value) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-dashed border-slate-200 p-3 text-sm text-slate-400">
        <span className="text-slate-300">{icon}</span>
        <span>{label} not added</span>
      </div>
    );
  }

  return (
    <a
      href={normalizeUrl(value)}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 transition hover:border-blue-300 hover:bg-blue-50"
    >
      <span className="text-blue-600">{icon}</span>
      <span className="min-w-0 truncate text-sm font-semibold text-slate-700">{value}</span>
    </a>
  );
}

function Field({ label, name, value, onChange, placeholder = "", required = false }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-800">
        {label}{required ? " *" : ""}
      </label>
      <input
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500"
      />
    </div>
  );
}
