import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiMail, FiTrash2, FiCheck } from "react-icons/fi";
import Loader from "../../../components/Loader";
import EmptyState from "../../../components/EmptyState";
import ConfirmModal from "../../../components/ConfirmModal";
import * as contactService from "../../../services/contactService";
import { getErrorMessage } from "../../../services/api";

const statusStyles = {
  new: "bg-coral-50 text-coral-700",
  read: "bg-sand-100 text-ink/60",
  replied: "bg-ocean-50 text-ocean-700",
};

const ManageMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await contactService.getContactMessages(filter ? { status: filter } : {});
      setMessages(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [filter]);

  const markStatus = async (msg, status) => {
    try {
      await contactService.updateContactMessageStatus(msg._id, status);
      load();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleDelete = async () => {
    try {
      await contactService.deleteContactMessage(deleteTarget._id);
      toast.success("Message deleted");
      setDeleteTarget(null);
      load();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div>
      <div className="flex gap-2 mb-6">
        <button onClick={() => setFilter("")} className={`px-3 py-1.5 rounded-full text-xs font-semibold ${!filter ? "bg-ocean-700 text-white" : "bg-white text-ink/50"}`}>All</button>
        {["new", "read", "replied"].map((s) => (
          <button key={s} onClick={() => setFilter(s)} className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize ${filter === s ? "bg-ocean-700 text-white" : "bg-white text-ink/50"}`}>{s}</button>
        ))}
      </div>

      {loading ? (
        <Loader />
      ) : messages.length === 0 ? (
        <EmptyState icon={FiMail} title="No messages" message="Contact form submissions will show up here." />
      ) : (
        <div className="space-y-4">
          {messages.map((m) => (
            <div key={m._id} className="card p-5">
              <div className="flex items-start justify-between gap-4 mb-2">
                <div>
                  <p className="font-semibold text-sm">{m.name} <span className="text-ink/40 font-normal">— {m.email}</span></p>
                  <p className="text-sm text-ocean-700 font-semibold mt-1">{m.subject}</p>
                </div>
                <span className={`badge capitalize shrink-0 ${statusStyles[m.status]}`}>{m.status}</span>
              </div>
              <p className="text-sm text-ink/60 mb-4">{m.message}</p>
              <div className="flex items-center justify-between">
                <p className="text-xs text-ink/40">{new Date(m.createdAt).toLocaleString()}</p>
                <div className="flex gap-2">
                  {m.status !== "read" && (
                    <button onClick={() => markStatus(m, "read")} className="btn-outline !py-1.5 text-xs"><FiCheck size={12} /> Mark read</button>
                  )}
                  {m.status !== "replied" && (
                    <button onClick={() => markStatus(m, "replied")} className="btn-outline !py-1.5 text-xs">Mark replied</button>
                  )}
                  <button onClick={() => setDeleteTarget(m)} className="w-8 h-8 rounded-full bg-ink/5 flex items-center justify-center hover:bg-coral-50 hover:text-coral-600">
                    <FiTrash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        open={!!deleteTarget}
        title="Delete this message?"
        message="This will permanently remove the contact message."
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default ManageMessages;