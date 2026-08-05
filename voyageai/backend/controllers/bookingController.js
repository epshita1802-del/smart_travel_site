import asyncHandler from "../middleware/asyncHandler.js";
import Booking from "../models/Booking.js";
import Tour from "../models/Tour.js";

// @desc    Create a booking
// @route   POST /api/bookings
// @access  Private
export const createBooking = asyncHandler(async (req, res) => {
  const { tourId, travelDate, numOfTravelers, contactPhone, specialRequests } = req.body;

  const tour = await Tour.findById(tourId);
  if (!tour) {
    res.status(404);
    throw new Error("Tour not found");
  }

  if (!travelDate || !numOfTravelers || !contactPhone) {
    res.status(400);
    throw new Error("Please provide travel date, number of travelers and contact phone");
  }

  const unitPrice = tour.discountPrice > 0 ? tour.discountPrice : tour.price;
  const totalPrice = unitPrice * Number(numOfTravelers);

  const booking = await Booking.create({
    user: req.user._id,
    tour: tourId,
    travelDate,
    numOfTravelers,
    totalPrice,
    contactPhone,
    specialRequests,
  });

  const populated = await booking.populate("tour", "title coverImage price duration");

  res.status(201).json({ success: true, data: populated });
});

// @desc    Get logged-in user's bookings
// @route   GET /api/bookings/my
// @access  Private
export const getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id })
    .populate({
      path: "tour",
      select: "title coverImage price duration destination",
      populate: { path: "destination", select: "name country" },
    })
    .sort("-createdAt");

  res.json({ success: true, count: bookings.length, data: bookings });
});

// @desc    Cancel a booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
export const cancelBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    res.status(404);
    throw new Error("Booking not found");
  }

  if (booking.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Not authorized to cancel this booking");
  }

  if (booking.status === "cancelled") {
    res.status(400);
    throw new Error("Booking is already cancelled");
  }

  booking.status = "cancelled";
  booking.cancelReason = req.body.reason || "Cancelled by user";
  await booking.save();

  res.json({ success: true, data: booking });
});

// @desc    Get all bookings
// @route   GET /api/bookings
// @access  Private/Admin
export const getAllBookings = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const query = {};
  if (status) query.status = status;

  const bookings = await Booking.find(query)
    .populate("user", "name email")
    .populate("tour", "title coverImage price")
    .sort("-createdAt");

  res.json({ success: true, count: bookings.length, data: bookings });
});

// @desc    Update booking status (admin)
// @route   PUT /api/bookings/:id/status
// @access  Private/Admin
export const updateBookingStatus = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    res.status(404);
    throw new Error("Booking not found");
  }

  booking.status = req.body.status || booking.status;
  booking.paymentStatus = req.body.paymentStatus || booking.paymentStatus;
  await booking.save();

  res.json({ success: true, data: booking });
});
