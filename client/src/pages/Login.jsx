import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthLayout from "../components/AuthLayout";
import GoogleButton from "../components/GoogleButton";

function Login() {
  const { user, login, googleLogin } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogle = async (credential) => {
    setError("");
    try {
      await googleLogin(credential);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Google login failed");
    }
  };

  const inputClass =
    "w-full px-3 py-2.5 rounded-lg bg-slate-900 border border-slate-700 focus:border-blue-500 outline-none";

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Login to continue tracking your career."
    >
      {error && (
        <p className="bg-red-500/10 border border-red-500/30 text-red-300 text-sm p-3 rounded-lg mb-4">
          {error}
        </p>
      )}

      <GoogleButton onCredential={handleGoogle} onError={setError} />

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-slate-300 mb-1">Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={inputClass}
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-sm text-slate-300">Password</label>
            <Link
              to="/forgot-password"
              className="text-xs text-blue-400 hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <input
            type="password"
            placeholder="Your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={inputClass}
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-blue-600 hover:bg-blue-500 py-2.5 rounded-lg font-semibold disabled:opacity-50 transition"
        >
          {submitting ? "Logging in..." : "Login"}
        </button>

        <p className="text-sm text-center text-slate-400">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-400 hover:underline">
            Register
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}

export default Login;