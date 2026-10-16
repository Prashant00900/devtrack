import { useEffect, useState } from "react";
import api from "../api/axios";

const emptyForm = { name: "", issuer: "", issueDate: "", credentialUrl: "" };

function Certifications() {
  const [certs, setCerts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const res = await api.get("/certifications");
      setCerts(res.data.certifications);
    } catch {
      setError("Could not load certifications");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/certifications", form);
      setForm(emptyForm);
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Could not save");
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/certifications/${id}`);
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Could not delete");
    }
  };

  const inputClass = "w-full p-2 rounded bg-slate-700 outline-none";

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Certifications</h1>

      {error && (
        <p className="bg-red-500/20 text-red-300 p-2 rounded mb-4">{error}</p>
      )}

      <form onSubmit={handleSubmit} className="bg-slate-800 p-4 rounded-xl space-y-3 mb-8">
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Certification name"
          required
          className={inputClass}
        />
        <input
          name="issuer"
          value={form.issuer}
          onChange={handleChange}
          placeholder="Issued by (e.g. Coursera, Udemy)"
          className={inputClass}
        />
        <input
          type="date"
          name="issueDate"
          value={form.issueDate}
          onChange={handleChange}
          className={inputClass}
        />
        <input
          name="credentialUrl"
          value={form.credentialUrl}
          onChange={handleChange}
          placeholder="Credential link"
          className={inputClass}
        />
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-500 p-2 rounded font-semibold"
        >
          Add Certification
        </button>
      </form>

      {certs.length === 0 ? (
        <p className="text-slate-400">No certifications added yet.</p>
      ) : (
        <div className="space-y-3">
          {certs.map((c) => (
            <div
              key={c._id}
              className="bg-slate-800 p-4 rounded-xl flex items-start justify-between gap-3"
            >
              <div>
                <p className="font-semibold">{c.name}</p>
                <p className="text-sm text-slate-400">
                  {c.issuer}
                  {c.issuer && c.issueDate ? " · " : ""}
                  {c.issueDate ? new Date(c.issueDate).toLocaleDateString() : ""}
                </p>
                {c.credentialUrl && (
                  <a
                    href={c.credentialUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-400 text-sm"
                  >
                    View credential ↗
                  </a>
                )}
              </div>
              <button
                onClick={() => handleDelete(c._id)}
                className="bg-red-600 hover:bg-red-500 px-3 py-1 rounded text-sm shrink-0"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Certifications;