import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import AuthLayout from "../components/AuthLayout";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setSubmitting(true);
    try {
      const res = await api.post("/auth/forgot-password", { email });
      setMessage(res.data.message);
    } catch (err) {
      setError(err.response?.data?.message || "Kuch galat hua, dobara try karo");
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    "w-full px-3 py-2.5 rounded-lg bg-slate-900 border border-slate-700 focus:border-blue-500 outline-none";

  return (
    <AuthLayout
      title="Forgot password?"
      subtitle="Enter your email and we will send you a reset link."
    >
      {message && (
        <p className="bg-green-500/10 border border-green-500/30 text-green-300 text-sm p-3 rounded-lg mb-4">
          {message}
        </p>
      )}
      {error && (
        <p className="bg-red-500/10 border border-red-500/30 text-red-300 text-sm p-3 rounded-lg mb-4">
          {error}
        </p>
      )}

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

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-blue-600 hover:bg-blue-500 py-2.5 rounded-lg font-semibold disabled:opacity-50 transition"
        >
          {submitting ? "Sending..." : message ? "Send again" : "Send reset link"}
        </button>

        <p className="text-sm text-center text-slate-400">
          Remembered it?{" "}
          <Link to="/login" className="text-blue-400 hover:underline">
            Back to login
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}

export default ForgotPassword;