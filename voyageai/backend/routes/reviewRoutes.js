import express from "express";
import {
  createReview,
  getTourReviews,
  getAllReviews,
  deleteReview,
} from "../controllers/reviewController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createReview);
router.get("/tour/:tourId", getTourReviews);
router.get("/", protect, admin, getAllReviews);
router.delete("/:id", protect, deleteReview);

export default router;
