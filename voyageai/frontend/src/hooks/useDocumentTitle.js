import { useEffect } from "react";

const useDocumentTitle = (title) => {
  useEffect(() => {
    document.title = title ? `${title} | VoyageAI` : "VoyageAI | Smart Tour Booking & AI Travel Planner";
  }, [title]);
};

export default useDocumentTitle;
