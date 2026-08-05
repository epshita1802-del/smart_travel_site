import { AnimatePresence, motion } from "framer-motion";
import { FiAlertTriangle } from "react-icons/fi";

const ConfirmModal = ({ open, title, message, confirmLabel = "Confirm", danger = true, onConfirm, onCancel }) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/50 backdrop-blur-sm px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onCancel}
        >
          <motion.div
            className="bg-white rounded-2xl shadow-soft max-w-sm w-full p-6"
            initial={{ scale: 0.9, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 10 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${danger ? "bg-coral-50 text-coral-600" : "bg-ocean-50 text-ocean-600"}`}>
              <FiAlertTriangle size={22} />
            </div>
            <h3 className="text-lg font-bold text-ink mb-1">{title}</h3>
            <p className="text-sm text-ink/60 mb-6">{message}</p>
            <div className="flex gap-3">
              <button onClick={onCancel} className="btn-outline flex-1">Cancel</button>
              <button
                onClick={onConfirm}
                className={`btn flex-1 text-white ${danger ? "bg-coral-500 hover:bg-coral-600" : "bg-ocean-600 hover:bg-ocean-700"}`}
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmModal;
