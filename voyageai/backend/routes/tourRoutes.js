import express from "express";
import {
  getTours,
  getTourBySlug,
  createTour,
  updateTour,
  deleteTour,
} from "../controllers/tourController.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import upload from "../config/multer.js";

const router = express.Router();

router.get("/", getTours);
router.get("/:slug", getTourBySlug);

router.post("/", protect, admin, upload.array("images", 6), createTour);
router.put("/:id", protect, admin, upload.array("images", 6), updateTour);
router.delete("/:id", protect, admin, deleteTour);

export default router;
