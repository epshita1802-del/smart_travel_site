import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiPlus, FiEdit2, FiTrash2, FiX } from "react-icons/fi";
import Loader from "../../../components/Loader";
import EmptyState from "../../../components/EmptyState";
import ConfirmModal from "../../../components/ConfirmModal";
import * as destinationService from "../../../services/destinationService";
import { getErrorMessage } from "../../../services/api";

const continents = ["Asia", "Europe", "Africa", "North America", "South America", "Australia", "Antarctica"];

const emptyForm = {
  name: "", country: "", continent: "Asia", description: "", shortDescription: "",
  bestTimeToVisit: "", averageBudget: "", tags: "", popularAttractions: "", isFeatured: false,
};

const ManageDestinations = () => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [coverImage, setCoverImage] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await destinationService.getDestinations({ limit: 100 });
      setDestinations(res.data);
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
    setForm(emptyForm);
    setCoverImage(null);
    setModalOpen(true);
  };

  const openEdit = (dest) => {
    setEditing(dest);
    setForm({
      name: dest.name, country: dest.country, continent: dest.continent,
      description: dest.description, shortDescription: dest.shortDescription || "",
      bestTimeToVisit: dest.bestTimeToVisit || "", averageBudget: dest.averageBudget || "",
      tags: (dest.tags || []).join(", "), popularAttractions: (dest.popularAttractions || []).join(", "),
      isFeatured: dest.isFeatured,
    });
    setCoverImage(null);
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => formData.append(key, value));
      if (coverImage) formData.append("coverImage", coverImage);

      if (editing) {
        await destinationService.updateDestination(editing._id, formData);
        toast.success("Destination updated");
      } else {
        await destinationService.createDestination(formData);
        toast.success("Destination created");
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
      await destinationService.deleteDestination(deleteTarget._id);
      toast.success("Destination deleted");
      setDeleteTarget(null);
      load();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div>
      <div className="flex justify-end mb-6">
        <button onClick={openCreate} className="btn-primary"><FiPlus /> Add Destination</button>
      </div>

      {loading ? (
        <Loader />
      ) : destinations.length === 0 ? (
        <EmptyState title="No destinations yet" action={<button onClick={openCreate} className="btn-primary">Add Destination</button>} />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {destinations.map((d) => (
            <div key={d._id} className="card overflow-hidden">
              <img src={d.coverImage || "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400"} alt={d.name} className="w-full h-32 object-cover" />
              <div className="p-4">
                <p className="font-semibold">{d.name}</p>
                <p className="text-xs text-ink/40 mb-3">{d.country} · {d.continent}</p>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(d)} className="btn-outline flex-1 !py-1.5 text-xs"><FiEdit2 size={12} /> Edit</button>
                  <button onClick={() => setDeleteTarget(d)} className="btn-outline !py-1.5 !px-3 text-xs text-coral-600 border-coral-200 hover:bg-coral-50"><FiTrash2 size={12} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-[100] bg-ink/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 my-8">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-display font-semibold text-lg">{editing ? "Edit" : "Add"} Destination</h3>
              <button onClick={() => setModalOpen(false)}><FiX size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Name</label>
                  <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" />
                </div>
                <div>
                  <label className="label">Country</label>
                  <input required value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} className="input-field" />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Continent</label>
                  <select value={form.continent} onChange={(e) => setForm({ ...form, continent: e.target.value })} className="input-field">
                    {continents.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Average budget (Rupees)</label>
                  <input type="number" value={form.averageBudget} onChange={(e) => setForm({ ...form, averageBudget: e.target.value })} className="input-field" />
                </div>
              </div>
              <div>
                <label className="label">Short description</label>
                <input value={form.shortDescription} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })} className="input-field" maxLength={200} />
              </div>
              <div>
                <label className="label">Full description</label>
                <textarea required rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field resize-none" />
              </div>
              <div>
                <label className="label">Best time to visit</label>
                <input value={form.bestTimeToVisit} onChange={(e) => setForm({ ...form, bestTimeToVisit: e.target.value })} className="input-field" />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Tags (comma separated)</label>
                  <input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} className="input-field" placeholder="beach, culture" />
                </div>
                <div>
                  <label className="label">Popular attractions (comma separated)</label>
                  <input value={form.popularAttractions} onChange={(e) => setForm({ ...form, popularAttractions: e.target.value })} className="input-field" />
                </div>
              </div>
              <div>
                <label className="label">Cover image</label>
                <input type="file" accept="image/*" onChange={(e) => setCoverImage(e.target.files[0])} className="input-field" />
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} className="accent-coral-500" />
                Feature this destination on the homepage
              </label>
              <button type="submit" disabled={submitting} className="btn-primary w-full">
                {submitting ? "Saving..." : editing ? "Update Destination" : "Create Destination"}
              </button>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        open={!!deleteTarget}
        title="Delete this destination?"
        message="Destinations with existing tours cannot be deleted."
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default ManageDestinations;
