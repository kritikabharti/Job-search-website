import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiEye,
  FiEyeOff,
  FiLock,
  FiMail,
} from "react-icons/fi";

import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [rememberMe, setRememberMe] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/login", {
        email: email.trim(),
        password,
      });

      const data = response.data;

      console.log("Login response:", data);

      if (!data.success) {
        setError(
          data.message || "Login failed."
        );
        return;
      }

      /*
       * Store authentication information
       */

      if (data.token) {
        localStorage.setItem(
          "token",
          data.token
        );
      }

      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
        login(data.token, data.user);
      }

      /*
       * Remember me
       *
       * Currently the authentication token is stored
       * in localStorage for both cases.
       *
       * We can later move this to a secure cookie-based
       * authentication system.
       */

      if (rememberMe) {
        localStorage.setItem(
          "rememberMe",
          "true"
        );
      } else {
        localStorage.removeItem(
          "rememberMe"
        );
      }

      /*
       * Redirect according to user role
       */

      const redirectTo = window.history.state?.usr?.redirectTo;
      if (redirectTo && redirectTo.startsWith("/")) {
        navigate(redirectTo);
      } else if (data.user?.role === "recruiter") {
        navigate("/recruiter/dashboard");
      } else if (
        data.user?.role === "admin"
      ) {
        navigate("/admin/dashboard");
      } else {
        // Jobseekers/candidates must land on their dashboard.
        navigate("/candidate/dashboard");
      }

    } catch (err) {
      console.error(
        "Login error:",
        err
      );

      const message =
        err.response?.data?.message ||
        "Unable to login. Please try again.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">

      <div className="grid min-h-screen lg:grid-cols-2">

        {/* Left Side */}
        <div className="hidden bg-slate-950 lg:flex lg:flex-col lg:justify-between lg:p-12">

          <Link
            to="/"
            className="flex items-center gap-2 text-xl font-bold text-white"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600">
              <span className="text-sm">
                J
              </span>
            </div>

            Jobify
          </Link>

          <div className="max-w-lg">

            <p className="text-sm font-semibold uppercase tracking-wider text-blue-400">
              Welcome back
            </p>

            <h1 className="mt-4 text-4xl font-bold leading-tight text-white">
              Take the next step in your career.
            </h1>

            <p className="mt-6 text-lg leading-8 text-slate-400">
              Access your profile, discover relevant
              opportunities, manage applications and
              stay connected with employers.
            </p>

          </div>

          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} Jobify
          </p>

        </div>

        {/* Right Side */}
        <div className="flex items-center justify-center px-6 py-12">

          <div className="w-full max-w-md">

            <Link
              to="/"
              className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-blue-600"
            >
              <FiArrowLeft />

              Back to Jobify
            </Link>

            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm md:p-10">

              {/* Header */}
              <div>

                <h2 className="text-2xl font-bold text-slate-950">
                  Sign in to your account
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  Enter your details to continue.
                </p>

              </div>

              {/* Form */}
              <form
                onSubmit={handleSubmit}
                className="mt-8 space-y-5"
              >

                {/* Email */}
                <div>

                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Email address
                  </label>

                  <div className="relative">

                    <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={email}
                      onChange={(e) =>
                        setEmail(e.target.value)
                      }
                      placeholder="you@example.com"
                      required
                      autoComplete="email"
                      className="w-full rounded-xl border border-slate-300 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />

                  </div>

                </div>

                {/* Password */}
                <div>

                  <div className="mb-2 flex items-center justify-between">

                    <label
                      htmlFor="password"
                      className="block text-sm font-semibold text-slate-700"
                    >
                      Password
                    </label>

                    <Link
                      to="/forgot-password"
                      className="text-sm font-medium text-blue-600 hover:text-blue-700"
                    >
                      Forgot password?
                    </Link>

                  </div>

                  <div className="relative">

                    <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                    <input
                      id="password"
                      name="password"
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      value={password}
                      onChange={(e) =>
                        setPassword(e.target.value)
                      }
                      placeholder="Enter your password"
                      required
                      autoComplete="current-password"
                      className="w-full rounded-xl border border-slate-300 py-3 pl-11 pr-12 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          !showPassword
                        )
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-slate-400 hover:text-slate-700"
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                    >
                      {showPassword ? (
                        <FiEyeOff size={18} />
                      ) : (
                        <FiEye size={18} />
                      )}
                    </button>

                  </div>

                </div>

                {/* Error */}
                {error && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {error}
                  </div>
                )}

                {/* Remember */}
                <div className="flex items-center gap-2">

                  <input
                    id="remember"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) =>
                      setRememberMe(
                        e.target.checked
                      )
                    }
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />

                  <label
                    htmlFor="remember"
                    className="text-sm text-slate-600"
                  >
                    Remember me
                  </label>

                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-blue-600 px-5 py-3.5 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading
                    ? "Signing in..."
                    : "Sign In"}
                </button>

              </form>

              {/* Register */}
              <div className="mt-7 border-t border-slate-200 pt-6 text-center">

                <p className="text-sm text-slate-500">

                  Don't have an account?{" "}

                  <Link
                    to="/register"
                    className="font-semibold text-blue-600 hover:text-blue-700"
                  >
                    Create an account
                  </Link>

                </p>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}