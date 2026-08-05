import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiUser, FiMail, FiLock, FiPhone, FiLoader } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import useDocumentTitle from "../hooks/useDocumentTitle";
import { getErrorMessage } from "../services/api";

const Register = () => {
  useDocumentTitle("Sign Up");
  const { registerUser } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      await registerUser(form);
      navigate("/dashboard");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-sand-100/50 px-4 py-16">
      <div className="card w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-sunset-gradient flex items-center justify-center text-white font-display font-bold text-xl mx-auto mb-4">V</div>
          <h1 className="text-2xl font-display font-bold">Create your account</h1>
          <p className="text-ink/50 text-sm mt-1">Join VoyageAI and start planning smarter trips.</p>
        </div>

        {error && <p className="text-sm text-coral-600 bg-coral-50 rounded-xl px-4 py-3 mb-5">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label"><FiUser className="inline mr-1" /> Full name</label>
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" placeholder="Jane Doe" />
          </div>
          <div>
            <label className="label"><FiMail className="inline mr-1" /> Email address</label>
            <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-field" placeholder="you@example.com" />
          </div>
          <div>
            <label className="label"><FiPhone className="inline mr-1" /> Phone (optional)</label>
            <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input-field" placeholder="+1 555 123 4567" />
          </div>
          <div>
            <label className="label"><FiLock className="inline mr-1" /> Password</label>
            <input type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="input-field" placeholder="At least 6 characters" />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? <FiLoader className="animate-spin" /> : "Create Account"}
          </button>
        </form>

        <p className="text-center text-sm text-ink/50 mt-6">
          Already have an account? <Link to="/login" className="text-coral-600 font-semibold">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
