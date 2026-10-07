import { useEffect, useState } from "react";
import api from "../api/axios";

const emptyForm = {
  headline: "",
  bio: "",
  collegeOrCompany: "",
  experienceLevel: "student",
  location: "",
  githubUsername: "",
  linkedinUrl: "",
};

function Profile() {
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/profile")
      .then((res) => {
        const p = res.data.profile;
        setForm({
          headline: p.headline || "",
          bio: p.bio || "",
          collegeOrCompany: p.collegeOrCompany || "",
          experienceLevel: p.experienceLevel || "student",
          location: p.location || "",
          githubUsername: p.githubUsername || "",
          linkedinUrl: p.linkedinUrl || "",
        });
      })
      .catch(() => setError("Profile load nahi hui"))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      await api.put("/profile", form);
      setMessage("Profile saved ✅");
    } catch (err) {
      setError(err.response?.data?.message || "Save nahi hua");
    }
  };

  if (loading) return <p>Loading...</p>;

  const inputClass = "w-full p-2 rounded bg-slate-700 outline-none";

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>

      <form onSubmit={handleSubmit} className="space-y-4 bg-slate-800 p-6 rounded-xl">
        {message && <p className="bg-green-500/20 text-green-300 p-2 rounded">{message}</p>}
        {error && <p className="bg-red-500/20 text-red-300 p-2 rounded">{error}</p>}

        <input
          name="headline"
          value={form.headline}
          onChange={handleChange}
          placeholder="Headline (e.g. MERN Stack Developer)"
          className={inputClass}
        />
        <textarea
          name="bio"
          value={form.bio}
          onChange={handleChange}
          placeholder="Short bio"
          rows={3}
          className={inputClass}
        />
        <input
          name="collegeOrCompany"
          value={form.collegeOrCompany}
          onChange={handleChange}
          placeholder="College / Company"
          className={inputClass}
        />
        <select
          name="experienceLevel"
          value={form.experienceLevel}
          onChange={handleChange}
          className={inputClass}
        >
          <option value="student">Student</option>
          <option value="fresher">Fresher</option>
          <option value="junior">Junior (1-2 yrs)</option>
          <option value="mid">Mid (3-5 yrs)</option>
          <option value="senior">Senior (5+ yrs)</option>
        </select>
        <input
          name="location"
          value={form.location}
          onChange={handleChange}
          placeholder="Location"
          className={inputClass}
        />
        <input
          name="githubUsername"
          value={form.githubUsername}
          onChange={handleChange}
          placeholder="GitHub username"
          className={inputClass}
        />
        <input
          name="linkedinUrl"
          value={form.linkedinUrl}
          onChange={handleChange}
          placeholder="LinkedIn URL"
          className={inputClass}
        />

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-500 p-2 rounded font-semibold"
        >
          Save Profile
        </button>
      </form>
    </div>
  );
}

export default Profile;