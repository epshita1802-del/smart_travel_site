import asyncHandler from "../middleware/asyncHandler.js";
import Review from "../models/Review.js";
import Tour from "../models/Tour.js";
import Booking from "../models/Booking.js";

// @desc    Create a review for a tour
// @route   POST /api/reviews
// @access  Private
export const createReview = asyncHandler(async (req, res) => {
  const { tourId, rating, comment } = req.body;

  const tour = await Tour.findById(tourId);
  if (!tour) {
    res.status(404);
    throw new Error("Tour not found");
  }

  const hasBooked = await Booking.findOne({
    user: req.user._id,
    tour: tourId,
    status: { $in: ["confirmed", "completed"] },
  });

  if (!hasBooked) {
    res.status(403);
    throw new Error("You can only review tours you have booked");
  }

  const alreadyReviewed = await Review.findOne({ user: req.user._id, tour: tourId });
  if (alreadyReviewed) {
    res.status(400);
    throw new Error("You have already reviewed this tour");
  }

  const review = await Review.create({
    user: req.user._id,
    tour: tourId,
    rating,
    comment,
  });

  const populated = await review.populate("user", "name avatar");
  res.status(201).json({ success: true, data: populated });
});

// @desc    Get all reviews for a tour
// @route   GET /api/reviews/tour/:tourId
// @access  Public
export const getTourReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ tour: req.params.tourId })
    .populate("user", "name avatar")
    .sort("-createdAt");
  res.json({ success: true, count: reviews.length, data: reviews });
});

// @desc    Get all reviews (admin)
// @route   GET /api/reviews
// @access  Private/Admin
export const getAllReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find()
    .populate("user", "name email")
    .populate("tour", "title")
    .sort("-createdAt");
  res.json({ success: true, count: reviews.length, data: reviews });
});

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private (owner or admin)
export const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    res.status(404);
    throw new Error("Review not found");
  }

  if (review.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Not authorized to delete this review");
  }

  await Review.findOneAndDelete({ _id: req.params.id });
  res.json({ success: true, message: "Review removed" });
});
