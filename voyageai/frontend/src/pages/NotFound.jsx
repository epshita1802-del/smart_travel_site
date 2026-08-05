import { Link } from "react-router-dom";
import { FiCompass, FiArrowLeft } from "react-icons/fi";
import useDocumentTitle from "../hooks/useDocumentTitle";

const NotFound = () => {
  useDocumentTitle("Page Not Found");

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 rounded-full bg-coral-50 text-coral-500 flex items-center justify-center mx-auto mb-6">
          <FiCompass size={36} />
        </div>
        <h1 className="font-display font-bold text-6xl text-ink mb-3">404</h1>
        <h2 className="font-display font-semibold text-xl mb-3">Looks like you're off the map</h2>
        <p className="text-ink/50 mb-8">The page you're looking for doesn't exist or may have been moved.</p>
        <Link to="/" className="btn-primary">
          <FiArrowLeft /> Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
