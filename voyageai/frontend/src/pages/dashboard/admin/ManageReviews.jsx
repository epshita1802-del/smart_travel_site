import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiTrash2 } from "react-icons/fi";
import Loader from "../../../components/Loader";
import EmptyState from "../../../components/EmptyState";
import ConfirmModal from "../../../components/ConfirmModal";
import RatingStars from "../../../components/RatingStars";
import * as reviewService from "../../../services/reviewService";
import { getErrorMessage } from "../../../services/api";

const ManageReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await reviewService.getAllReviews();
      setReviews(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async () => {
    try {
      await reviewService.deleteReview(deleteTarget._id);
      toast.success("Review deleted");
      setDeleteTarget(null);
      load();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  if (loading) return <Loader full />;
  if (reviews.length === 0) return <EmptyState title="No reviews yet" />;

  return (
    <div className="space-y-4">
      {reviews.map((r) => (
        <div key={r._id} className="card p-5 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <p className="font-semibold text-sm">{r.user?.name}</p>
              <span className="text-ink/30 text-xs">on</span>
              <p className="text-sm text-ocean-700 font-semibold">{r.tour?.title}</p>
            </div>
            <RatingStars rating={r.rating} showValue={false} />
            <p className="text-sm text-ink/60 mt-2">{r.comment}</p>
          </div>
          <button onClick={() => setDeleteTarget(r)} className="w-8 h-8 rounded-full bg-ink/5 flex items-center justify-center hover:bg-coral-50 hover:text-coral-600 shrink-0">
            <FiTrash2 size={14} />
          </button>
        </div>
      ))}

      <ConfirmModal
        open={!!deleteTarget}
        title="Delete this review?"
        message="This will permanently remove the review and recalculate the tour's rating."
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default ManageReviews;
