import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiPlus, FiEdit2, FiTrash2, FiX } from "react-icons/fi";
import Loader from "../../../components/Loader";
import EmptyState from "../../../components/EmptyState";
import ConfirmModal from "../../../components/ConfirmModal";
import * as tourService from "../../../services/tourService";
import * as destinationService from "../../../services/destinationService";
import { getErrorMessage } from "../../../services/api";

const categories = ["adventure", "beach", "cultural", "wildlife", "mountain", "city", "cruise", "honeymoon", "family"];
const difficulties = ["easy", "moderate", "challenging"];

const emptyForm = {
  title: "", destination: "", summary: "", description: "", price: "", discountPrice: "",
  duration: "", maxGroupSize: "10", difficulty: "easy", category: "adventure",
  inclusions: "", exclusions: "",
};

const ManageTours = () => {
  const [tours, setTours] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [images, setImages] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const [tourRes, destRes] = await Promise.all([
        tourService.getTours({ limit: 100 }),
        destinationService.getDestinations({ limit: 100 }),
      ]);
      setTours(tourRes.data);
      setDestinations(destRes.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ ...emptyForm, destination: destinations[0]?._id || "" });
    setImages(null);
    setModalOpen(true);
  };

  const openEdit = (tour) => {
    setEditing(tour);
    setForm({
      title: tour.title, destination: tour.destination?._id || "", summary: tour.summary,
      description: tour.description, price: tour.price, discountPrice: tour.discountPrice || "",
      duration: tour.duration, maxGroupSize: tour.maxGroupSize, difficulty: tour.difficulty,
      category: tour.category, inclusions: (tour.inclusions || []).join(", "), exclusions: (tour.exclusions || []).join(", "),
    });
    setImages(null);
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => formData.append(key, value));
      if (images) {
        Array.from(images).forEach((file) => formData.append("images", file));
      }

      if (editing) {
        await tourService.updateTour(editing._id, formData);
        toast.success("Tour updated");
      } else {
        await tourService.createTour(formData);
        toast.success("Tour created");
      }
      setModalOpen(false);
      load();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      await tourService.deleteTour(deleteTarget._id);
      toast.success("Tour deleted");
      setDeleteTarget(null);
      load();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div>
      <div className="flex justify-end mb-6">
        <button onClick={openCreate} disabled={destinations.length === 0} className="btn-primary">
          <FiPlus /> Add Tour
        </button>
      </div>

      {destinations.length === 0 && !loading && (
        <p className="text-sm text-coral-600 mb-4">Create a destination first before adding tours.</p>
      )}

      {loading ? (
        <Loader />
      ) : tours.length === 0 ? (
        <EmptyState title="No tours yet" />
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ink/5 text-left text-ink/40 text-xs uppercase">
                <th className="p-4">Tour</th>
                <th className="p-4">Destination</th>
                <th className="p-4">Price</th>
                <th className="p-4">Duration</th>
                <th className="p-4">Rating</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tours.map((t) => (
                <tr key={t._id} className="border-b border-ink/5 last:border-0">
                  <td className="p-4 font-semibold flex items-center gap-3">
                    <img src={t.coverImage} alt="" className="w-10 h-10 rounded-lg object-cover" />
                    {t.title}
                  </td>
                  <td className="p-4 text-ink/60">{t.destination?.name}</td>
                  <td className="p-4">₹{t.discountPrice > 0 ? t.discountPrice : t.price}</td>
                  <td className="p-4">{t.duration}d</td>
                  <td className="p-4">{t.rating?.toFixed(1) || "—"}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 justify-end">
                      <button onClick={() => openEdit(t)} className="w-8 h-8 rounded-full bg-ink/5 flex items-center justify-center hover:bg-ocean-50 hover:text-ocean-700">
                        <FiEdit2 size={14} />
                      </button>
                      <button onClick={() => setDeleteTarget(t)} className="w-8 h-8 rounded-full bg-ink/5 flex items-center justify-center hover:bg-coral-50 hover:text-coral-600">
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-[100] bg-ink/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 my-8">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-display font-semibold text-lg">{editing ? "Edit" : "Add"} Tour</h3>
              <button onClick={() => setModalOpen(false)}><FiX size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
              <div>
                <label className="label">Title</label>
                <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input-field" />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Destination</label>
                  <select required value={form.destination} onChange={(e) => setForm({ ...form, destination: e.target.value })} className="input-field">
                    {destinations.map((d) => <option key={d._id} value={d._id}>{d.name}, {d.country}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Category</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input-field">
                    {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="label">Summary</label>
                <input required maxLength={250} value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} className="input-field" />
              </div>
              <div>
                <label className="label">Description</label>
                <textarea required rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field resize-none" />
              </div>
              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="label">Price (₹)</label>
                  <input required type="number" min={0} value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="input-field" />
                </div>
                <div>
                  <label className="label">Discount price (₹)</label>
                  <input type="number" min={0} value={form.discountPrice} onChange={(e) => setForm({ ...form, discountPrice: e.target.value })} className="input-field" />
                </div>
                <div>
                  <label className="label">Duration (days)</label>
                  <input required type="number" min={1} value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} className="input-field" />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Max group size</label>
                  <input type="number" min={1} value={form.maxGroupSize} onChange={(e) => setForm({ ...form, maxGroupSize: e.target.value })} className="input-field" />
                </div>
                <div>
                  <label className="label">Difficulty</label>
                  <select value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value })} className="input-field">
                    {difficulties.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Inclusions (comma separated)</label>
                  <input value={form.inclusions} onChange={(e) => setForm({ ...form, inclusions: e.target.value })} className="input-field" />
                </div>
                <div>
                  <label className="label">Exclusions (comma separated)</label>
                  <input value={form.exclusions} onChange={(e) => setForm({ ...form, exclusions: e.target.value })} className="input-field" />
                </div>
              </div>
              <div>
                <label className="label">Images (first becomes cover)</label>
                <input type="file" accept="image/*" multiple onChange={(e) => setImages(e.target.files)} className="input-field" />
              </div>
              <button type="submit" disabled={submitting} className="btn-primary w-full">
                {submitting ? "Saving..." : editing ? "Update Tour" : "Create Tour"}
              </button>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        open={!!deleteTarget}
        title="Delete this tour?"
        message="This will permanently remove the tour and cannot be undone."
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default ManageTours;
