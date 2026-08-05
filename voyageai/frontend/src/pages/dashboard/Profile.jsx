import { useState } from "react";
import toast from "react-hot-toast";
import { FiCamera } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import * as authService from "../../services/authService";
import { getErrorMessage } from "../../services/api";

const Profile = () => {
  const { user, updateUserData } = useAuth();
  const [form, setForm] = useState({ name: user?.name || "", email: user?.email || "", phone: user?.phone || "", password: "" });
  const [avatarFile, setAvatarFile] = useState(null);
  const [preview, setPreview] = useState(user?.avatar || "");
  const [submitting, setSubmitting] = useState(false);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });
      if (avatarFile) formData.append("avatar", avatarFile);

      const updated = await authService.updateProfile(formData);
      updateUserData(updated);
      toast.success("Profile updated successfully");
      setForm({ ...form, password: "" });
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="card p-8 max-w-2xl">
      <h1 className="text-2xl font-display font-bold mb-6">Edit Profile</h1>

      <form onSubmit={handleSubmit}>
        <div className="flex items-center gap-5 mb-8">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-ocean-gradient text-white flex items-center justify-center font-bold text-2xl overflow-hidden">
              {preview ? <img src={preview} alt="" className="w-full h-full object-cover" /> : user?.name?.charAt(0).toUpperCase()}
            </div>
            <label className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-coral-500 text-white flex items-center justify-center cursor-pointer">
              <FiCamera size={13} />
              <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
            </label>
          </div>
          <div>
            <p className="font-semibold">{user?.name}</p>
            <p className="text-xs text-ink/40">{user?.email}</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-5 mb-5">
          <div>
            <label className="label">Full name</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" required />
          </div>
          <div>
            <label className="label">Email address</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-field" required />
          </div>
        </div>

        <div className="mb-5">
          <label className="label">Phone number</label>
          <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input-field" placeholder="+1 555 123 4567" />
        </div>

        <div className="mb-8">
          <label className="label">New password (leave blank to keep current)</label>
          <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="input-field" placeholder="••••••••" />
        </div>

        <button type="submit" disabled={submitting} className="btn-primary">
          {submitting ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default Profile;
