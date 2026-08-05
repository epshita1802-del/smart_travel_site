import { FiInbox } from "react-icons/fi";

const EmptyState = ({ icon: Icon = FiInbox, title = "Nothing here yet", message = "", action = null }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4">
      <div className="w-16 h-16 rounded-full bg-ocean-50 flex items-center justify-center mb-4">
        <Icon className="w-7 h-7 text-ocean-500" />
      </div>
      <h3 className="text-lg font-semibold text-ink">{title}</h3>
      {message && <p className="text-sm text-ink/50 mt-1 max-w-sm">{message}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
};

export default EmptyState;
