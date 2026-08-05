const Loader = ({ full = false, label = "Loading..." }) => {
  if (full) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 rounded-full border-4 border-ocean-100 border-t-coral-500 animate-spin" />
        <p className="text-sm text-ink/50 font-medium">{label}</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-10">
      <div className="w-8 h-8 rounded-full border-4 border-ocean-100 border-t-coral-500 animate-spin" />
    </div>
  );
};

export default Loader;
