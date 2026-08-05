import asyncHandler from "../middleware/asyncHandler.js";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

// @desc    Update logged-in user's profile
// @route   PUT /api/users/profile
// @access  Private
export const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  user.name = req.body.name || user.name;
  user.phone = req.body.phone || user.phone;

  if (req.body.email && req.body.email !== user.email) {
    const emailTaken = await User.findOne({ email: req.body.email });
    if (emailTaken) {
      res.status(400);
      throw new Error("Email already in use");
    }
    user.email = req.body.email;
  }

  if (req.file) {
    user.avatar = `/uploads/${req.file.filename}`;
  }

  if (req.body.password) {
    user.password = req.body.password;
  }

  const updatedUser = await user.save();

  res.json({
    success: true,
    data: {
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      avatar: updatedUser.avatar,
      phone: updatedUser.phone,
      token: generateToken(updatedUser._id),
    },
  });
});

// @desc    Toggle a tour as favorite
// @route   PUT /api/users/favorites/:tourId
// @access  Private
export const toggleFavorite = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const { tourId } = req.params;

  const index = user.favorites.findIndex((id) => id.toString() === tourId);

  if (index > -1) {
    user.favorites.splice(index, 1);
  } else {
    user.favorites.push(tourId);
  }

  await user.save();
  res.json({ success: true, data: user.favorites });
});

// @desc    Get logged-in user's favorite tours
// @route   GET /api/users/favorites
// @access  Private
export const getFavorites = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate({
    path: "favorites",
    populate: { path: "destination", select: "name country" },
  });
  res.json({ success: true, data: user.favorites });
});

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
export const getUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(keyword).sort("-createdAt");
  res.json({ success: true, count: users.length, data: users });
});

// @desc    Update a user (role/active status) - admin
// @route   PUT /api/users/:id
// @access  Private/Admin
export const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  user.role = req.body.role || user.role;
  if (typeof req.body.isActive === "boolean") {
    user.isActive = req.body.isActive;
  }

  const updatedUser = await user.save();
  res.json({ success: true, data: updatedUser });
});

// @desc    Delete a user
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  await user.deleteOne();
  res.json({ success: true, message: "User removed" });
});
