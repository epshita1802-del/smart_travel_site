import express from "express";
import {
  getDestinations,
  getDestinationBySlug,
  createDestination,
  updateDestination,
  deleteDestination,
} from "../controllers/destinationController.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import upload from "../config/multer.js";

const router = express.Router();

router.get("/", getDestinations);
router.get("/:slug", getDestinationBySlug);

router.post("/", protect, admin, upload.single("coverImage"), createDestination);
router.put("/:id", protect, admin, upload.single("coverImage"), updateDestination);
router.delete("/:id", protect, admin, deleteDestination);

export default router;
