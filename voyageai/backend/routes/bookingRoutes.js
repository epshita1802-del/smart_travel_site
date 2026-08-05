import express from "express";
import {
  createBooking,
  getMyBookings,
  cancelBooking,
  getAllBookings,
  updateBookingStatus,
} from "../controllers/bookingController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createBooking);
router.get("/my", protect, getMyBookings);
router.put("/:id/cancel", protect, cancelBooking);

router.get("/", protect, admin, getAllBookings);
router.put("/:id/status", protect, admin, updateBookingStatus);

export default router;
