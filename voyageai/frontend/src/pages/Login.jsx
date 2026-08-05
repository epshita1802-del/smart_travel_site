import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FiMail, FiLock, FiLoader } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import useDocumentTitle from "../hooks/useDocumentTitle";
import { getErrorMessage } from "../services/api";

const Login = () => {
  useDocumentTitle("Log In");
  const { loginUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await loginUser(form);
      navigate(location.state?.from?.pathname || "/dashboard");
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
          <h1 className="text-2xl font-display font-bold">Welcome back</h1>
          <p className="text-ink/50 text-sm mt-1">Log in to manage your bookings and trips.</p>
        </div>

        {error && <p className="text-sm text-coral-600 bg-coral-50 rounded-xl px-4 py-3 mb-5">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label"><FiMail className="inline mr-1" /> Email address</label>
            <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-field" placeholder="you@example.com" />
          </div>
          <div>
            <label className="label"><FiLock className="inline mr-1" /> Password</label>
            <input type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="input-field" placeholder="••••••••" />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? <FiLoader className="animate-spin" /> : "Log In"}
          </button>
        </form>

        <p className="text-center text-sm text-ink/50 mt-6">
          Don't have an account? <Link to="/register" className="text-coral-600 font-semibold">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
