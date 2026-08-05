import express from "express";
import {
  submitContactMessage,
  getContactMessages,
  updateContactMessageStatus,
  deleteContactMessage,
} from "../controllers/contactController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", submitContactMessage);
router.get("/", protect, admin, getContactMessages);
router.put("/:id", protect, admin, updateContactMessageStatus);
router.delete("/:id", protect, admin, deleteContactMessage);

export default router;