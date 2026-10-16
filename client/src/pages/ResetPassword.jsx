import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/axios";
import AuthLayout from "../components/AuthLayout";

function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError("Dono passwords same nahi hain");
      return;
    }

    setSubmitting(true);
    try {
      await api.post("/auth/reset-password", { token, password });
      setDone(true);
    } catch (err) {
      setError(err.response?.data?.message || "Kuch galat hua, dobara try karo");
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    "w-full px-3 py-2.5 rounded-lg bg-slate-900 border border-slate-700 focus:border-blue-500 outline-none";

  if (done) {
    return (
      <AuthLayout title="Password updated" subtitle="You can now login with your new password.">
        <Link
          to="/login"
          className="block w-full text-center bg-blue-600 hover:bg-blue-500 py-2.5 rounded-lg font-semibold transition"
        >
          Go to login
        </Link>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Set a new password" subtitle="Choose a password you have not used before.">
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-300 text-sm p-3 rounded-lg mb-4">
          <p>{error}</p>
          {error.includes("expire") && (
            <Link to="/forgot-password" className="text-blue-400 hover:underline">
              Naya link mangao →
            </Link>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-slate-300 mb-1">New password</label>
          <input
            type="password"
            placeholder="At least 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-sm text-slate-300 mb-1">Confirm password</label>
          <input
            type="password"
            placeholder="Type it again"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            minLength={6}
            className={inputClass}
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-blue-600 hover:bg-blue-500 py-2.5 rounded-lg font-semibold disabled:opacity-50 transition"
        >
          {submitting ? "Updating..." : "Update password"}
        </button>
      </form>
    </AuthLayout>
  );
}

export default ResetPassword;