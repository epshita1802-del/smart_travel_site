import express from "express";
import {
  destinationRecommendation,
  budgetRecommendation,
  generateItinerary,
  generatePackingChecklist,
  generateTravelTips,
  generateNearbyAttractions,
} from "../controllers/aiController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/destination-recommendation", protect, destinationRecommendation);
router.post("/budget-recommendation", protect, budgetRecommendation);
router.post("/itinerary", protect, generateItinerary);
router.post("/packing-checklist", protect, generatePackingChecklist);
router.post("/travel-tips", protect, generateTravelTips);
router.post("/nearby-attractions", protect, generateNearbyAttractions);

export default router;
