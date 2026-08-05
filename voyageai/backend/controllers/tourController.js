import asyncHandler from "../middleware/asyncHandler.js";
import Tour from "../models/Tour.js";
import Review from "../models/Review.js";

// @desc    Get all tours with search/filter/sort/pagination
// @route   GET /api/tours
// @access  Public
export const getTours = asyncHandler(async (req, res) => {
  const {
    search,
    category,
    difficulty,
    destination,
    minPrice,
    maxPrice,
    duration,
    sort,
    featured,
    page = 1,
    limit = 9,
  } = req.query;

  const query = { isActive: true };

  if (search) {
    query.$text = { $search: search };
  }
  if (category) query.category = category;
  if (difficulty) query.difficulty = difficulty;
  if (destination) query.destination = destination;
  if (featured === "true") query.isFeatured = true;

  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  if (duration) {
    query.duration = { $lte: Number(duration) };
  }

  let sortOption = "-createdAt";
  if (sort === "price-asc") sortOption = "price";
  if (sort === "price-desc") sortOption = "-price";
  if (sort === "rating") sortOption = "-rating";
  if (sort === "duration") sortOption = "duration";

  const skip = (Number(page) - 1) * Number(limit);

  const [tours, total] = await Promise.all([
    Tour.find(query)
      .populate("destination", "name country continent coverImage")
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit)),
    Tour.countDocuments(query),
  ]);

  res.json({
    success: true,
    count: tours.length,
    total,
    page: Number(page),
    pages: Math.ceil(total / Number(limit)),
    data: tours,
  });
});

// @desc    Get single tour by slug
// @route   GET /api/tours/:slug
// @access  Public
export const getTourBySlug = asyncHandler(async (req, res) => {
  const tour = await Tour.findOne({ slug: req.params.slug }).populate(
    "destination",
    "name country continent coverImage"
  );

  if (!tour) {
    res.status(404);
    throw new Error("Tour not found");
  }

  const reviews = await Review.find({ tour: tour._id })
    .populate("user", "name avatar")
    .sort("-createdAt");

  res.json({ success: true, data: { tour, reviews } });
});

// @desc    Create tour
// @route   POST /api/tours
// @access  Private/Admin
export const createTour = asyncHandler(async (req, res) => {
  const payload = { ...req.body, createdBy: req.user._id };

  if (req.files && req.files.length > 0) {
    payload.images = req.files.map((f) => `/uploads/${f.filename}`);
    payload.coverImage = payload.images[0];
  }

  ["inclusions", "exclusions", "startDates"].forEach((field) => {
    if (typeof payload[field] === "string") {
      payload[field] = payload[field].split(",").map((v) => v.trim());
    }
  });

  if (typeof payload.itinerary === "string") {
    payload.itinerary = JSON.parse(payload.itinerary);
  }

  const tour = await Tour.create(payload);
  res.status(201).json({ success: true, data: tour });
});

// @desc    Update tour
// @route   PUT /api/tours/:id
// @access  Private/Admin
export const updateTour = asyncHandler(async (req, res) => {
  const tour = await Tour.findById(req.params.id);

  if (!tour) {
    res.status(404);
    throw new Error("Tour not found");
  }

  const updates = { ...req.body };

  if (req.files && req.files.length > 0) {
    updates.images = req.files.map((f) => `/uploads/${f.filename}`);
    updates.coverImage = updates.images[0];
  }

  ["inclusions", "exclusions", "startDates"].forEach((field) => {
    if (typeof updates[field] === "string") {
      updates[field] = updates[field].split(",").map((v) => v.trim());
    }
  });

  if (typeof updates.itinerary === "string") {
    updates.itinerary = JSON.parse(updates.itinerary);
  }

  Object.assign(tour, updates);
  const updated = await tour.save();

  res.json({ success: true, data: updated });
});

// @desc    Delete tour
// @route   DELETE /api/tours/:id
// @access  Private/Admin
export const deleteTour = asyncHandler(async (req, res) => {
  const tour = await Tour.findById(req.params.id);

  if (!tour) {
    res.status(404);
    throw new Error("Tour not found");
  }

  await tour.deleteOne();
  res.json({ success: true, message: "Tour removed" });
});
