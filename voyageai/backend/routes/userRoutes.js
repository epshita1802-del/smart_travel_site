import express from "express";
import {
  updateProfile,
  toggleFavorite,
  getFavorites,
  getUsers,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import upload from "../config/multer.js";

const router = express.Router();

router.put("/profile", protect, upload.single("avatar"), updateProfile);
router.get("/favorites", protect, getFavorites);
router.put("/favorites/:tourId", protect, toggleFavorite);

router.get("/", protect, admin, getUsers);
router.put("/:id", protect, admin, updateUser);
router.delete("/:id", protect, admin, deleteUser);

export default router;
